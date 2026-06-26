'use strict';

// ---------------------------------------------------------------------------
// UTILITAIRES DATE
// ---------------------------------------------------------------------------

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function toYMD(date) {
  return date.toISOString().slice(0, 10);
}

function firstDayOfMonth(year, month) {
  return new Date(year, month - 1, 1);
}

function firstDayOfNextMonthAfter(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function addYears(date, n) {
  return new Date(date.getFullYear() + n, date.getMonth(), date.getDate());
}

function monthsBetween(dateA, dateB) {
  return (dateB.getFullYear() - dateA.getFullYear()) * 12 +
         (dateB.getMonth() - dateA.getMonth());
}

function formatMonthLabel(year, month) {
  return firstDayOfMonth(year, month)
    .toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function formatCurrency(amount) {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// SMIC
// ---------------------------------------------------------------------------

function getSmicForMonth(year, month) {
  const ref = new Date(year, month - 1, 1);
  for (const p of SMIC_HISTORY) {
    const from = new Date(p.from);
    const to   = new Date(p.to);
    to.setDate(to.getDate() + 1); // end is inclusive → make exclusive
    if (ref >= from && ref < to) return p.monthly;
  }
  return SMIC_HISTORY[SMIC_HISTORY.length - 1].monthly;
}

// ---------------------------------------------------------------------------
// TRANCHE D'ÂGE
// Règle : le nouveau taux s'applique le 1er jour du mois civil suivant
//         la date d'anniversaire. (Art. D6222-31)
// ---------------------------------------------------------------------------

function getAgeBracket(birthDate, refFirstOfMonth) {
  const b18   = addYears(birthDate, 18);
  const b21   = addYears(birthDate, 21);
  const b26   = addYears(birthDate, 26);

  const ch18  = firstDayOfNextMonthAfter(b18);
  const ch21  = firstDayOfNextMonthAfter(b21);
  const ch26  = firstDayOfNextMonthAfter(b26);

  if (refFirstOfMonth >= ch26) return 'ge26';
  if (refFirstOfMonth >= ch21) return '21-25';
  if (refFirstOfMonth >= ch18) return '18-20';
  return 'lt18';
}

function getAgeYears(birthDate, refDate) {
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const m = refDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) age--;
  return age;
}

// ---------------------------------------------------------------------------
// ANNÉE D'EXÉCUTION
// ---------------------------------------------------------------------------

function getExecutionYear(contractStart, refFirstOfMonth, diplomeConfig) {
  const initialYear = (diplomeConfig && diplomeConfig.initialYear) || 1;

  const yr2 = addYears(contractStart, 1);
  const yr3 = addYears(contractStart, 2);

  let natural;
  if (refFirstOfMonth >= yr3)      natural = 3;
  else if (refFirstOfMonth >= yr2) natural = 2;
  else                             natural = 1;

  return Math.min(natural + (initialYear - 1), 3);
}

// ---------------------------------------------------------------------------
// TAUX APPLICABLE
// ---------------------------------------------------------------------------

function getLegalRate(bracket, execYear) {
  return LEGAL_GRID[bracket][execYear] || 100;
}

function getEffectiveRate(bracket, execYear, situation) {
  let rate = getLegalRate(bracket, execYear);
  if (situation === 'specialisation-meme-niveau') {
    rate = Math.min(rate + 15, 100);
  }
  return rate;
}

// ---------------------------------------------------------------------------
// BASE DE CALCUL (SMIC ou MAX(SMIC, SMC) si ≥ 21 ans)
// ---------------------------------------------------------------------------

function getBase(smic, smc, bracket) {
  if ((bracket === '21-25' || bracket === 'ge26') && smc && smc > smic) {
    return smc;
  }
  return smic;
}

// ---------------------------------------------------------------------------
// CALCUL NET ESTIMÉ
// ---------------------------------------------------------------------------

/**
 * Retourne { net, isExonere, regime, threshold }
 * regime : 'ancien' (< 01/03/2025) ou 'nouveau' (>= 01/03/2025)
 * threshold : seuil d'exonération utilisé (montant €)
 */
function calculateNet(gross, signatureDate, smicForMonth) {
  const cutoff     = new Date('2025-03-01');
  const isOld      = signatureDate < cutoff;
  const thresholdPct = isOld ? 0.79 : 0.50;
  const threshold  = smicForMonth * thresholdPct;

  if (gross <= threshold) {
    return {
      net: gross,
      isExonere: true,
      regime: isOld ? 'ancien' : 'nouveau',
      threshold,
    };
  }

  const taxable    = gross - threshold;
  const deductions = taxable * 0.22; // taux moyen salarial estimé
  const net        = Math.round((gross - deductions) * 100) / 100;
  return {
    net,
    isExonere: false,
    regime: isOld ? 'ancien' : 'nouveau',
    threshold,
  };
}

// ---------------------------------------------------------------------------
// DÉTECTION DES ANNIVERSAIRES CLÉS (18, 21, 26 ans) dans un mois donné
// ---------------------------------------------------------------------------

function birthdayAgeInMonth(birthDate, year, month) {
  for (const age of [18, 21, 26]) {
    if (
      birthDate.getFullYear() + age === year &&
      birthDate.getMonth() + 1    === month
    ) return age;
  }
  return null;
}

// ---------------------------------------------------------------------------
// GÉNÉRATION DU TABLEAU MENSUEL
// ---------------------------------------------------------------------------

/**
 * params = {
 *   birthDate       : Date
 *   contractStart   : Date  (début d'exécution)
 *   contractEnd     : Date  (fin prévisionnelle)
 *   signatureDate   : Date  (date de signature du CERFA)
 *   situation       : string
 *   diplomeConfig   : object (from DIPLOMES)
 *   customDuration  : number|null
 *   smc             : number|null (salaire minimum conventionnel mensuel brut)
 *   previousBrut    : number|null (dernier brut contrat précédent — succession)
 * }
 */
function generateMonthlyTable(params) {
  const {
    birthDate, contractStart, contractEnd, signatureDate,
    situation, diplomeConfig, smc, previousBrut,
  } = params;

  const rows = [];
  let current    = new Date(contractStart.getFullYear(), contractStart.getMonth(), 1);
  const endMonth = new Date(contractEnd.getFullYear(), contractEnd.getMonth(), 1);

  let prevBracket  = null;
  let prevExecYear = null;
  let prevSmic     = null;

  while (current <= endMonth) {
    const year  = current.getFullYear();
    const month = current.getMonth() + 1;

    const age     = getAgeYears(birthDate, current);
    const bracket = getAgeBracket(birthDate, current);

    // Année d'exécution (prolongation = bloquée à la dernière année régulière)
    let execYear;
    if (situation === 'prolongation') {
      const dc  = diplomeConfig;
      const dur = dc ? (dc.duration || 2) : 2;
      execYear  = Math.min((dc ? dc.initialYear : 1) + dur - 1, 3);
    } else {
      execYear = getExecutionYear(contractStart, current, diplomeConfig);
    }

    const smicAmount = getSmicForMonth(year, month);
    const base       = getBase(smicAmount, smc, bracket);
    const rate       = getEffectiveRate(bracket, execYear, situation);

    let gross = Math.round(base * rate) / 100;

    // Succession de contrats : garantie du brut précédent si plus favorable
    let forcedByPrevious = false;
    if (situation === 'succession-diplome' && previousBrut && gross < previousBrut) {
      gross          = Math.round(previousBrut * 100) / 100;
      forcedByPrevious = true;
    }

    const netData = calculateNet(gross, signatureDate, smicAmount);

    // Événements du mois
    const events = [];
    if (rows.length === 0) {
      events.push({ type: 'start', icon: '🟢', text: 'Début du contrat' });
    }

    if (prevBracket !== null && bracket !== prevBracket) {
      events.push({
        type: 'bracket-change', icon: '⬆️',
        text: `Nouveau taux — passage tranche ${BRACKET_LABELS[bracket]}`,
      });
    }

    if (prevExecYear !== null && execYear !== prevExecYear) {
      events.push({
        type: 'year-change', icon: '📈',
        text: `Passage en ${execYear}e année d'exécution`,
      });
    }

    if (prevSmic !== null && smicAmount !== prevSmic) {
      events.push({
        type: 'smic-change', icon: '💰',
        text: `Revalorisation SMIC → ${formatCurrency(smicAmount)} €`,
      });
    }

    const bdAge = birthdayAgeInMonth(birthDate, year, month);
    if (bdAge && !events.some(e => e.type === 'bracket-change')) {
      events.push({
        type: 'birthday', icon: '🎂',
        text: `Anniversaire ${bdAge} ans (pas de changement de tranche ce mois)`,
      });
    }

    const nextMonth = new Date(year, month, 1);
    if (nextMonth > endMonth) {
      events.push({ type: 'end', icon: '🔴', text: 'Fin du contrat' });
    }

    rows.push({
      year, month, age, bracket, execYear,
      smic: smicAmount, base, rate, gross,
      net: netData.net, isExonere: netData.isExonere,
      regime: netData.regime, threshold: netData.threshold,
      events, forcedByPrevious,
    });

    prevBracket  = bracket;
    prevExecYear = execYear;
    prevSmic     = smicAmount;
    current      = new Date(year, month, 1);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// GÉNÉRATION DES ALERTES
// ---------------------------------------------------------------------------

function generateAlerts(rows, params, today) {
  const alerts = [];
  const { signatureDate, situation } = params;
  const cutoff = new Date('2025-03-01');

  // Régime ancien
  if (signatureDate < cutoff) {
    alerts.push({
      level: 'info', icon: 'ℹ️',
      title: 'Ancien régime de cotisations salariales',
      text: 'Ce contrat a été signé avant le 01/03/2025. L\'exonération de cotisations salariales s\'applique jusqu\'à 79 % du SMIC (et non 50 %). Le net est donc plus proche du brut pour les bas salaires.',
    });
  }

  // 3e contrat même niveau
  if (situation === 'succession-diplome-3e') {
    alerts.push({
      level: 'danger', icon: '🔴',
      title: '3e contrat de même niveau',
      text: 'Un 3e contrat d\'apprentissage de même niveau nécessite l\'accord écrit du directeur du dernier CFA fréquenté. (Art. L6222-15)',
    });
  }

  // Majoration +15 pts
  if (situation === 'specialisation-meme-niveau') {
    alerts.push({
      level: 'warning', icon: '⚠️',
      title: 'Majoration +15 points applicable',
      text: 'Les conditions de la majoration de 15 points sont remplies (Art. D6222-30). Vérifiez que votre CERFA et votre logiciel de paie en tiennent compte.',
    });
  }

  if (!today || !rows.length) return alerts;

  const todayTs  = today instanceof Date ? today : new Date(today);
  const in90days = new Date(todayTs.getTime() + 90 * 86400000);
  const in30days = new Date(todayTs.getTime() + 30 * 86400000);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowDate = new Date(row.year, row.month - 1, 1);
    if (rowDate <= todayTs) continue;

    for (const ev of row.events) {
      if (ev.type === 'bracket-change' && rowDate <= in90days) {
        const prev = rows[i - 1];
        alerts.push({
          level: 'warning', icon: '⚠️',
          title: 'Changement de tranche d\'âge imminent',
          text: `L\'apprenti change de tranche en ${formatMonthLabel(row.year, row.month)}. Le taux passera de ${prev ? prev.rate : '?'}% à ${row.rate}%. Pensez à mettre à jour la paie.`,
        });
      }
      if (ev.type === 'year-change' && rowDate <= in30days) {
        const prev = rows[i - 1];
        alerts.push({
          level: 'warning', icon: '⚠️',
          title: `Passage en ${row.execYear}e année d'exécution imminent`,
          text: `Le contrat passe en ${row.execYear}e année d\'exécution le 1er ${formatMonthLabel(row.year, row.month)}. Nouveau taux : ${row.rate} % (précédent : ${prev ? prev.rate : '?'} %).`,
        });
      }
    }
  }

  return alerts;
}

// ---------------------------------------------------------------------------
// EXPORT CSV
// ---------------------------------------------------------------------------

function buildCSV(rows) {
  const headers = [
    'Mois', 'Âge', 'Tranche', 'Année exec.', 'SMIC (€)',
    'Base (€)', 'Taux (%)', 'Brut min. (€)', 'Net estimé (€)', 'Événements',
  ];
  const lines = [headers.join(';')];

  for (const r of rows) {
    const cells = [
      formatMonthLabel(r.year, r.month),
      r.age,
      BRACKET_LABELS[r.bracket],
      `An ${r.execYear}`,
      r.smic.toFixed(2).replace('.', ','),
      r.base.toFixed(2).replace('.', ','),
      r.rate,
      r.gross.toFixed(2).replace('.', ','),
      r.net.toFixed(2).replace('.', ','),
      r.events.map(e => e.text).join(' | '),
    ];
    lines.push(cells.map(c => `"${c}"`).join(';'));
  }

  return lines.join('\r\n');
}
