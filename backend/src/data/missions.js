const missions = [

  // ================================================
  // SÉANCE 1 — AUDIT RECRUTEMENT & INDICATEURS RH
  // ================================================

  {
    seance: 1,
    ordre: 1,
    titre: 'Bienvenue chez COSMETICA™',
    sousTitre: 'Prise de poste : Consultantes RH juniors',
    type: 'individuel',
    description: 'Vous venez d\'être mandatées comme consultantes RH juniors par la DRH Sophie Martin. Avant de commencer vos missions, découvrez l\'entreprise, ses salariés et ses enjeux actuels.',
    contexteNarratif: `
**EMAIL DE SOPHIE MARTIN — 08h47**

Bonjour et bienvenue chez COSMETICA™ !

Je suis ravie que vous rejoigniez notre équipe en mission conseil. Comme je vous l'ai expliqué lors de notre échange téléphonique, nous traversons une période délicate sur le plan RH.

Notre DG, Isabelle Bernard, est très impliquée mais elle manque de temps pour piloter la fonction RH de manière analytique. C'est là que vous intervenez.

**Votre première mission** : Vous familiariser avec notre entreprise, nos équipes, et les premières données que je mets à votre disposition. Prenez le temps de lire les profils de nos collaborateurs — vous en aurez besoin tout au long de votre mission.

Une réunion de lancement est prévue ce matin à 10h avec Isabelle et moi.

Bon courage !
Sophie Martin — RRH COSMETICA™
    `,
    objectifsPedagogiques: [
      'Découvrir le contexte de l\'entreprise fictive COSMETICA™',
      'Identifier les enjeux RH principaux',
      'Se familiariser avec les profils salariés et les données disponibles'
    ],
    thematiquesCertificateur: ['Procédure contrôle gestion RH'],
    dureeEstimeeMin: 20,
    deliverables: [],
    critereDeblocage: { type: 'manuel' },
    pointsRecompense: 10,
    status: 'publiee'
  },

  {
    seance: 1,
    ordre: 2,
    titre: 'Audit Recrutement 2023',
    sousTitre: 'Mission collectif — Analyser les 8 recrutements de l\'année',
    type: 'collectif',
    description: 'Sophie Martin vous remet les données des 8 recrutements réalisés en 2023. Votre équipe doit produire un audit complet qui sera présenté à Isabelle Bernard.',
    contexteNarratif: `
**COMPTE-RENDU RÉUNION DE LANCEMENT — 10h15**

*Isabelle Bernard (DG)* : "Sophie m'a alertée sur notre situation recrutement. 40% des recrutements de 2023 se soldent par des départs avant 12 mois. C'est inacceptable et coûteux. J'ai besoin de comprendre ce qui se passe."

*Sophie Martin (RRH)* : "J'ai préparé les données pour vous. Vous trouverez dans votre espace : les 8 fiches recrutement 2023, les durées de processus, les coûts, et les 3 entretiens de sortie de l'année."

*Marc Durand (Dir. Commercial)* : "Je ne pense pas qu'il y ait de problème dans mon équipe. Les commerciaux qui partent n'étaient tout simplement pas faits pour ce métier."

*Isabelle Bernard* : "Marc, 4 départs dans votre département en 18 mois, c'est un signal que nous ne pouvons pas ignorer. Laissons les consultantes faire leur travail."

**→ Votre mission : Produire l'audit recrutement 2023**
    `,
    objectifsPedagogiques: [
      'Calculer les indicateurs clés du recrutement (délai moyen, coût moyen, taux de rétention)',
      'Identifier les dysfonctionnements dans le processus de recrutement',
      'Construire un tableau de bord recrutement',
      'Formuler des recommandations argumentées'
    ],
    thematiquesCertificateur: ['Indicateurs RH', 'Tableau de bord', 'Procédures contrôle gestion RH', 'Analyse des écarts'],
    dureeEstimeeMin: 90,
    donneesFournies: {
      recrutements2023: [
        { poste: 'Commerciale Junior', departement: 'Commercial', dateOuverture: '2022-11-15', dateEmbauche: '2023-01-09', dureeJours: 55, cout: 8500, source: 'Cabinet', statut: 'en_poste', nomSalarié: 'Laura Simon' },
        { poste: 'Graphiste', departement: 'Marketing', dateOuverture: '2020-08-01', dateEmbauche: '2020-09-07', dureeJours: 37, cout: 3200, source: 'JobBoard', statut: 'démissionné_jan2024', nomSalarié: 'David Perrin' },
        { poste: 'Technicien Qualité', departement: 'Qualité', dateOuverture: '2019-11-15', dateEmbauche: '2020-01-06', dureeJours: 52, cout: 4800, source: 'Cooptation', statut: 'en_poste', nomSalarié: 'Ricardo Garcia' },
        { poste: 'Chargée Grands Comptes', departement: 'Commercial', dateOuverture: '2022-01-15', dateEmbauche: '2022-04-01', dureeJours: 76, cout: 12000, source: 'Cabinet', statut: 'RC_mars2024', nomSalarié: 'Alice Benoît' },
        { poste: 'Responsable Marketing Digital', departement: 'Marketing', dateOuverture: '2021-01-20', dateEmbauche: '2021-03-15', dureeJours: 54, cout: 9800, source: 'LinkedIn', statut: 'en_poste', nomSalarié: 'Eléonore Rousseau' },
        { poste: 'Assistante RH Alternance', departement: 'RH', dateOuverture: '2023-06-01', dateEmbauche: '2023-09-04', dureeJours: 95, cout: 1200, source: 'CFA', statut: 'en_poste', nomSalarié: 'Chloé Lambert' },
        { poste: 'Opératrice Production CDD', departement: 'Production', dateOuverture: '2024-01-10', dateEmbauche: '2024-02-01', dureeJours: 22, cout: 1800, source: 'Indeed', statut: 'en_poste', nomSalarié: 'Anaïs Meunier' },
        { poste: 'Chef de Projet R&D', departement: 'R&D', dateOuverture: '2017-09-15', dateEmbauche: '2017-11-01', dureeJours: 47, cout: 11500, source: 'Cabinet spécialisé', statut: 'en_poste', nomSalarié: 'Karim Fontaine' }
      ],
      entretiensDesortie: [
        { salarié: 'David Perrin', motifOfficiel: 'Projet personnel', motifReel: 'Salaire bloqué depuis 2 ans, travail non reconnu, ambiance pesante', recommanderaitCosmetica: false },
        { salarié: 'Alice Benoît', motifOfficiel: 'Projet personnel', motifReel: 'Management de Marc Durand insupportable, pression excessive, humiliations en réunion', recommanderaitCosmetica: false },
        { salarié: 'Commercial C (anonymisé)', motifOfficiel: 'Opportunité externe', motifReel: 'Objectifs irréalistes, pas de soutien managérial, déséquilibre vie pro/perso', recommanderaitCosmetica: false }
      ],
      benchmarkSecteur: { delaiMoyenCadre: 45, delaiMoyenNonCadre: 28, coutMoyenCadre: 13000, coutMoyenNonCadre: 5500, tauxRetention12mois: 82 }
    },
    deliverables: [
      {
        id: 'del-1-1',
        nom: 'Tableau de bord Recrutement 2023',
        description: 'Fichier Excel/tableur avec calcul des indicateurs : délai moyen par poste et département, coût moyen par recrutement, taux de rétention à 6 et 12 mois, comparaison benchmark secteur',
        instructions: 'Calculez TOUS les indicateurs. Incluez un graphique de comparaison benchmark. Identifiez les anomalies en les surlignant.',
        obligatoire: true,
        critereEvaluation: 'Exactitude des calculs (40%), complétude des indicateurs (30%), lisibilité et pertinence graphiques (30%)'
      },
      {
        id: 'del-1-2',
        nom: 'Rapport d\'audit recrutement',
        description: 'Document Word de 2-3 pages : analyse des dysfonctionnements identifiés, causes probables (croisement données + entretiens sortie), recommandations prioritaires chiffrées',
        instructions: 'Structure obligatoire : 1) Synthèse des indicateurs clés, 2) Analyse causale des dysfonctionnements, 3) Recommandations SMART avec coût et calendrier',
        obligatoire: true,
        critereEvaluation: 'Profondeur de l\'analyse (40%), lien données/causes/recommandations (40%), rédaction professionnelle (20%)'
      }
    ],
    critereDeblocage: { type: 'question', description: 'Question préalable sur la nature du recrutement' },
    pointsRecompense: 25,
    badge: 'Auditrice RH',
    status: 'publiee'
  },

  {
    seance: 1,
    ordre: 3,
    titre: 'Évaluation Individuelle — Séance 1',
    sousTitre: 'Test de connaissances — 20/20 — 30 minutes',
    type: 'individuel',
    description: 'Validation individuelle des acquis de la séance 1. Vous avez 30 minutes. Les questions évaluent votre compréhension théorique ET votre capacité d\'analyse.',
    contexteNarratif: `
**ÉVALUATION INDIVIDUELLE — SÉANCE 1**
*Contrôle de Gestion Sociale RH — Master RH 1ère année*

Cette évaluation est individuelle et compte pour votre note de module.

**Structure (20 points) :**
- Q1 (4/20) : Définir "turnover" et "délai moyen recrutement" (définition + formule)
- Q2 (5/20) : Analyse critique : 40% turnover dept commercial, est-ce acceptable ? Justifiez avec données.
- Q3 (6/20) : Proposez 3 indicateurs pour prédire les risques de démission future chez COSMETICA™
- Q4 (5/20) : Lien budget RH ↔ recrutement. Calculez le coût recrutement en % de la masse salariale brute.

**Critères d'évaluation :**
- Compréhension théorique : 40%
- Analyse critique et utilisation des données : 40%
- Clarté de l'exposition : 20%
    `,
    objectifsPedagogiques: [
      'Valider la compréhension des indicateurs RH recrutement',
      'Évaluer la capacité d\'analyse critique sur données réelles',
      'Vérifier la maîtrise des calculs fondamentaux'
    ],
    thematiquesCertificateur: ['Indicateurs RH', 'Budget RH', 'Analyse des écarts'],
    dureeEstimeeMin: 30,
    deliverables: [],
    critereDeblocage: { type: 'soumission_validee', description: 'Audit recrutement validé par le formateur' },
    pointsRecompense: 0,
    status: 'publiee'
  },

  // ================================================
  // SÉANCE 2 — BUDGET RH & MASSE SALARIALE
  // ================================================

  {
    seance: 2,
    ordre: 1,
    titre: 'Alerte Budget : La Réunion de Crise',
    sousTitre: 'Mission collectif — Analyser le dérapage budgétaire RH 2023',
    type: 'collectif',
    description: 'Nathalie Leblanc vient d\'envoyer un email urgent à Isabelle Bernard : la masse salariale dépasse le budget de 147 400€. Le CODIR est convoqué en urgence. Vous devez préparer l\'analyse.',
    contexteNarratif: `
**EMAIL URGENT — Nathalie Leblanc → Isabelle Bernard**
*Objet : URGENT - Dérapage masse salariale 2023 : +147 400€*

Isabelle,

Je viens de finaliser la clôture sociale de l'exercice 2023. Je dois t'alerter sur un écart significatif entre le budget RH et le réalisé.

Budget MS chargée 2023 : 2 435 000€
Réalisé MS chargée 2023 : 2 582 400€
**Écart : +147 400€ (+6,1%)**

Ce n'est pas tout. Sur le budget RH global, l'écart total est de +198 400€.

Je joins le détail par poste. Nous avons besoin d'une réunion rapide pour identifier les causes et décider des actions pour 2024.

Cordialement,
Nathalie Leblanc — Contrôleure de Gestion

---
**→ Isabelle Bernard vous mandate pour préparer l'analyse de crise avant la réunion CODIR de 14h.**
    `,
    objectifsPedagogiques: [
      'Calculer et analyser la masse salariale chargée',
      'Réaliser une analyse des écarts budgétaires RH',
      'Identifier les causes des dérapages budgétaires',
      'Produire des projections masse salariale N+1 (3 scénarios)',
      'Situer le budget RH dans le compte de résultat'
    ],
    thematiquesCertificateur: ['Budget RH', 'Masse salariale', 'Analyse des écarts', 'Adaptation MS à l\'activité'],
    dureeEstimeeMin: 100,
    donneesFournies: {
      budgetRH2023: {
        masseSalarialeBase: 1714084,
        cotisationsPatronales: 720916,
        totalMSChargee: 2435000,
        formation: 85000,
        recrutement: 42000,
        interim: 30000,
        total: 592000
      },
      realiseRH2023: {
        masseSalarialeBase: 1820000,
        cotisationsPatronales: 762400,
        totalMSChargee: 2582400,
        formation: 62000,
        recrutement: 68000,
        interim: 78000,
        total: 790400
      },
      CA2023: 4050000,
      CA2022: 4765000,
      baisseActivite: -15,
      effectif: 65,
      compteDeResultat: {
        CA: 4050000,
        chargesPersonnel: 2582400,
        autresChargesExploit: 850000,
        dotationsAmortissements: 120000,
        EBITDA: 617600,
        resultatNet: 217600
      }
    },
    deliverables: [
      {
        id: 'del-2-1',
        nom: 'Analyse des écarts budgétaires RH 2023',
        description: 'Tableur : comparaison budget/réalisé pour chaque poste RH, calcul des écarts en valeur et en %, identification des causes principales',
        instructions: 'Format : tableau avec colonnes Budget / Réalisé / Écart € / Écart % / Causes identifiées / Actions correctives. Inclure une synthèse visuelle (graphique en cascade idéalement).',
        obligatoire: true,
        critereEvaluation: 'Exactitude calculs (40%), analyse causale cohérente avec les données salariés (40%), présentation professionnelle (20%)'
      },
      {
        id: 'del-2-2',
        nom: 'Projections Masse Salariale 2024 — 3 scénarios',
        description: 'Projection de la masse salariale 2024 selon 3 scénarios : optimiste (activité +5%), réaliste (stable), pessimiste (baisse -10%). Pour chaque scénario : actions RH nécessaires et impact sur les effectifs.',
        instructions: 'Calculez la MS projetée pour chaque scénario. Identifiez les leviers d\'adaptation disponibles (hors réduction de salaire). Chiffrez l\'impact de chaque levier.',
        obligatoire: true,
        critereEvaluation: 'Rigueur des projections (40%), pertinence des leviers d\'adaptation (40%), présentation executive (20%)'
      },
      {
        id: 'del-2-3',
        nom: 'Extrait Compte de Résultat commenté',
        description: 'Présenter le budget RH dans le compte de résultat de COSMETICA™. Commenter le ratio charges de personnel / CA et le comparer au benchmark sectoriel.',
        instructions: 'Présentez le P&L simplifié de COSMETICA™. Calculez et commentez : MS/CA, EBE/CA. Situez COSMETICA vs benchmark cosmétique. Concluez sur la situation.',
        obligatoire: false,
        critereEvaluation: 'Compréhension de la structure du compte de résultat (50%), analyse comparative (50%)'
      }
    ],
    critereDeblocage: { type: 'question', description: 'Question préalable sur la masse salariale et l\'adaptation' },
    pointsRecompense: 25,
    badge: 'Analyste Financière RH',
    status: 'publiee'
  },

  {
    seance: 2,
    ordre: 2,
    titre: 'Évaluation Individuelle — Séance 2',
    sousTitre: 'Test de connaissances — 20/20 — 30 minutes',
    type: 'individuel',
    description: 'Évaluation individuelle sur le budget RH, la masse salariale, le PSE et l\'analyse des écarts.',
    contexteNarratif: `
**ÉVALUATION INDIVIDUELLE — SÉANCE 2**
*Contrôle de Gestion Sociale RH — Master RH 1ère année*

**Structure (20 points) :**
- Q1 (4/20) : Calculez le taux de charge patronale de COSMETICA™ et expliquez les composantes principales
- Q2 (5/20) : Masse salariale : calculez-la à partir des données, décomposez l'écart budget/réalisé en effets (niveau, masse, report)
- Q3 (6/20) : PSE : définissez le cadre légal, les conditions déclenchantes, les mesures alternatives possibles. Positionnez COSMETICA face à cette situation.
- Q4 (5/20) : Analyse critique du scénario de votre groupe. Quel mix d'actions correctives auriez-vous recommandé ? Pourquoi ? Chiffrez.
    `,
    objectifsPedagogiques: [
      'Maîtriser le calcul des charges patronales',
      'Analyser la décomposition de la masse salariale',
      'Comprendre le cadre juridique et social du PSE',
      'Formuler des recommandations d\'adaptation budgétaire'
    ],
    thematiquesCertificateur: ['Budget RH', 'Masse salariale', 'PSE', 'Analyse des écarts'],
    dureeEstimeeMin: 30,
    deliverables: [],
    critereDeblocage: { type: 'soumission_validee', description: 'Analyse budgétaire validée par le formateur' },
    pointsRecompense: 0,
    status: 'publiee'
  },

  // ================================================
  // SÉANCE 3 — PERFORMANCE, TURNOVER, ABSENTÉISME
  // ================================================

  {
    seance: 3,
    ordre: 1,
    titre: 'Opération "Thermomètre Social"',
    sousTitre: 'Mission collectif — Analyser la performance et le climat social',
    type: 'collectif',
    description: 'Suite aux alertes de séance 2, Isabelle Bernard décide d\'aller plus loin : elle veut comprendre la corrélation entre absentéisme, turnover et productivité. Vous êtes mandatées pour une analyse de fond.',
    contexteNarratif: `
**NOTE INTERNE — Isabelle Bernard → Équipe Consultantes**

Mesdames,

Votre analyse budgétaire nous a mis face à des réalités difficiles. Je vais maintenant plus loin dans ma demande.

Je veux comprendre : **y a-t-il un lien entre nos problèmes d'absentéisme, notre turnover élevé et notre baisse de productivité ?**

Les données que Sophie vous a préparées sont complètes. Je veux une analyse honnête, même si les conclusions sont inconfortables.

Points spécifiques que j'attends :
1. Qui sont nos salariés "à risque" de départ ? Pourquoi ?
2. Quel est le vrai coût de l'absentéisme pour COSMETICA™ ?
3. Y a-t-il une corrélation entre le management et les départs ?
4. Quel est l'impact sur notre productivité collective ?

**Je veux des faits, des chiffres, et des propositions concrètes.**

Isabelle Bernard — DG COSMETICA™
    `,
    objectifsPedagogiques: [
      'Calculer les indicateurs d\'absentéisme (taux, coût)',
      'Analyser le profil des départs (qui, quand, pourquoi)',
      'Mesurer la productivité par département',
      'Identifier les corrélations entre indicateurs sociaux',
      'Construire un baromètre social préliminaire',
      'Proposer des actions correctives prioritaires'
    ],
    thematiquesCertificateur: ['Indicateurs performance individuels et collectifs', 'Absentéisme', 'Turnover', 'AT/MP', 'Actions correctives', 'Baromètre social'],
    dureeEstimeeMin: 100,
    donneesFournies: {
      indicateursAbsenteisme: {
        joursTheoTravailles: 228,
        totalJoursAbsence: { total: 178, maladie: 122, AT_MP: 12, CP: 18, sansMotif: 3, maternite: 23 },
        tauxAbsenteismeGlobal: 7.1,
        benchmarkSecteur: 5.04,
        coutJournalierMoyen: 280,
        coutTotalEstime: 49840
      },
      profilsDeparts2023_2024: [
        { nom: 'David Perrin', anciennete: 4, departement: 'Marketing', salaire: 2350, motif: 'salaire_perspectives', coutDepart: 17000 },
        { nom: 'Alice Benoît', anciennete: 2, departement: 'Commercial', salaire: 3400, motif: 'management', coutDepart: 27000 },
        { nom: 'Commercial A (anon)', anciennete: 1.5, departement: 'Commercial', salaire: 2800, motif: 'management_objectifs', coutDepart: 20000 },
        { nom: 'Commercial B (anon)', anciennete: 0.8, departement: 'Commercial', salaire: 2700, motif: 'onboarding_culture', coutDepart: 15000 }
      ],
      productivite: {
        CA2023: 4050000,
        CA2022: 4765000,
        evolutionCA: -15,
        effectifETP2023: 58.5,
        CAPE2023: 69231,
        effectifETP2022: 61,
        CAPE2022: 78115,
        evolutionCAparETP: -11.4
      },
      salariesARisque: [
        { nom: 'Julie Petit', risque: 'élevé', motifs: ['offres_reçues', 'burn_out', 'refus_augmentation'], impact_CA: 300000 },
        { nom: 'Sophie Martin', risque: 'élevé', motifs: ['surcharge', 'burnout_naissant', 'manque_ressources'], impact: 'perte_fonction_RH' },
        { nom: 'Karim Fontaine', risque: 'moyen', motifs: ['offre_concurrente_reçue', 'accord_18mois'], impact_CA: 200000 },
        { nom: 'Eléonore Rousseau', risque: 'moyen', motifs: ['ambition_non_satisfaite', 'titre_refusé'], impact: 'perte_expertise_digitale' }
      ]
    },
    deliverables: [
      {
        id: 'del-3-1',
        nom: 'Analyse Absentéisme COSMETICA™ 2023',
        description: 'Analyse complète : calcul du taux global et par catégorie, coût total estimé, profil des absents (qui, quand, combien), comparaison benchmark, recommandations ciblées.',
        instructions: 'Distinguez absolument les types d\'absences : maladie ordinaire ≠ AT/MP ≠ CP légaux ≠ absences injustifiées. Chaque catégorie appelle une réponse différente.',
        obligatoire: true,
        critereEvaluation: 'Rigueur analytique (35%), distinction causale par type (35%), recommandations adaptées (30%)'
      },
      {
        id: 'del-3-2',
        nom: 'Analyse Turnover — Qui part et pourquoi ?',
        description: 'Profil des 4 départs : ancienneté, département, motif réel, coût estimé. Analyse des points communs. Corrélation avec le management de Marc Durand. Quantification du risque.',
        instructions: 'Calculez le coût total des départs 2023-2024. Identifiez le facteur commun principal. Formulez une recommandation managériale.',
        obligatoire: true,
        critereEvaluation: 'Calcul coût turnover (30%), analyse causale (40%), recommandation managériale courageuse (30%)'
      },
      {
        id: 'del-3-3',
        nom: 'Plan d\'action Rétention Talents Critiques',
        description: 'Pour chaque salarié "à risque élevé" : diagnostic, coût de perte, actions de rétention proposées avec coût et délai d\'implémentation. Budget total du plan.',
        instructions: 'Soyez précises et chiffrées. Le budget total du plan de rétention ne doit pas dépasser 35 000€. Priorisez par impact potentiel.',
        obligatoire: true,
        critereEvaluation: 'Pertinence du diagnostic (30%), faisabilité et chiffrage des actions (40%), priorisation argumentée (30%)'
      },
      {
        id: 'del-3-4',
        nom: 'Baromètre Social COSMETICA™ — Version préliminaire',
        description: 'Tableau de bord social avec 8-10 indicateurs : valeur actuelle, benchmark, signal (vert/orange/rouge), tendance, action recommandée.',
        instructions: 'Format visuel impératif. Chaque indicateur doit avoir sa formule de calcul, sa valeur COSMETICA, et son signal coloré. Inclure une note d\'alerte globale sur 10.',
        obligatoire: false,
        critereEvaluation: 'Pertinence des indicateurs (40%), rigueur des calculs (30%), lisibilité et impact visuel (30%)'
      }
    ],
    critereDeblocage: { type: 'question', description: 'Question préalable sur le turnover et le contexte' },
    pointsRecompense: 30,
    badge: 'Détective Sociale',
    status: 'publiee'
  },

  {
    seance: 3,
    ordre: 2,
    titre: 'Évaluation Individuelle — Séance 3',
    sousTitre: 'Test de connaissances — 20/20 — 30 minutes',
    type: 'individuel',
    description: 'Évaluation individuelle sur les indicateurs de performance, l\'absentéisme, le turnover et le baromètre social.',
    contexteNarratif: `
**ÉVALUATION INDIVIDUELLE — SÉANCE 3**
*Contrôle de Gestion Sociale RH — Master RH 1ère année*

**Structure (20 points) :**
- Q1 (4/20) : Formules et calculs — Taux turnover, taux absentéisme, productivité par ETP (formules + calculs sur données COSMETICA™)
- Q2 (5/20) : Cas salarié — Amandine Moreau : 3 absences/an, demande temps partiel refusée, TMS possible. Votre diagnostic RH et vos recommandations.
- Q3 (6/20) : Proposez un baromètre social complet pour COSMETICA™ : 5 indicateurs, avec formule, valeur actuelle, benchmark, et signal.
- Q4 (5/20) : Actions correctives — Listez 3 actions RH prioritaires pour réduire le coût social à COSMETICA™. Chiffrez chaque action (coût + ROI estimé).
    `,
    objectifsPedagogiques: [
      'Calculer les indicateurs de performance sociale',
      'Réaliser un diagnostic RH individuel',
      'Concevoir un baromètre social',
      'Formuler des actions correctives chiffrées'
    ],
    thematiquesCertificateur: ['Indicateurs performance', 'Absentéisme', 'Baromètre social', 'Actions correctives'],
    dureeEstimeeMin: 30,
    deliverables: [],
    critereDeblocage: { type: 'soumission_validee', description: 'Analyses de performance validées par le formateur' },
    pointsRecompense: 0,
    status: 'publiee'
  },

  // ================================================
  // SÉANCE 4 — REPORTING, TABLEAU DE BORD FINAL
  // ================================================

  {
    seance: 4,
    ordre: 1,
    titre: 'Présentation au Conseil de Direction',
    sousTitre: 'Mission collectif — Rapport final de contrôle de gestion sociale',
    type: 'collectif',
    description: 'Vous avez analysé COSMETICA™ sous tous ses angles. Il est temps de synthétiser et de présenter au Conseil de Direction. C\'est votre mission finale — et la plus exigeante.',
    contexteNarratif: `
**CONVOCATION — PRÉSENTATION CODIR COSMETICA™**

*À : Équipe Consultantes RH*
*Objet : Présentation Rapport Annuel Contrôle de Gestion Sociale*
*Date : Séance finale - 14h00*

Mesdames,

Vous avez passé ces dernières semaines à analyser COSMETICA™ dans tous ses aspects : recrutement, budget, performance, risques sociaux.

Le moment est venu de synthétiser vos travaux dans un rapport de contrôle de gestion sociale complet.

**Ce que nous attendons :**

1. **Baromètre Social Final** : 10 indicateurs, scores, signaux, tendances
2. **Rapport de Contrôle** : Bilan 2023, analyse des écarts, points de vigilance
3. **Tableau de Bord Exécutif** : 1 page, pour le Conseil d'Administration
4. **Plan Stratégique RH 2024** : Actions prioritaires, budget, ROI estimé
5. **Présentation orale** : 15 minutes devant le "CODIR" (votre formateur + pairs)

**Règle du jeu** : Isabelle Bernard est exigeante. Elle veut des données, pas des généralités. Elle veut des chiffres, pas des intentions. Et elle veut un plan réaliste, pas une liste de souhaits.

Bonne chance.

Isabelle Bernard — DG COSMETICA™
    `,
    objectifsPedagogiques: [
      'Produire un baromètre social complet et synthétique',
      'Rédiger un rapport de contrôle de gestion sociale professionnel',
      'Concevoir un tableau de bord exécutif (executive summary)',
      'Formuler un plan stratégique RH chiffré pour N+1',
      'Présenter oralement des conclusions RH de niveau direction'
    ],
    thematiquesCertificateur: ['Tableau de bord', 'Reporting', 'Rapports de contrôles', 'Gestion risques', 'Analyse des écarts', 'Baromètre social', 'Procédure contrôle gestion RH'],
    dureeEstimeeMin: 110,
    donneesFournies: {
      synthese: 'Toutes les données des séances 1, 2, 3 disponibles dans les livrables précédents',
      indicateursConsolides: {
        turnoverGlobal: 6.2,
        turnoverCommercial: 40,
        absenteisme: 7.1,
        CAPE: 69231,
        ecartBudgetRH: 198400,
        coutTurnoverTotal: 79000,
        coutAbsenteisme: 49840,
        tauxFormation: 0.034,
        engagementMoyen: 72,
        satisfactionMoyenne: 65,
        nbSalariesARisqueFort: 2,
        nbSalariesARisqueMoyen: 2
      }
    },
    deliverables: [
      {
        id: 'del-4-1',
        nom: 'Baromètre Social COSMETICA™ — Version Finale',
        description: 'Document de synthèse avec 10 indicateurs sociaux, chacun avec : valeur actuelle, historique N-1, benchmark sectoriel, signal RAG (Rouge/Ambre/Vert), commentaire analytique et recommandation.',
        instructions: 'Le baromètre doit couvrir : indicateurs recrutement, MS/budget, absentéisme, turnover, AT/MP, formation, engagement, risques. Format visuel soigné. Score global COSMETICA sur 100.',
        obligatoire: true,
        critereEvaluation: 'Complétude et pertinence (30%), rigueur des calculs (30%), valeur analytique (30%), qualité visuelle (10%)'
      },
      {
        id: 'del-4-2',
        nom: 'Rapport de Contrôle de Gestion Sociale 2023',
        description: 'Rapport complet (5-8 pages) : contexte entreprise, bilan RH quantifié, analyse des écarts, points de vigilance, risques majeurs et plan d\'action 2024.',
        instructions: 'Structure professionnelle obligatoire. Ton : analytique, factuel, sans jugement non étayé. Chaque affirmation doit être soutenue par une donnée.',
        obligatoire: true,
        critereEvaluation: 'Structure et professionnalisme (20%), rigueur analytique (40%), qualité des recommandations (30%), rédaction (10%)'
      },
      {
        id: 'del-4-3',
        nom: 'Tableau de Bord Exécutif — 1 page CA',
        description: 'Une seule page destinée au Conseil d\'Administration (non-spécialistes RH). Visuels percutants, chiffres clés, 3 signaux d\'alerte, 3 décisions stratégiques recommandées.',
        instructions: 'Public : dirigeants non-RH. Langage : financier et stratégique. Format : 1 page strictement. Impact visuel maximal.',
        obligatoire: true,
        critereEvaluation: 'Impact et lisibilité (40%), pertinence de la sélection d\'informations (40%), qualité visuelle (20%)'
      },
      {
        id: 'del-4-4',
        nom: 'Support de Présentation Orale (PowerPoint)',
        description: 'Support de la présentation de 15 minutes devant le CODIR. 8-12 slides maximum. Structure : contexte, bilan, risques, plan d\'action.',
        instructions: 'Chaque slide : 1 message, 1 visuel, le moins de texte possible. Préparez-vous à défendre vos chiffres et vos recommandations sous interrogatoire.',
        obligatoire: true,
        critereEvaluation: 'Qualité narrative (30%), rigueur des données (40%), impact visuel (30%)'
      }
    ],
    critereDeblocage: { type: 'question', description: 'Question préalable sur le baromètre social' },
    pointsRecompense: 40,
    badge: 'DRH Analytics',
    status: 'publiee'
  },

  {
    seance: 4,
    ordre: 2,
    titre: 'Évaluation Individuelle — Séance 4 (Finale)',
    sousTitre: 'Test de connaissances final — 20/20 — 30 minutes',
    type: 'individuel',
    description: 'Évaluation individuelle finale intégrant tous les thèmes du module. Questions de niveau Master — synthèse et analyse stratégique exigées.',
    contexteNarratif: `
**ÉVALUATION FINALE — SÉANCE 4**
*Contrôle de Gestion Sociale RH — Master RH 1ère année*

Cette évaluation finale mobilise TOUS les thèmes du module. Vous devez démontrer votre capacité à penser en DRH analytique, pas seulement à connaître des définitions.

**Structure (20 points) :**
- Q1 (4/20) : Qu'est-ce qu'un "reporting RH efficace" ? Listez 5 critères et illustrez chacun avec un exemple COSMETICA™.
- Q2 (5/20) : Analysez les 4 écarts budgétaires RH 2023 de COSMETICA™. Causes + actions correctives 2024 pour chacun.
- Q3 (6/20) : Vous êtes DRH. Identifiez le TOP 3 des risques sociaux à COSMETICA™ pour les 12 prochains mois. Impact chiffré + plan préventif.
- Q4 (5/20) : Réflexion synthèse — Qu'avez-vous appris sur le contrôle de gestion sociale RH ? Quelles compétences avez-vous développées ? Qu'est-ce qui vous a le plus surpris dans les données de COSMETICA™ ?

**Critères d'évaluation :**
- Compréhension théorique : 40%
- Analyse critique et mobilisation des données : 40%
- Clarté et professionnalisme : 20%
    `,
    objectifsPedagogiques: [
      'Synthétiser les apprentissages du module complet',
      'Démontrer une capacité d\'analyse stratégique de niveau Master',
      'Produire un reporting RH professionnel',
      'Formuler des recommandations de niveau direction'
    ],
    thematiquesCertificateur: ['Tableau de bord', 'Reporting', 'Analyse des écarts', 'Gestion risques', 'Rapports de contrôles', 'Baromètre social'],
    dureeEstimeeMin: 30,
    deliverables: [],
    critereDeblocage: { type: 'soumission_validee', description: 'Rapport final validé par le formateur' },
    pointsRecompense: 0,
    status: 'publiee'
  }

];

module.exports = missions;
