'use strict';

// ---------------------------------------------------------------------------
// ÉTAT DE L'APPLICATION
// ---------------------------------------------------------------------------
const appState = {
  signatureDate   : null,
  executionStart  : null,
  executionEnd    : null,
  birthDate       : null,
  situation       : 'premier',
  diplomeConfig   : null,
  customDuration  : null,
  convention      : null,
  smc             : null,
  previousBrut    : null,
};

let currentRows   = [];
let currentAlerts = [];

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  populateDiplomes();
  bindFormEvents();
  initConventionSearch();
  loadFromURL();
  updateSituationFields();
});

// ---------------------------------------------------------------------------
// REMPLISSAGE DE LA LISTE DES DIPLÔMES
// ---------------------------------------------------------------------------
function populateDiplomes() {
  const sel = document.getElementById('diplome');
  DIPLOMES.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.label;
    sel.appendChild(opt);
  });
}

// ---------------------------------------------------------------------------
// LIAISON DES ÉVÉNEMENTS DE FORMULAIRE
// ---------------------------------------------------------------------------
function bindFormEvents() {
  // Case "Même date" pour début d'exécution
  const sameDateCheckbox = document.getElementById('same-date');
  sameDateCheckbox.addEventListener('change', () => {
    const execStartInput = document.getElementById('execution-start');
    execStartInput.disabled = sameDateCheckbox.checked;
    if (sameDateCheckbox.checked) {
      execStartInput.value = document.getElementById('signature-date').value;
    }
  });

  document.getElementById('signature-date').addEventListener('change', e => {
    if (sameDateCheckbox.checked) {
      document.getElementById('execution-start').value = e.target.value;
    }
  });

  // Situation
  document.getElementById('situation').addEventListener('change', updateSituationFields);

  // Diplôme
  document.getElementById('diplome').addEventListener('change', updateDiplomeFields);

  // Formulaire
  document.getElementById('calculateur-form').addEventListener('submit', e => {
    e.preventDefault();
    runCalculation();
  });

  // Reset
  document.getElementById('btn-reset').addEventListener('click', resetForm);

  // Export CSV
  document.getElementById('btn-csv').addEventListener('click', downloadCSV);

  // Copier résumé
  document.getElementById('btn-copy').addEventListener('click', copyResults);

  // Partager URL
  document.getElementById('btn-share').addEventListener('click', shareURL);
}

// ---------------------------------------------------------------------------
// CHAMPS CONDITIONNELS SELON LA SITUATION
// ---------------------------------------------------------------------------
function updateSituationFields() {
  const situation = document.getElementById('situation').value;
  const grpPrev   = document.getElementById('group-previous-brut');
  const grpSpe    = document.getElementById('group-specialisation');

  grpPrev.classList.add('hidden');
  grpSpe.classList.add('hidden');

  if (situation === 'succession-diplome' || situation === 'succession-diplome-3e') {
    grpPrev.classList.remove('hidden');
  }
  if (situation === 'specialisation-meme-niveau') {
    grpSpe.classList.remove('hidden');
  }
}

// ---------------------------------------------------------------------------
// CHAMPS CONDITIONNELS SELON LE DIPLÔME
// ---------------------------------------------------------------------------
function updateDiplomeFields() {
  const diplomeId  = document.getElementById('diplome').value;
  const diplome    = DIPLOMES.find(d => d.id === diplomeId);
  const grpCustom  = document.getElementById('group-custom-duration');
  const noteWrap   = document.getElementById('diplome-note-wrap');
  const noteEl     = document.getElementById('diplome-note');

  if (diplome && diplome.customDuration) {
    grpCustom.classList.remove('hidden');
  } else {
    grpCustom.classList.add('hidden');
  }

  if (diplome && diplome.note) {
    noteEl.textContent = diplome.note;
    noteWrap.classList.remove('hidden');
  } else {
    noteWrap.classList.add('hidden');
  }
}

