const questions = [

  // ============================================================
  // SÉANCE 1 — PRÉREQUIS + QUESTIONS DE PROGRESSION + ÉVALUATION
  // ============================================================

  {
    seance: 1,
    type: 'vrai_faux',
    categorie: 'prerequis',
    difficulte: 'decouverte',
    sujet: 'Nature du recrutement',
    thematiquesCertificateur: ['Indicateurs RH', 'Procédures contrôle gestion RH'],
    enonce: 'Affirmation à analyser :',
    contexte: "Avant d'accéder aux données de COSMETICA™, testez votre représentation initiale.",
    variations: [
      {
        texte: '"Le recrutement est un coût pur pour l\'entreprise, sans retour sur investissement mesurable."',
        options: [
          { id: 'a', texte: 'Vrai — c\'est une dépense RH comme une autre', correct: false, feedback: 'Incorrect. Le recrutement a un coût direct ET génère un retour : productivité, compétences, innovation. Un recrutement réussi peut représenter 200% du salaire annuel en valeur créée sur 3 ans.' },
          { id: 'b', texte: 'Faux — le recrutement est un investissement en capital humain mesurable', correct: true, feedback: 'Exact ! Le recrutement se mesure : délai moyen, coût par embauche, taux de rétention à 12 mois, performance du nouvel entrant. À COSMETICA, coût moyen d\'un recrutement = 3 mois de salaire. Si le salarié reste 3 ans : ROI positif.' },
          { id: 'c', texte: 'Partiellement vrai — cela dépend du niveau de poste', correct: false, feedback: 'Trop nuancé sans fondement. Tous les recrutements, quel que soit le niveau, peuvent être mesurés via des indicateurs précis. La pédagogie du contrôle de gestion RH vise précisément à objectiver ces décisions.' }
        ],
        explicationComplete: 'En contrôle de gestion RH, le recrutement est systématiquement traité comme un investissement : on calcule le coût total (annonce + cabinet + temps RH + onboarding + formation initiale), on le rapporte à la durée de vie dans l\'entreprise, et on mesure le retour via la productivité et les objectifs atteints. Indicateurs clés : délai moyen de recrutement, coût/embauche, taux d\'adéquation poste/profil, taux de rétention à 6 et 12 mois.'
      },
      {
        texte: '"Le délai moyen de recrutement n\'a aucun impact sur la performance de l\'entreprise."',
        options: [
          { id: 'a', texte: 'Vrai — l\'important c\'est de trouver le bon profil, peu importe le temps', correct: false, feedback: 'Faux. Un poste vacant crée une sous-productivité immédiate. À COSMETICA, 1 poste commercial vacant = perte estimée de 12 000€/mois de CA non réalisé. Le délai a un coût direct.' },
          { id: 'b', texte: 'Faux — chaque jour de poste vacant a un coût opérationnel et financier', correct: true, feedback: 'Exact ! Le délai de recrutement est un KPI RH fondamental. Il se calcule : date d\'embauche - date de déclaration du besoin. Benchmarks sectoriels : 35 jours en moyenne pour un cadre, 21 jours pour un non-cadre. Au-delà : perte de productivité chiffrée.' },
          { id: 'c', texte: 'Vrai dans les grandes entreprises, faux dans les PME', correct: false, feedback: 'La taille n\'est pas le facteur déterminant. Dans une PME comme COSMETICA (65 salariés), l\'impact d\'un poste vacant est proportionnellement encore plus fort qu\'en grande entreprise.' }
        ],
        explicationComplete: 'Le délai moyen de recrutement se calcule : Σ(date embauche - date ouverture poste) / nb recrutements. Il s\'analyse par département, par type de poste, par source de candidature. Un délai long révèle : processus de sélection défaillant, attractivité insuffisante, description de poste floue, ou marché tendu. Actions correctives : vivier candidats, sourcing actif, amélioration marque employeur.'
      },
      {
        texte: '"Un taux de démission élevé dans les 6 premiers mois indique principalement un problème d\'intégration, pas de recrutement."',
        options: [
          { id: 'a', texte: 'Vrai — l\'onboarding est seul responsable', correct: false, feedback: 'Trop restrictif. Les deux phases sont liées : un mauvais recrutement (mauvaise adéquation poste/culture) amplifie l\'échec à l\'intégration. La cause peut être en amont (recrutement) ET en aval (onboarding).' },
          { id: 'b', texte: 'Faux — c\'est à la fois un problème de recrutement ET d\'intégration', correct: true, feedback: 'Exact ! Un départ précoce révèle souvent deux dysfonctionnements cumulés : profil mal sélectionné (problème recrutement) ET accueil insuffisant (problème intégration). Chez COSMETICA, les 4 commerciaux partis avant 6 mois citent : \'je ne savais pas ce dans quoi je m\'engageais\' + \'mon manager ne m\'a pas accompagné\'.' },
          { id: 'c', texte: 'Vrai partiellement — selon la taille du service RH', correct: false, feedback: 'La taille du service RH n\'est pas le bon critère d\'analyse ici. L\'analyse causale doit identifier les vrais leviers : processus de sélection, qualité du brief managérial, qualité du parcours d\'intégration.' }
        ],
        explicationComplete: 'Le taux de démission avant 6 mois est un KPI révélateur de la chaîne recrutement-intégration. Il se calcule : (départs < 6 mois / total embauches) × 100. Benchmark : <10% = excellent, 10-20% = à surveiller, >20% = dysfonctionnement grave. À COSMETICA : 40% de démissions sur recrutements récents. Actions : revoir critères sélection, instaurer parcours d\'intégration structuré (livret accueil, tuteur, jalons 1-3-6 mois).'
      }
    ],
    pointsMax: 5,
    objectifPedagogique: 'Déconstruire les représentations initiales sur le recrutement comme coût vs investissement mesurable',
    notePedagogique: 'Cette question ouvre le débat sur la nature du capital humain. Encourager les étudiantes à partager leur intuition AVANT de voir la correction.'
  },

  {
    seance: 1,
    type: 'qcm_multiple',
    categorie: 'cours',
    difficulte: 'maitrise',
    sujet: 'Indicateurs RH recrutement',
    thematiquesCertificateur: ['Indicateurs RH', 'Tableau de bord'],
    enonce: 'Dans le tableau de bord RH de COSMETICA™, quels indicateurs permettent de mesurer l\'efficacité du processus de recrutement ? (plusieurs réponses possibles)',
    contexte: 'Sophie Martin (RRH) doit présenter son bilan recrutement 2023 à la DG. Elle a recruté 8 personnes : 3 CDI cadres, 3 CDI non-cadres, 1 alternant, 1 stage.',
    donneesNumeriques: {
      recrutements2023: 8,
      dureesMoyennes: { cadre: 52, nonCadre: 28, alternant: 14 },
      coutsMoyens: { cadre: 14200, nonCadre: 5800, alternant: 1200 },
      tauxRetention6mois: 75,
      tauxRetention12mois: 62
    },
    variations: [
      {
        texte: 'Sélectionnez TOUS les indicateurs pertinents pour un tableau de bord recrutement :',
        options: [
          { id: 'a', texte: 'Délai moyen de recrutement (jours)', correct: true, feedback: 'Indicateur fondamental ! Formule : Σ(date embauche - date déclaration besoin) / nb recrutements. Permet de mesurer l\'efficience du processus.' },
          { id: 'b', texte: 'Coût moyen par recrutement (€)', correct: true, feedback: 'Essentiel en contrôle de gestion RH ! Inclure : coûts directs (annonces, cabinet, assessments) + coûts indirects (temps RH + manager × taux horaire chargé).' },
          { id: 'c', texte: 'Âge moyen des candidats reçus en entretien', correct: false, feedback: 'Cet indicateur n\'est pas pertinent pour mesurer l\'efficacité RH (et peut être discriminatoire). Il ne figure pas dans un tableau de bord contrôle de gestion.' },
          { id: 'd', texte: 'Taux de rétention à 6 et 12 mois des nouveaux embauchés', correct: true, feedback: 'KPI clé de la qualité du recrutement ! Révèle l\'adéquation poste/profil et l\'efficacité de l\'intégration. À COSMETICA : 62% à 12 mois = signal d\'alarme (benchmark secteur : 80-85%).' },
          { id: 'e', texte: 'Taux de satisfaction des managers sur les recrutements effectués', correct: true, feedback: 'Indicateur qualitatif crucial. Mesure via questionnaire post-recrutement à 3 mois : le manager est-il satisfait du profil livré ? Révèle la qualité du brief et de la compréhension du besoin.' },
          { id: 'f', texte: 'Nombre de likes sur les offres publiées sur LinkedIn', correct: false, feedback: 'Indicateur de visibilité marketing, pas de performance RH. Le contrôle de gestion RH mesure les résultats (embauches) pas la notoriété digitale.' }
        ],
        explicationComplete: 'Un tableau de bord recrutement complet comporte : indicateurs d\'efficience (délai, coût), indicateurs de qualité (taux rétention, satisfaction manager, performance à 6 mois), indicateurs de volume (nb recrutements ouverts/fermés/annulés). Les benchmarks secteur cosmétique : délai moyen cadre = 45j, coût moyen = 12-18k€, rétention 12 mois = 80%+.'
      }
    ],
    pointsMax: 8,
    objectifPedagogique: 'Maîtriser la sélection d\'indicateurs pertinents vs non pertinents pour un tableau de bord RH',
    notePedagogique: 'Faire discuter le groupe sur pourquoi certains indicateurs "intuitifs" (âge, likes) ne sont pas pertinents en contrôle de gestion.'
  },

  {
    seance: 1,
    type: 'analyse_cas',
    categorie: 'evaluation',
    difficulte: 'expert',
    sujet: 'Analyse turnover et actions correctives',
    thematiquesCertificateur: ['Indicateurs RH', 'Analyse des écarts', 'Actions correctives'],
    enonce: 'ANALYSE DE CAS — Évaluation individuelle Q2 (5/20)',
    contexte: 'COSMETICA™ enregistre un taux de turnover de 40% sur le département commercial en 2023, contre 15% dans le secteur cosmétique français. Données fournies : 3 entretiens de sortie révèlent management autoritaire, absence de perspectives, rémunération sous le marché.',
    donneesNumeriques: {
      turnoverCommercial: 40,
      benchmarkSecteur: 15,
      ecartPourcentage: 25,
      nombreDepartsCommercial: 4,
      effectifMoyenCommercial: 10,
      coutMoyenDepart: 18000,
      coutTotalEstime: 72000
    },
    variations: [
      {
        texte: 'Un taux de turnover de 40% chez les commerciaux de COSMETICA™ est-il acceptable pour une PME cosmétique française ? Justifiez votre réponse en vous appuyant sur des éléments quantitatifs ET qualitatifs, puis proposez 3 actions correctives prioritaires chiffrées.',
        options: [],
        reponseAttendue: 'Non, 40% est inacceptable. Écart de +25 points vs benchmark (15%). Coût estimé : 4 départs × 18 000€ = 72 000€. Causes identifiées (entretiens sortie) : management, perspectives, rémunération. Actions : 1) Audit management Durand + coaching (5-8k€), 2) Révision grille salariale commerciale (+8-12% masse salariale dept), 3) Plan carrière commercial formalisé (0€ coût direct, ROI rétention). Priorité : urgence sur la cause managériale.',
        explicationComplete: 'Le taux de turnover se calcule : (Nombre de départs sur période / Effectif moyen période) × 100 = (4/10) × 100 = 40%. L\'analyse des écarts révèle : benchmark = 15%, écart = +25 points. Impact financier : coût départ estimé à 18 mois de salaire du poste × nb départs. Les actions correctives doivent être SMART, chiffrées, et hiérarchisées par impact/coût.'
      },
      {
        texte: 'Sophie Martin vous demande de calculer le coût réel du turnover commercial 2023 de COSMETICA™. Détaillez votre méthodologie de calcul et identifiez les coûts directs ET indirects. Concluez sur le ROI d\'un plan de rétention à 15 000€.',
        options: [],
        reponseAttendue: 'Coûts directs : recrutement (annonces + cabinet + temps RH) = ~6 000€/départ. Coûts indirects : perte de CA pendant vacance poste (~12 000€/mois/commercial), formation entrant, perte savoir-faire = ~12 000€/départ. Total par départ : ~18 000€. Total 4 départs : 72 000€. Plan rétention 15 000€ : si réduit turnover de 50% → 2 départs évités = 36 000€ économisés. ROI = (36 000 - 15 000) / 15 000 = 140%. Décision : plan à valider.',
        explicationComplete: 'La méthodologie de calcul du coût de turnover distingue : coûts de séparation (solde de tout compte, procédure), coûts de remplacement (sourcing, sélection, onboarding), coûts de transition (perte productivité, surcharge équipe), coûts de formation (montée en compétence nouvel entrant). La synthèse alimente l\'argument financier pour tout plan de rétention.'
      }
    ],
    pointsMax: 5,
    tempsLimiteSecondes: 1200,
    objectifPedagogique: 'Calculer, analyser et proposer des actions correctives sur un cas réel de turnover',
    notePedagogique: 'Évaluer la capacité à structurer une réponse : données → analyse → diagnostic → actions chiffrées. Pénaliser l\'absence de chiffrage.'
  },

  // ============================================================
  // SÉANCE 2 — BUDGET RH & MASSE SALARIALE
  // ============================================================

  {
    seance: 2,
    type: 'vrai_faux',
    categorie: 'prerequis',
    difficulte: 'decouverte',
    sujet: 'Masse salariale et adaptation',
    thematiquesCertificateur: ['Budget RH', 'Masse salariale', 'Adaptation à l\'activité'],
    enonce: 'Vrai ou Faux ?',
    contexte: 'COSMETICA™ a connu une baisse d\'activité de -15% en 2023. La DG réunit son CODIR pour discuter de l\'adaptation de la masse salariale.',
    variations: [
      {
        texte: '"Adapter la masse salariale à une baisse d\'activité signifie obligatoirement réduire les salaires des employés."',
        options: [
          { id: 'a', texte: 'Vrai — baisser l\'activité = baisser les salaires', correct: false, feedback: 'Faux et dangereux juridiquement ! La réduction unilatérale de salaire constitue une modification du contrat de travail nécessitant l\'accord du salarié. En cas de refus, c\'est un licenciement pour motif économique. D\'autres leviers existent.' },
          { id: 'b', texte: 'Faux — d\'autres leviers d\'adaptation existent sans toucher aux salaires de base', correct: true, feedback: 'Exact ! Les leviers d\'adaptation sont multiples : modulation/annualisation du temps de travail, gel des augmentations, réduction heures supplémentaires, non-renouvellement CDD, mobilité interne, chômage partiel (APLD), PSE en dernier recours. Le DRH choisit le mix le plus pertinent.' },
          { id: 'c', texte: 'Cela dépend des conventions collectives', correct: false, feedback: 'Partiellement vrai mais insuffisant comme réponse. Les CCN encadrent les modalités mais le principe reste le même : la réduction unilatérale de salaire est impossible sans accord du salarié.' }
        ],
        explicationComplete: 'L\'adaptation de la masse salariale à l\'activité est l\'un des exercices les plus complexes du contrôle de gestion RH. Les leviers disponibles, du moins au plus impactant : 1) Gel des primes variables, 2) Non-renouvellement CDD/intérim, 3) Modulation horaire, 4) Chômage partiel APLD (65% État), 5) Ruptures conventionnelles collectives, 6) PSE (Plan de Sauvegarde de l\'Emploi). Chaque levier a un coût social, un coût financier direct et un coût indirect (climate social).'
      },
      {
        texte: '"Le budget RH figure intégralement dans les charges d\'exploitation du compte de résultat de l\'entreprise."',
        options: [
          { id: 'a', texte: 'Vrai — toutes les charges RH sont dans le compte de résultat', correct: false, feedback: 'Pas tout à fait. Si les charges de personnel (salaires + cotisations) sont bien dans le compte de résultat en "charges d\'exploitation", les investissements RH (ex : formation capitalisée, aménagement ergonomique) peuvent passer en immobilisations au bilan. La nuance est importante en contrôle de gestion.' },
          { id: 'b', texte: 'Faux — certaines charges RH sont capitalisées au bilan', correct: true, feedback: 'Exact ! La règle générale : les charges de personnel récurrentes (salaires, cotisations, formation de maintien) → compte de résultat. Les investissements humains durables (formation de reconversion longue, aménagement ergonomique, logiciel SIRH) → peuvent être capitalisés au bilan. Cette distinction impact le résultat et les ratios financiers.' },
          { id: 'c', texte: 'Vrai uniquement pour les PME comme COSMETICA', correct: false, feedback: 'La règle comptable ne dépend pas de la taille de l\'entreprise mais de la nature de la charge (courante vs investissement durable).' }
        ],
        explicationComplete: 'Dans le compte de résultat, les charges RH apparaissent principalement en "charges de personnel" : salaires bruts + cotisations patronales + intéressement/participation + charges de formation. Le total représente en moyenne 50-70% des charges d\'exploitation d\'une PME de services. À COSMETICA, masse salariale chargée 2023 = 2 340 000€ pour 65 ETP, soit 58% du CA.'
      }
    ],
    pointsMax: 5,
    objectifPedagogique: 'Comprendre la distinction entre adaptation de la masse salariale et réduction de salaires ; situer le budget RH dans le compte de résultat',
    notePedagogique: 'La variation 2 est plus technique et peut déclencher une discussion sur la comptabilité sociale. Encourager les étudiantes à aller chercher le plan comptable général.'
  },

  {
    seance: 2,
    type: 'calcul',
    categorie: 'cours',
    difficulte: 'maitrise',
    sujet: 'Calcul masse salariale et charges',
    thematiquesCertificateur: ['Budget RH', 'Masse salariale', 'Indicateurs collectifs'],
    enonce: 'EXERCICE DE CALCUL — Analysez la masse salariale de COSMETICA™',
    contexte: 'Nathalie Leblanc (contrôleure de gestion) vous remet les données de paie consolidées 2023. Vous devez calculer et analyser la masse salariale.',
    donneesNumeriques: {
      effectif: 65,
      masseSalarialeBaseBrute: 1820000,
      tauxCotisationsPatronales: 0.42,
      masseSalarialeChargee: 2582400,
      budget2023: 2435000,
      realise2023: 2582400,
      ecart: 147400,
      tachesCA: { salaires: 0.42, autresCharges: 0.16, resultatNet: 0.08 },
      CA2023: 4050000
    },
    variations: [
      {
        texte: 'COSMETICA™ 2023 : masse salariale brute = 1 820 000€, taux de charges patronales moyen = 42%. \n1. Calculez la masse salariale chargée.\n2. Calculez l\'écart budget/réalisé sachant que le budget était de 2 435 000€.\n3. Exprimez la masse salariale chargée en % du CA (CA 2023 = 4 050 000€).\n4. Ce ratio vous semble-t-il préoccupant pour une PME cosmétique ?',
        options: [],
        reponseAttendue: '1. MS chargée = 1 820 000 × 1,42 = 2 582 400€. 2. Écart = 2 582 400 - 2 435 000 = +147 400€ (dépassement +6,1%). 3. MS chargée / CA = 2 582 400 / 4 050 000 = 63,8%. 4. Benchmark PME cosmétique : 45-60%. À 63,8%, COSMETICA est au-dessus du secteur. Préoccupant → nécessite plan d\'action (optimisation effectifs, maitrise augmentations).',
        explicationComplete: 'La masse salariale chargée inclut : salaires bruts + cotisations patronales (URSSAF, retraite, prévoyance, mutuelle) + taxe apprentissage + plan formation obligatoire. Le ratio MS/CA est l\'indicateur clé de suivi budgétaire RH. L\'analyse des écarts (budget vs réel) doit identifier les causes : nouvelles embauches non prévues, augmentations supérieures au budget, absentéisme remplacé par intérim, etc.'
      },
      {
        texte: 'Henri Dupont (responsable paie) vous fournit le détail par catégorie socioprofessionnelle. Cadres : 12 personnes, masse salariale brute 620 000€. ETAM : 28 personnes, MS brute 780 000€. Ouvriers : 25 personnes, MS brute 420 000€. \n1. Calculez le salaire moyen par catégorie.\n2. Comparez à votre connaissance du marché. Commentez.\n3. Quel levier RH actionner pour optimiser sans licencier ?',
        options: [],
        reponseAttendue: '1. Cadres : 620 000/12 = 51 667€/an brut = 4 305€/mois. ETAM : 780 000/28 = 27 857€/an = 2 321€/mois. Ouvriers : 420 000/25 = 16 800€/an = 1 400€/mois. 2. Cadres : dans la norme (+/-). ETAM : dans la norme. Ouvriers : proche du SMIC (1 766€/mois en 2024) → peu de marge. 3. Leviers : gel des parts variables, non-remplacement départs naturels en production, remplacer recrutements externes par mobilité interne, APLD si baisse activité.',
        explicationComplete: 'L\'analyse par CSP permet d\'identifier les poches d\'optimisation sans licenciement. En contrôle de gestion sociale, on distingue : effet niveau (évolution des effectifs), effet masse (augmentations en cours d\'année), effet report (impact sur N+1 des augmentations de N). La décomposition de l\'évolution de la MS en ces 3 effets est un outil technique clé.'
      }
    ],
    pointsMax: 8,
    objectifPedagogique: 'Maîtriser le calcul et l\'analyse de la masse salariale, du ratio MS/CA, et de l\'écart budgétaire',
    notePedagogique: 'La variation 2 est plus technique (analyse par CSP). À réserver aux groupes avancés ou en mission bonus.'
  },

  {
    seance: 2,
    type: 'analyse_cas',
    categorie: 'evaluation',
    difficulte: 'expert',
    sujet: 'PSE et alternatives — évaluation individuelle',
    thematiquesCertificateur: ['PSE', 'Adaptation masse salariale', 'Actions correctives', 'Gestion risques sociaux'],
    enonce: 'ÉVALUATION INDIVIDUELLE S2 — Q3 (6/20) : Analyse critique du plan de restructuration',
    contexte: 'COSMETICA™ fait face à une baisse d\'activité persistante (-15% en 2023, prévision -8% en 2024). Marc Durand propose un PSE affectant 8 postes (dont 5 commerciaux). Sophie Martin résiste et propose des alternatives. Vous êtes consultante RH externe mandatée pour arbitrer.',
    donneesNumeriques: {
      baisseActivite2023: -15,
      prevision2024: -8,
      postesVisesParPSE: 8,
      indemnitesMoyennesPSE: 12000,
      coutTotalPSE: 96000,
      coutAlternativeAPLD: 45000,
      effectifConcerneAPLD: 15,
      tauxPriseEnChargeEtat: 0.65
    },
    variations: [
      {
        texte: 'Analysez les deux scénarios (PSE vs APLD + mobilité interne) sur les plans financier, social et stratégique. Lequel recommandez-vous à Isabelle Bernard ? Justifiez votre recommandation avec des arguments quantitatifs ET qualitatifs. Intégrez les risques associés à chaque option.',
        options: [],
        reponseAttendue: 'PSE : coût direct 96k€ + coût indirect (climat social, image employeur, risque contentieux prud\'hommes) estimé à 40-60k€. Perte de compétences commerciales difficiles à reconstruire. Risque : si activité repart en 2025, recrutements coûteux. APLD : coût net État = 45k€ × (1-0,65) = 15 750€ pour COSMETICA. Maintien des compétences et employabilité. Condition : accord collectif (CSE + syndicats). Recommandation : APLD + plan de formation pendant les heures chômées + gel embauches 6 mois + mobilité interne commerciaux → postes support. Risque APLD : rebond activité non garanti. Engagement minimum 6 mois.',
        explicationComplete: 'Le PSE est encadré par les articles L1233-24 et suivants du Code du travail. Il est obligatoire pour les entreprises de 50 salariés et plus envisageant 10 licenciements sur 30 jours. COSMETICA (65 salariés, 8 suppressions prévues) y est soumise. L\'APLD (Activité Partielle de Longue Durée) permet de réduire le temps de travail jusqu\'à 40% sur 24 mois avec aide de l\'État à 65% des heures chômées. Avantage majeur : maintien des compétences et de l\'employabilité.'
      }
    ],
    pointsMax: 6,
    tempsLimiteSecondes: 1500,
    objectifPedagogique: 'Analyser et arbitrer entre PSE et alternatives, en intégrant les dimensions financière, sociale et stratégique',
    notePedagogique: 'Grille de correction : 2 pts analyse financière chiffrée, 2 pts analyse sociale qualitative, 2 pts recommandation argumentée et risques identifiés.'
  },

  // ============================================================
  // SÉANCE 3 — PERFORMANCE, ABSENTÉISME, TURNOVER, RISQUES
  // ============================================================

  {
    seance: 3,
    type: 'vrai_faux',
    categorie: 'prerequis',
    difficulte: 'decouverte',
    sujet: 'Baromètre social et performance',
    thematiquesCertificateur: ['Indicateurs performance', 'Baromètre social', 'Actions correctives'],
    enonce: 'Question de positionnement avant accès aux données de performance COSMETICA™',
    variations: [
      {
        texte: '"Un turnover élevé dans une entreprise est toujours le signe d\'une mauvaise gestion RH."',
        options: [
          { id: 'a', texte: 'Vrai — le turnover élevé reflète toujours un problème RH', correct: false, feedback: 'Faux dans l\'absolu. Dans certains secteurs (restauration, événementiel, conseil en stratégie), un turnover de 20-30% est structurel au modèle économique. La question est : ce turnover EST-IL adapté au contexte et à la stratégie de l\'entreprise ?' },
          { id: 'b', texte: 'Faux — le contexte sectoriel et stratégique détermine si le turnover est problématique', correct: true, feedback: 'Exact ! La grille d\'analyse contextuelle du turnover : secteur d\'activité (restauration = 80% normal vs industrie = 5% normal), taille entreprise, phase de croissance (startup vs PME mature), profils concernés (commerciaux vs production). À COSMETICA (PME cosmétique stable, 65 salariés) : 40% = très préoccupant car signale instabilité et perte de compétences.' },
          { id: 'c', texte: 'Cela dépend uniquement de la politique de rémunération', correct: false, feedback: 'La rémunération est un facteur parmi d\'autres. Les enquêtes montrent que les causes de départ sont multifactorielles : management (35%), perspectives de carrière (28%), rémunération (22%), ambiance (15%). Réduire le turnover à la seule variable salariale serait réducteur et coûteux.' }
        ],
        explicationComplete: 'Le taux de turnover = (Entrées + Sorties) / 2 / Effectif moyen × 100. Il se décompose en : turnover subi (licenciements, fins CDD) et turnover volontaire (démissions, ruptures conv.). L\'analyse du turnover volontaire est la plus riche en enseignements sur le climat social. Benchmarks France 2023 : tous secteurs = 15%, services = 19%, industrie = 8%, cosmétique = 12-18%.'
      },
      {
        texte: '"L\'absentéisme est un bon indicateur du mal-être au travail dans une entreprise."',
        options: [
          { id: 'a', texte: 'Vrai — absentéisme élevé = mal-être général garanti', correct: false, feedback: 'Partiellement vrai mais trop simpliste. L\'absentéisme a des causes multiples : conditions de travail physiques (TMS, AT), maladie ordinaire, désengagement, contraintes personnelles (enfants malades). Un taux élevé mérite une analyse causale avant de conclure au mal-être.' },
          { id: 'b', texte: 'Vrai mais seulement si l\'on distingue les types d\'absences et leurs causes', correct: true, feedback: 'Exactement ! La démarche de contrôle de gestion sociale exige de désagréger l\'absentéisme : absences courtes et répétées (signal désengagement), arrêts longs (maladie grave ou burn-out), AT/MP (conditions de travail), absences sans justificatif (désengagement ou contraintes). Chaque catégorie appelle une réponse différente.' },
          { id: 'c', texte: 'Faux — l\'absentéisme n\'indique rien sur le bien-être', correct: false, feedback: 'Faux. Même si le lien n\'est pas mécanique, les études montrent une corrélation forte entre taux d\'absentéisme élevé et scores de bien-être faibles (Gallup, Malakoff Humanis Baromètre Absentéisme 2023). L\'absentéisme est un signal faible du climat social.' }
        ],
        explicationComplete: 'Le taux d\'absentéisme = (Jours d\'absence / Jours théoriques travaillés) × 100. Benchmark France 2023 : 5,04%. Taux > 7% = signal d\'alerte. À COSMETICA, 3 profils à analyser : Patrick Chevalier (18,4% - TMS/maladies), Corinne Vidal (21,5% - maladie pro), Julie Petit (7,9% - burn-out latent). Chaque profil nécessite une intervention spécifique (RQTH, aménagement poste, entretien de retour).'
      }
    ],
    pointsMax: 5,
    objectifPedagogique: 'Développer une lecture contextuelle et analytique des indicateurs de performance sociale',
    notePedagogique: 'Déclencher un débat : "Selon vous, quel indicateur est le plus révélateur de la santé sociale d\'une entreprise ? Pourquoi ?"'
  },

  {
    seance: 3,
    type: 'analyse_cas',
    categorie: 'cours',
    difficulte: 'expert',
    sujet: 'Baromètre social COSMETICA™',
    thematiquesCertificateur: ['Baromètre social', 'Indicateurs performance collectifs', 'Capital humain'],
    enonce: 'MISSION INDIVIDUELLE — Construisez le baromètre social de COSMETICA™',
    contexte: 'Vous venez de réaliser l\'analyse des données individuelles des 20 salariés de COSMETICA™. Vous devez synthétiser vos observations dans un baromètre social structuré pour la DG.',
    variations: [
      {
        texte: 'Proposez 5 indicateurs clés pour le baromètre social de COSMETICA™. Pour chacun : nommez-le, définissez sa formule de calcul, précisez son niveau actuel chez COSMETICA, le benchmark sectoriel, et le signal qu\'il envoie.',
        options: [],
        reponseAttendue: 'Exemple de réponse attendue (5 indicateurs parmi) : 1) Taux de turnover global = (4 départs / 65 effectif moy) × 100 = 6,2% → acceptable mais 40% dept commercial préoccupant. 2) Taux absentéisme = jours absence / jours théo × 100 = ~7,1% → au-dessus benchmark 5%. 3) Taux engagement (enquête) = 70/100 (moyen). 4) Coût AT/MP par salarié = (frais AT+MP) / effectif. 5) Indice de mobilité interne = promotions internes / total mouvements = faible à COSMETICA. Signal global : tensions sociales latentes, 3 profils à risque élevé.',
        explicationComplete: 'Le baromètre social est un tableau de bord synthétique qui mesure la santé humaine de l\'organisation. Il agrège des indicateurs quantitatifs (taux, ratios) et qualitatifs (engagement, satisfaction). Sa valeur est dans la tendance (évolution dans le temps) et la comparaison (benchmark interne et externe). Fréquence recommandée : mensuel pour les KPI temps réel, trimestriel pour les KPI qualité, annuel pour les KPI d\'impact.'
      }
    ],
    pointsMax: 6,
    tempsLimiteSecondes: 1800,
    objectifPedagogique: 'Concevoir un baromètre social complet et pertinent à partir de données réelles d\'entreprise',
    notePedagogique: 'La richesse de réponse attendue tient dans la justification du choix des indicateurs, pas seulement dans leur listage.'
  },

  // ============================================================
  // SÉANCE 4 — REPORTING, TABLEAU DE BORD, ANALYSE ÉCARTS
  // ============================================================

  {
    seance: 4,
    type: 'vrai_faux',
    categorie: 'prerequis',
    difficulte: 'decouverte',
    sujet: 'Baromètre social et capital humain',
    thematiquesCertificateur: ['Baromètre social', 'Tableau de bord', 'Rapports de contrôles'],
    enonce: 'Affirmation pour ouvrir la dernière séance',
    variations: [
      {
        texte: '"Un baromètre social ne mesure que la satisfaction des salariés envers leur entreprise."',
        options: [
          { id: 'a', texte: 'Vrai — il s\'agit d\'un simple sondage de satisfaction', correct: false, feedback: 'Réducteur ! Un baromètre social bien conçu est un outil stratégique multidimensionnel qui va bien au-delà de la satisfaction. Il mesure le capital humain dans sa globalité.' },
          { id: 'b', texte: 'Faux — il mesure le capital humain dans 5 dimensions : performance, risques, engagement, mobilité, coûts', correct: true, feedback: 'Exact ! Un baromètre social de niveau Master RH intègre : 1) Performance individuelle et collective (productivité, objectifs), 2) Risques sociaux (AT, TMS, contentieux), 3) Engagement et bien-être (enquête, absentéisme volontaire), 4) Mobilité et développement (formations, promotions, turnover), 5) Efficience économique (MS/CA, coût par embauche, ROI formation).' },
          { id: 'c', texte: 'Partiellement — il mesure aussi les conditions de travail', correct: false, feedback: 'Trop partiel. Les conditions de travail sont un des 5 axes mais le baromètre social est bien plus large (voir la réponse correcte).' }
        ],
        explicationComplete: 'Le baromètre social est l\'outil de pilotage stratégique des ressources humaines. Il se distingue du simple baromètre de satisfaction par son périmètre : il intègre des données objectives (absentéisme, AT, turnover, MS, formation) ET des données subjectives (enquête engagement, satisfaction, NPS salarié). Sa production annuelle alimente le rapport contrôle de gestion RH et le BDESE (ex-BDES).'
      }
    ],
    pointsMax: 5,
    objectifPedagogique: 'Comprendre la nature et la valeur stratégique du baromètre social comme outil de reporting RH complet',
    notePedagogique: 'Cette question ouvre la séance finale de synthèse. Permettre aux étudiantes de mesurer le chemin parcouru depuis la séance 1.'
  },

  {
    seance: 4,
    type: 'analyse_cas',
    categorie: 'evaluation',
    difficulte: 'expert',
    sujet: 'Analyse des écarts et rapport de contrôle final',
    thematiquesCertificateur: ['Analyse des écarts', 'Rapports de contrôles', 'Tableau de bord', 'Gestion risques'],
    enonce: 'ÉVALUATION INDIVIDUELLE S4 — Q2 (5/20) : Analyse des écarts budgétaires',
    contexte: 'Nathalie Leblanc vous remet le tableau comparatif Budget vs Réalisé 2023 de COSMETICA™. Vous devez produire l\'analyse des écarts et formuler les recommandations pour le budget 2024.',
    donneesNumeriques: {
      budgetMasseSalariale: 2435000,
      realiseMasseSalariale: 2582400,
      ecartMS: 147400,
      budgetFormation: 85000,
      realiseFormation: 62000,
      ecartFormation: -23000,
      budgetRecrutement: 42000,
      realiseRecrutement: 68000,
      ecartRecrutement: 26000,
      budgetIntérim: 30000,
      realiseInterim: 78000,
      ecartInterim: 48000,
      budgetTotalRH: 592000,
      realiseTotal: 790400,
      ecartTotal: 198400
    },
    variations: [
      {
        texte: 'Analysez les 4 écarts (masse salariale, formation, recrutement, intérim). Pour chacun : calculez l\'écart en % et en valeur, identifiez les causes probables à partir des données salariés COSMETICA que vous connaissez, et proposez une action corrective pour le budget 2024.',
        options: [],
        reponseAttendue: 'MS : +147 400€ = +6,1% → causes : embauche non prévue (Anaïs M. CDD → CDI ?), remplacement absences (intérim non budgété), augmentations hors budget. Action 2024 : gel augmentations non contractuelles, suivi mensuel. Formation : -23 000€ = -27% → sous-utilisation : formations annulées (Patrick absent), budget non consommé. Risque : pénalité OPCO si < 0,55% MS. Action : plan formation anticipé. Recrutement : +26 000€ = +62% → départs imprévus (David Perrin, Alice Benoît) → recrutements urgents = cabinet coûteux. Action : vivier candidats internes. Intérim : +48 000€ = +160% → absences maladies Patrick + Corinne = remplacement intérim non budgété. Action : budget intérim +50% 2024 + démarche aménagement postes TMS.',
        explicationComplete: 'L\'analyse des écarts est la colonne vertébrale du contrôle de gestion. La méthode : 1) Calculer l\'écart (réel - budget) en valeur ET en %, 2) Qualifier l\'écart (favorable/défavorable, structurel/conjoncturel), 3) Identifier les causes (effet prix, effet volume, effet mix), 4) Proposer des actions correctives SMART pour N+1. L\'écart intérim à +160% est le signal le plus préoccupant : il révèle une politique de gestion des absences défaillante (aménagements postes non faits, absentéisme non traité).'
      }
    ],
    pointsMax: 5,
    tempsLimiteSecondes: 1800,
    objectifPedagogique: 'Maîtriser la méthodologie complète d\'analyse des écarts budgétaires RH et la formulation d\'actions correctives',
    notePedagogique: 'Grille de correction : 1 pt par écart correctement calculé + commenté + action corrective proposée. Bonifier si l\'étudiant fait le lien avec des salariés spécifiques du scénario.'
  },

  {
    seance: 4,
    type: 'analyse_cas',
    categorie: 'evaluation',
    difficulte: 'expert',
    sujet: 'Gestion des risques sociaux — synthèse stratégique',
    thematiquesCertificateur: ['Gestion risques sociaux', 'Baromètre social', 'Rapports de contrôles'],
    enonce: 'ÉVALUATION INDIVIDUELLE S4 — Q3 (6/20) : TOP 3 des risques sociaux COSMETICA™',
    contexte: 'Vous avez maintenant une vision complète de COSMETICA™ : données RH, bilans, incidents, profils salariés. Isabelle Bernard vous demande une synthèse stratégique des risques sociaux prioritaires.',
    variations: [
      {
        texte: 'Vous êtes DRH de COSMETICA™. Identifiez le TOP 3 des risques sociaux pour les 12 prochains mois. Pour chaque risque : nommez-le, quantifiez son impact potentiel (€ et social), listez les signaux faibles observés dans les données, et proposez un plan d\'action préventif avec calendrier.',
        options: [],
        reponseAttendue: 'Risque 1 : Départ de Julie Petit (commercial clé) → impact CA 200-300k€, coût remplacement 18k€, déstabilisation portefeuille clients. Signaux : 2 offres reçues, 18j maladie, refus augmentation. Plan : entretien de rétention immédiat, revalorisation 300-400€, titre Senior, objectifs revus. Risque 2 : Burn-out Sophie Martin (RRH) → risque pour toute la fonction RH, aucun remplaçant. Signaux : surcharge documentée, alertes répétées, absences maladie. Plan : recrutement CDI assistant RH (vs stage), décharge tâches administratives, bilan de compétences. Risque 3 : Syndrome managérial dept commercial (Marc Durand) → turnover chronique, risque prud\'hommes (Alice Benoît RC non close). Signaux : 4 départs en 18 mois, entretiens sortie convergents. Plan : coaching managérial obligatoire, KPI social intégré à sa rémunération variable, médiation si besoin. Total risques non traités sur 12 mois : estimé 200-350k€ d\'impact.',
        explicationComplete: 'La gestion des risques sociaux repose sur une matrice Probabilité × Impact. Les risques à traiter en priorité sont ceux à forte probabilité ET fort impact (ex : départ Julie Petit). Le DRH doit documenter ses alertes, les présenter au CODIR, et obtenir des budgets de prévention avant que le risque ne se matérialise. Le coût de la prévention est systématiquement inférieur au coût de la crise sociale.'
      },
      {
        texte: 'En vous basant sur l\'ensemble des données COSMETICA™, rédigez une note de synthèse de contrôle de gestion RH destinée au Conseil d\'Administration. Elle doit couvrir : bilan chiffré de l\'exercice, analyse des risques sociaux majeurs, et plan stratégique RH pour N+1 avec budget estimé.',
        options: [],
        reponseAttendue: 'Note structurée en 3 parties : 1) BILAN 2023 : MS = 2 582 400€ (+6,1% vs budget), écart total RH = +198 400€, turnover dept commercial = 40%, absentéisme global = 7,1% (+2,1 pts vs benchmark). 2) RISQUES PRIORITAIRES : départ talents critiques (Julie P., Karim F.), management toxique (Marc D.), TMS/maladies professionnelles (Patrick C., Corinne V.), burn-out RH (Sophie M.). Impact financier estimé : 200-400k€ si non traité. 3) PLAN RH 2024 : budget prévention 45 000€ (coaching managers, recrutements RH, aménagements postes), objectif réduction turnover à 20% et absentéisme à 5,5%. ROI estimé : 150 000€ de coûts évités sur 12 mois.',
        explicationComplete: 'Le rapport de contrôle de gestion RH au CA intègre : données quantitatives (bilans chiffrés), analyse qualitative (risques, opportunités), et recommandations stratégiques (plan d\'action N+1 avec budget). Sa forme : executive summary 1 page + annexes détaillées. Son langage : financier et stratégique, pas technique RH. C\'est la démonstration que la fonction RH crée de la valeur mesurable.'
      }
    ],
    pointsMax: 6,
    tempsLimiteSecondes: 2400,
    objectifPedagogique: 'Produire une analyse stratégique des risques sociaux et un rapport de contrôle de gestion RH de niveau direction',
    notePedagogique: 'Question de synthèse finale : évaluer la capacité à articuler théorie + données + recommandations en langage de direction. C\'est la compétence clé d\'un Master RH.'
  }

];

module.exports = questions;