// ---------------------------------------------------------------------------
// RECHERCHE CONVENTION COLLECTIVE
// ---------------------------------------------------------------------------
function initConventionSearch() {
  const input    = document.getElementById('convention-search');
  const dropdown = document.getElementById('convention-dropdown');
  const selected = document.getElementById('convention-selected');
  const smcGroup = document.getElementById('group-smc');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    dropdown.innerHTML = '';

    if (!q) {
      dropdown.classList.add('hidden');
      return;
    }

    const matches = CONVENTIONS.filter(c =>
      c.idcc.includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q))
    ).slice(0, 12);

    if (!matches.length) {
      dropdown.innerHTML = '<li class="cc-no-result">Aucune convention trouvée</li>';
      dropdown.classList.remove('hidden');
      return;
    }

    matches.forEach(c => {
      const li = document.createElement('li');
      li.className = 'cc-result';
      li.innerHTML = `<span class="idcc-badge">IDCC ${c.idcc}</span><span class="cc-name">${c.name}</span>`;
      li.addEventListener('click', () => selectConvention(c, input, dropdown, selected, smcGroup));
      dropdown.appendChild(li);
    });
    dropdown.classList.remove('hidden');
  });

  // Clic en dehors → ferme le dropdown
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  // Bouton effacer convention
  document.getElementById('btn-clear-convention').addEventListener('click', () => {
    appState.convention = null;
    input.value = '';
    selected.classList.add('hidden');
    smcGroup.classList.add('hidden');
    document.getElementById('smc').value = '';
  });
}

function selectConvention(conv, input, dropdown, selected, smcGroup) {
  appState.convention = conv;
  input.value         = `IDCC ${conv.idcc} — ${conv.name}`;
  dropdown.classList.add('hidden');

  selected.querySelector('.cc-selected-name').textContent = conv.name;
  selected.querySelector('.cc-selected-idcc').textContent = `IDCC ${conv.idcc}`;
  const url = `https://www.legifrance.gouv.fr/conv_coll/id/${conv.idcc}`;
  selected.querySelector('.cc-legilink').href = url;
  selected.classList.remove('hidden');

  smcGroup.classList.remove('hidden');
}

// ---------------------------------------------------------------------------
// CALCUL PRINCIPAL
// ---------------------------------------------------------------------------
function runCalculation() {
  // --- Lecture du formulaire ---
  const signatureDate  = parseDate(document.getElementById('signature-date').value);
  const executionStart = parseDate(document.getElementById('execution-start').value);
  const executionEnd   = parseDate(document.getElementById('execution-end').value);
  const birthDate      = parseDate(document.getElementById('birth-date').value);
  const situation      = document.getElementById('situation').value;
  const diplomeId      = document.getElementById('diplome').value;
  const diplomeConfig  = DIPLOMES.find(d => d.id === diplomeId) || null;
  const smcVal         = parseFloat(document.getElementById('smc').value) || null;
  const prevBrut       = parseFloat(document.getElementById('previous-brut').value) || null;
  const customDurVal   = parseInt(document.getElementById('custom-duration').value, 10) || null;

  // --- Validation basique ---
  const errors = [];
  if (!signatureDate)  errors.push('Date de signature requise.');
  if (!executionStart) errors.push('Date de début d\'exécution requise.');
  if (!executionEnd)   errors.push('Date de fin prévisionnelle requise.');
  if (!birthDate)      errors.push('Date de naissance requise.');
  if (!diplomeId)      errors.push('Veuillez sélectionner un diplôme.');
  if (executionStart && executionEnd && executionEnd <= executionStart) {
    errors.push('La date de fin doit être postérieure à la date de début d\'exécution.');
  }

  if (errors.length) {
    showErrors(errors);
    return;
  }

  clearErrors();

  // Durée personnalisée si nécessaire
  if (diplomeConfig && diplomeConfig.customDuration && customDurVal) {
    diplomeConfig._runtimeDuration = customDurVal;
  }

  const params = {
    birthDate, contractStart: executionStart, contractEnd: executionEnd,
    signatureDate, situation, diplomeConfig, smc: smcVal, previousBrut: prevBrut,
  };

  // --- Génération du tableau ---
  currentRows   = generateMonthlyTable(params);
  currentAlerts = generateAlerts(currentRows, params, new Date());

  // --- Affichage ---
  renderResults(params);

  // Scroll vers les résultats
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// AFFICHAGE DES RÉSULTATS
// ---------------------------------------------------------------------------
function renderResults(params) {
  const results = document.getElementById('results');
  results.classList.remove('hidden');

  renderSummaryCard(params);
  renderMainResult();
  renderAlerts();
  renderTable();
  renderLegalRefs(params);
}

function renderSummaryCard(params) {
  const { birthDate, contractStart, contractEnd, signatureDate, situation, diplomeConfig } = params;
  const ageAtStart = getAgeYears(birthDate, contractStart);
  const bracket    = getAgeBracket(birthDate, contractStart);
  const execYear1  = getExecutionYear(contractStart, contractStart, diplomeConfig);

  const months = monthsBetween(contractStart, contractEnd);
  const years  = Math.floor(months / 12);
  const remM   = months % 12;
  const durLabel = `${years > 0 ? years + ' an' + (years > 1 ? 's' : '') : ''}${remM > 0 ? (years > 0 ? ' et ' : '') + remM + ' mois' : ''}`;

  const situationLabels = {
    'premier':                  'Premier contrat d\'apprentissage',
    'succession-diplome':       'Nouveau contrat après obtention d\'un diplôme',
    'succession-diplome-3e':    '3e contrat de même niveau',
    'specialisation-meme-niveau': 'Spécialisation même niveau (+15 pts)',
    'prolongation':             'Prolongation / redoublement',
    'integration-cycle':        'Intégration en cours de cycle',
  };

  const oldRegime = signatureDate < new Date('2025-03-01');
  const regime    = oldRegime
    ? 'Avant 01/03/2025 — exonération jusqu\'à 79 % du SMIC'
    : 'À partir du 01/03/2025 — exonération jusqu\'à 50 % du SMIC';

  document.getElementById('summary-age').textContent     = `${ageAtStart} ans`;
  document.getElementById('summary-bracket').textContent = BRACKET_LABELS[bracket];
  document.getElementById('summary-exec-year').textContent = `${execYear1}re/ère année`;
  document.getElementById('summary-diplome').textContent = diplomeConfig ? diplomeConfig.label : '—';
  document.getElementById('summary-duration').textContent = durLabel;
  document.getElementById('summary-situation').textContent = situationLabels[params.situation] || params.situation;
  document.getElementById('summary-regime').textContent  = regime;
  document.getElementById('summary-convention').textContent = params.smc
    ? `${appState.convention ? appState.convention.name : 'Convention'} — SMC : ${formatCurrency(params.smc)} €`
    : (appState.convention ? appState.convention.name : 'Base SMIC uniquement');
}

function renderMainResult() {
  if (!currentRows.length) return;

  const first = currentRows[0];

  document.getElementById('result-rate').textContent  = `${first.rate} %`;
  document.getElementById('result-base-label').textContent =
    first.base > first.smic ? 'du SMC' : 'du SMIC';
  document.getElementById('result-gross').textContent = `${formatCurrency(first.gross)} €`;
  document.getElementById('result-smic-ref').textContent =
    `Base SMIC : ${formatCurrency(first.smic)} €`;

  const netEl   = document.getElementById('result-net');
  netEl.textContent = `${formatCurrency(first.net)} €`;

  const netNote = document.getElementById('result-net-note');
  if (first.isExonere) {
    netNote.textContent = `Brut = Net (exonération totale — ${first.regime === 'ancien' ? '79' : '50'} % du SMIC)`;
    netEl.classList.add('is-exonere');
  } else {
    netNote.textContent = `Estimation — cotisations sur la part > ${first.regime === 'ancien' ? '79' : '50'} % du SMIC (≈ 22 % du dépassement)`;
    netEl.classList.remove('is-exonere');
  }
}

function renderAlerts() {
  const container = document.getElementById('alerts-container');
  container.innerHTML = '';

  if (!currentAlerts.length) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  currentAlerts.forEach(a => {
    const div = document.createElement('div');
    div.className = `alert alert--${a.level}`;
    div.innerHTML = `
      <span class="alert-icon">${a.icon}</span>
      <div>
        <strong>${a.title}</strong>
        <p>${a.text}</p>
      </div>`;
    container.appendChild(div);
  });
}

function renderTable() {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';

  currentRows.forEach(row => {
    const tr  = document.createElement('tr');
    const evs = row.events.map(e => `<span class="ev">${e.icon} ${e.text}</span>`).join('');

    tr.className = row.events.length ? 'row-has-event' : '';

    const netDisplay = row.isExonere
      ? `${formatCurrency(row.net)} <span class="tag-exo">= Brut</span>`
      : formatCurrency(row.net);

    tr.innerHTML = `
      <td class="col-month">${formatMonthLabel(row.year, row.month)}</td>
      <td class="col-age">${row.age} ans</td>
      <td class="col-year">An ${row.execYear}</td>
      <td class="col-rate"><strong>${row.rate}&nbsp;%</strong></td>
      <td class="col-smic">${formatCurrency(row.smic)}&nbsp;€</td>
      <td class="col-gross"><strong>${formatCurrency(row.gross)}&nbsp;€</strong>${row.forcedByPrevious ? ' <span class="tag-prev" title="Maintien brut contrat précédent">↑ CC-précédent</span>' : ''}</td>
      <td class="col-net">${netDisplay}&nbsp;€</td>
      <td class="col-events">${evs}</td>`;
    tbody.appendChild(tr);
  });
}

function renderLegalRefs(params) {
  const container = document.getElementById('legal-refs');
  const refs = [
    { text: 'Art. D6222-26 — Grille légale de rémunération',       url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000044583716' },
    { text: 'Art. D6222-27 — Prolongation du contrat',              url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013066' },
    { text: 'Art. D6222-28-1 — Intégration en cours de cycle',      url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013068' },
    { text: 'Art. D6222-29 — Succession de contrats',               url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013070' },
    { text: 'Art. D6222-30 — Majoration +15 points',                url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013072' },
    { text: 'Art. D6222-31 — Changement de tranche d\'âge',         url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013074' },
    { text: 'Art. D6222-32 — Licence professionnelle (1 an)',       url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033013076' },
    { text: 'Art. L6222-15 — 3e contrat de même niveau',            url: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037385803' },
    { text: 'LFSS 2025 — Décret n°2025-290 du 28/03/2025 (seuil 50 % SMIC)', url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051388000' },
    { text: 'Arrêté du 22 mai 2026 — SMIC à 1 867,02 € depuis le 01/06/2026', url: 'https://www.legifrance.gouv.fr' },
  ];

  const activeRefs = filterActiveRefs(refs, params);

  container.innerHTML = activeRefs.map(r =>
    `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer">✅ ${r.text}</a></li>`
  ).join('');
}

function filterActiveRefs(refs, params) {
  // Toujours afficher les refs de base + celles liées à la situation
  const always  = [0, 7, 8, 9]; // D6222-26, L6222-15, LFSS2025, Arrêté SMIC
  const byState = {
    'prolongation':              [1],
    'integration-cycle':        [2],
    'succession-diplome':       [3],
    'succession-diplome-3e':    [3, 7],
    'specialisation-meme-niveau': [4],
  };
  const active = new Set(always);
  (byState[params.situation] || []).forEach(i => active.add(i));
  // Toujours refs D6222-31 et éventuellement D6222-32
  active.add(5);
  if (params.diplomeConfig && (params.diplomeConfig.id === 'licence-pro')) active.add(6);

  return refs.filter((_, i) => active.has(i));
}

// ---------------------------------------------------------------------------
// ERREURS DE VALIDATION
// ---------------------------------------------------------------------------
function showErrors(errors) {
  const box = document.getElementById('form-errors');
  box.innerHTML = errors.map(e => `<p>⚠️ ${e}</p>`).join('');
  box.classList.remove('hidden');
}

function clearErrors() {
  const box = document.getElementById('form-errors');
  box.innerHTML = '';
  box.classList.add('hidden');
}

// ---------------------------------------------------------------------------
// EXPORT CSV
// ---------------------------------------------------------------------------
function downloadCSV() {
  if (!currentRows.length) return;
  const csv  = buildCSV(currentRows);
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `espresso-rh-apprenti-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// COPIER RÉSUMÉ
// ---------------------------------------------------------------------------
function copyResults() {
  if (!currentRows.length) return;
  const first = currentRows[0];
  const last  = currentRows[currentRows.length - 1];
  const text  = [
    '=== Espresso RH — Vérificateur de rémunération apprenti ===',
    '',
    `Taux applicable : ${first.rate} %`,
    `Salaire brut minimum : ${formatCurrency(first.gross)} €`,
    `Estimation nette : ${formatCurrency(first.net)} €`,
    `Base SMIC : ${formatCurrency(first.smic)} €`,
    '',
    `Période : ${formatMonthLabel(first.year, first.month)} → ${formatMonthLabel(last.year, last.month)}`,
    `(${currentRows.length} mois)`,
    '',
    'Source : Espresso RH — calcul 100 % côté navigateur, aucune donnée transmise.',
  ].join('\n');

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy');
    const orig = btn.textContent;
    btn.textContent = '✓ Copié !';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

// ---------------------------------------------------------------------------
// PARTAGER URL (sans données personnelles)
// ---------------------------------------------------------------------------
function shareURL() {
  const params = new URLSearchParams();
  const situation = document.getElementById('situation').value;
  const diplomeId  = document.getElementById('diplome').value;

  params.set('situation', situation);
  params.set('diplome', diplomeId);
  if (appState.convention) params.set('idcc', appState.convention.idcc);

  const url = window.location.origin + window.location.pathname + '?' + params.toString();

  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btn-share');
    const orig = btn.textContent;
    btn.textContent = '✓ Lien copié !';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

// ---------------------------------------------------------------------------
// CHARGEMENT DEPUIS L'URL
// ---------------------------------------------------------------------------
function loadFromURL() {
  const p = new URLSearchParams(window.location.search);
  if (p.has('situation')) {
    const el = document.getElementById('situation');
    if (el) el.value = p.get('situation');
    updateSituationFields();
  }
  if (p.has('diplome')) {
    const el = document.getElementById('diplome');
    if (el) { el.value = p.get('diplome'); updateDiplomeFields(); }
  }
  if (p.has('idcc')) {
    const conv = CONVENTIONS.find(c => c.idcc === p.get('idcc'));
    if (conv) {
      const input    = document.getElementById('convention-search');
      const dropdown = document.getElementById('convention-dropdown');
      const selected = document.getElementById('convention-selected');
      const smcGroup = document.getElementById('group-smc');
      selectConvention(conv, input, dropdown, selected, smcGroup);
    }
  }
}

// ---------------------------------------------------------------------------
// RÉINITIALISATION
// ---------------------------------------------------------------------------
function resetForm() {
  document.getElementById('calculateur-form').reset();
  document.getElementById('results').classList.add('hidden');
  document.getElementById('form-errors').classList.add('hidden');
  document.getElementById('convention-selected').classList.add('hidden');
  document.getElementById('group-smc').classList.add('hidden');
  document.getElementById('group-previous-brut').classList.add('hidden');
  document.getElementById('group-specialisation').classList.add('hidden');
  document.getElementById('group-custom-duration').classList.add('hidden');
  document.getElementById('diplome-note').classList.add('hidden');
  document.getElementById('alerts-container').classList.add('hidden');
  appState.convention = null;
  currentRows = [];
  currentAlerts = [];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
