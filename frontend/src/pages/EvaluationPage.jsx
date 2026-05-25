import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluationsAPI } from '../services/api';
import toast from 'react-hot-toast';

const EVAL_QUESTIONS = {
  1: [
    {
      id: 'q1', points: 4,
      enonce: 'Q1 — Définitions & Formules (4 pts)',
      texte: 'Définissez le "taux de turnover" et le "délai moyen de recrutement". Donnez la formule de calcul de chacun et illustrez avec les données de COSMETICA™ 2023 (8 recrutements, 4 départs en 18 mois, effectif moyen : 65 salariés).',
      placeholder: 'Taux de turnover = (Départs / Effectif moyen) × 100 = ...\nDélai moyen de recrutement = Σ(date embauche - date ouverture poste) / nb recrutements = ...',
      aide: 'Benchmark : turnover < 15% dans le secteur cosmétique. Délai moyen cadre : 45 jours.'
    },
    {
      id: 'q2', points: 5,
      enonce: 'Q2 — Analyse critique (5 pts)',
      texte: 'Le département commercial de COSMETICA™ enregistre un turnover de 40% en 2023, contre 15% pour le secteur. Est-ce acceptable ? Justifiez avec au moins 3 arguments quantitatifs ET qualitatifs. Estimez le coût total des 4 départs (coût moyen estimé : 18 000€/départ).',
      placeholder: 'Non, 40% est inacceptable car...\nArgument quantitatif 1 : écart vs benchmark = +25 points soit...\nCoût total : 4 × 18 000€ = ...',
      aide: 'Pensez à analyser les entretiens de sortie : management, perspectives, rémunération.'
    },
    {
      id: 'q3', points: 6,
      enonce: 'Q3 — Indicateurs prédictifs (6 pts)',
      texte: 'Proposez 3 indicateurs qui permettraient d\'anticiper les risques de démission future chez COSMETICA™. Pour chaque indicateur : nommez-le, précisez sa formule ou méthode de mesure, et identifiez le signal d\'alerte. Appuyez-vous sur les profils salariés analysés.',
      placeholder: 'Indicateur 1 — Taux absentéisme court : formule = jours absence courte / jours théoriques × 100\nSignal alerte : > 3% → entretien de retour obligatoire\n\nIndicateur 2 — ...',
      aide: 'Julie Petit, Marc Durand, Sophie Martin sont des cas particulièrement riches à mobiliser.'
    },
    {
      id: 'q4', points: 5,
      enonce: 'Q4 — Budget RH & recrutement (5 pts)',
      texte: 'COSMETICA™ a dépensé 68 000€ en recrutement en 2023 (budget initial : 42 000€). Calculez le ratio "budget recrutement / masse salariale brute" (MS brute = 1 820 000€). Commentez ce ratio et expliquez le lien entre budget RH et politique de recrutement.',
      placeholder: 'Ratio recrutement/MS = 68 000 / 1 820 000 × 100 = 3,7%\nÉcart vs budget : +26 000€ = +61,9%\nCauses : départs imprévus (David Perrin, Alice Benoît) → recrutements urgents via cabinet...',
      aide: 'Benchmark : ratio recrutement/MS entre 1,5% et 3% pour une PME. COSMETICA dépasse le seuil.'
    }
  ],
  2: [
    {
      id: 'q1', points: 4,
      enonce: 'Q1 — Charges patronales (4 pts)',
      texte: 'Calculez le taux de charge patronale de COSMETICA™ (salaire brut total = 1 820 000€, cotisations patronales = 762 400€). Décomposez les principales composantes des charges patronales en indiquant les taux approximatifs 2024.',
      placeholder: 'Taux = 762 400 / 1 820 000 × 100 = 41,9%\nDécomposition :\n- URSSAF (maladie, vieillesse, famille) : ~28%\n- Retraite complémentaire AGIRC-ARRCO : ~6-7%\n- Assurance chômage : ~4,05%\n- Prévoyance/mutuelle : ~2-3%',
      aide: 'Le taux global de charges patronales en France est d\'environ 40-45% du salaire brut selon les tranches.'
    },
    {
      id: 'q2', points: 5,
      enonce: 'Q2 — Analyse des écarts MS (5 pts)',
      texte: 'La masse salariale chargée 2023 de COSMETICA™ est de 2 582 400€ pour un budget de 2 435 000€. Calculez l\'écart en valeur et en %. Identifiez 3 causes probables en lien avec les salariés fictifs. Quel levier prioritaire pour revenir dans le budget 2024 ?',
      placeholder: 'Écart = 2 582 400 - 2 435 000 = +147 400€ soit +6,1%\nCause 1 : remplacement des absences de Patrick Chevalier (42j) par intérim → ~3 360€ non budgété\nCause 2 : ...',
      aide: 'Les effets à décomposer : effet masse (augmentations), effet effectif (entrées/sorties), effet report (augmentations N-1).'
    },
    {
      id: 'q3', points: 6,
      enonce: 'Q3 — PSE : analyse critique (6 pts)',
      texte: 'Marc Durand propose un PSE de 8 postes. Définissez le PSE (cadre juridique, conditions déclenchantes). Analysez si un PSE est légalement envisageable pour COSMETICA™ (65 salariés, baisse -15%). Listez 3 mesures alternatives et évaluez leur efficacité relative.',
      placeholder: 'Définition PSE : articles L1233-24 et s. Code du travail. Déclenché si ≥ 50 salariés ET ≥ 10 licenciements sur 30 jours.\nCOSMETICA (65 sal., 8 postes) : PSE possible mais...\nAlternative 1 — APLD : coût net = 45 000 × (1 - 0,65) = 15 750€ pour COSMETICA...',
      aide: 'APLD = Activité Partielle de Longue Durée : aide État à 65% des heures chômées, accord collectif requis.'
    },
    {
      id: 'q4', points: 5,
      enonce: 'Q4 — Analyse critique du scénario collectif (5 pts)',
      texte: 'Analysez de manière critique le scénario collectif produit par votre groupe : points forts, points faibles, risques non identifiés. Quel mix d\'actions correctives auriez-vous personnellement recommandé ? Justifiez en chiffrant l\'impact sur la masse salariale.',
      placeholder: 'Points forts du scénario : ...\nPoints faibles : ...\nMa recommandation personnelle : mix APLD (économie estimée ...) + gel augmentations non contractuelles (économie ...) + ...',
      aide: 'Pensez à l\'impact social de chaque mesure, pas seulement financier. Le climat social a un coût.'
    }
  ],
  3: [
    {
      id: 'q1', points: 4,
      enonce: 'Q1 — Calculs & benchmarks (4 pts)',
      texte: 'Calculez pour COSMETICA™ 2023 : (1) taux de turnover global, (2) taux d\'absentéisme global (178 jours d\'absence / 228 jours théoriques × 65 ETP), (3) productivité par ETP (CA 4 050 000€ / 58,5 ETP). Comparez chaque résultat au benchmark sectoriel.',
      placeholder: '1. Taux turnover = (entrées + sorties) / 2 / effectif moy × 100 = ...\n2. Taux absentéisme = 178 / (228 × 65) × 100 = ...\n   Benchmark France 2023 : 5,04% → COSMETICA est...\n3. Productivité = 4 050 000 / 58,5 = ...',
      aide: 'Benchmark turnover cosmétique : 12-18%. Benchmark absentéisme France 2023 : 5,04%.'
    },
    {
      id: 'q2', points: 5,
      enonce: 'Q2 — Cas individuel : Amandine Moreau (5 pts)',
      texte: 'Amandine Moreau : CDI depuis 6 ans, 3 absences maladie/an dont 1 sans justificatif, demande temps partiel refusée, TMS naissants signalés par la médecine du travail. Réalisez un diagnostic RH complet, identifiez les risques (pour elle, pour COSMETICA™), proposez un plan d\'action RH individualisé.',
      placeholder: 'Diagnostic : situation de préburnout / désengagement progressif\nRisques pour Amandine : aggravation TMS, rupture conventionnelle ou inaptitude...\nRisques pour COSMETICA : risque prud\'hommes (refus temps partiel potentiellement illégal), coût AT/MP...\nPlan d\'action : 1) Entretien de retour immédiat, 2) Revoir refus temps partiel (justification besoin service ?), 3) Aménagement poste médecin travail...',
      aide: 'Le refus de temps partiel doit être motivé par un besoin de service précis, documenté. Sinon : risque prud\'hommes.'
    },
    {
      id: 'q3', points: 6,
      enonce: 'Q3 — Baromètre social COSMETICA™ (6 pts)',
      texte: 'Construisez un baromètre social pour COSMETICA™ avec 5 indicateurs clés. Pour chacun : (a) nom et formule, (b) valeur calculée, (c) benchmark sectoriel, (d) signal RAG justifié, (e) action corrective associée. Concluez sur le "score de santé sociale" global.',
      placeholder: 'Indicateur 1 — Taux de turnover :\n  Formule = (départs + entrées) / 2 / effectif × 100\n  COSMETICA = 6,2% global / 40% commercial\n  Benchmark = 15% → Signal : ROUGE département commercial\n  Action : audit management Marc Durand + coaching (8 000€)\n\nIndicateur 2 — Taux absentéisme : ...',
      aide: 'Les 5 axes d\'un baromètre social : performance, risques sociaux, engagement, mobilité, efficience économique.'
    },
    {
      id: 'q4', points: 5,
      enonce: 'Q4 — Actions correctives chiffrées (5 pts)',
      texte: 'Identifiez 3 actions RH prioritaires pour réduire le coût social de COSMETICA™ dans les 12 prochains mois. Pour chaque action : description précise, coût de mise en œuvre, ROI estimé (coût évité / coût action). Construisez un tableau de priorisation urgence / importance / coût.',
      placeholder: 'Action 1 — Coaching managérial Marc Durand :\n  Coût : 8 000€ (prestataire externe, 3 mois)\n  Bénéfice estimé : réduction turnover commercial de 40% à 20% → 2 départs évités × 18 000€ = 36 000€\n  ROI = (36 000 - 8 000) / 8 000 = 350%\n  Priorité : HAUTE / urgente\n\nAction 2 — ...',
      aide: 'Un plan d\'action sans chiffrage n\'est pas acceptable en contrôle de gestion RH. ROI = (gains - coûts) / coûts.'
    }
  ],
  4: [
    {
      id: 'q1', points: 4,
      enonce: 'Q1 — Reporting RH efficace (4 pts)',
      texte: 'Définissez les 5 critères d\'un reporting RH efficace. Illustrez chaque critère avec un exemple concret tiré du contexte COSMETICA™. Quel format et quelle fréquence recommanderiez-vous ? À qui est-il destiné ?',
      placeholder: 'Critère 1 : Pertinence — indicateurs alignés sur les enjeux stratégiques\n  Exemple COSMETICA : inclure turnover commercial (40%) plutôt que taux de formation des cadres (non prioritaire)\n\nCritère 2 : Fiabilité — données vérifiées et actualisées\n  Exemple : s\'appuyer sur les données paie Henri Dupont (source unique de vérité)...',
      aide: 'Les 5 critères : pertinence, fiabilité, actualité, accessibilité, actionnabilité.'
    },
    {
      id: 'q2', points: 5,
      enonce: 'Q2 — Analyse complète des écarts (5 pts)',
      texte: 'Analysez les 4 écarts budgétaires RH 2023 de COSMETICA™ (MS : +147 400€, Formation : -23 000€, Recrutement : +26 000€, Intérim : +48 000€). Pour chaque écart : calcul %, causes identifiées en lien avec les salariés, classification conjoncturel/structurel, action corrective 2024 chiffrée.',
      placeholder: 'Écart MS : +147 400€ = +6,1%\n  Causes : Absences Patrick (42j) + Corinne (49j) remplacées en intérim, recrutements non prévus...\n  Conjoncturel (absences) ET structurel (sous-dotation RH)\n  Action 2024 : budget intérim +50% (45 000€) + aménagement postes TMS...\n\nÉcart Formation : -23 000€ = -27%\n  Causes : ...',
      aide: 'Un écart intérim à +160% révèle une politique de gestion des absences défaillante. C\'est le signal le plus fort.'
    },
    {
      id: 'q3', points: 6,
      enonce: 'Q3 — TOP 3 risques sociaux COSMETICA™ (6 pts)',
      texte: 'Vous êtes DRH de COSMETICA™. Identifiez le TOP 3 des risques sociaux pour les 12 prochains mois. Pour chaque risque : nom, impact potentiel quantifié en €, 3 signaux faibles observés dans les données, plan préventif avec calendrier et budget. Estimez le coût total si ces risques se matérialisent.',
      placeholder: 'Risque 1 — Départ de Julie Petit (talent commercial critique) :\n  Impact : perte CA estimée 200-300k€ + coût remplacement 18k€\n  Signaux : 2 offres externes reçues, 18j maladie 2023, refus augmentation 400€\n  Plan préventif : entretien rétention cette semaine, revalorisation 300-400€, titre Senior, objectifs revus à la baisse\n  Budget : 5 400€/an (augmentation) → ROI si évite le départ = 218 000€ économisés\n\nRisque 2 — ...',
      aide: 'Matrice risque : probabilité × impact. Traiter en priorité : forte probabilité + fort impact.'
    },
    {
      id: 'q4', points: 5,
      enonce: 'Q4 — Réflexion personnelle (5 pts)',
      texte: 'Réflexion : (1) Qu\'est-ce que le contrôle de gestion sociale vous a appris sur la valeur de la fonction RH dans l\'entreprise ? (2) Quelle compétence développée dans ce module vous semble la plus précieuse pour votre futur métier ? (3) Qu\'est-ce qui vous a le plus surpris dans les données de COSMETICA™ ?',
      placeholder: 'Ce module m\'a appris que la fonction RH n\'est pas qu\'administrative mais stratégique : chaque décision RH a un coût et un ROI mesurable...\n\nLa compétence la plus précieuse : ...\n\nCe qui m\'a le plus surpris : ...',
      aide: 'Question ouverte : votre réflexion personnelle est évaluée sur la profondeur d\'analyse, pas sur une "bonne réponse".'
    }
  ]
};

const AUTOSAVE_KEY = (seance) => `eval_draft_s${seance}`;

export default function EvaluationPage() {
  const { seance } = useParams();
  const navigate = useNavigate();
  const numSeance = parseInt(seance);
  const [evaluation, setEvaluation] = useState(null);
  const [reponses, setReponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [showAide, setShowAide] = useState({});
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);

  const questions = EVAL_QUESTIONS[numSeance] || [];

  useEffect(() => {
    loadEvaluation();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(autoSaveRef.current);
    };
  }, [seance]);

  // Warn before leaving with unsaved data
  useEffect(() => {
    const handler = (e) => {
      if (started && Object.values(reponses).some(r => r?.trim())) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [started, reponses]);

  const loadEvaluation = async () => {
    try {
      const res = await evaluationsAPI.getBySeance(numSeance);
      const eval_ = res.data.data;
      setEvaluation(eval_);
      if (eval_.status === 'en_cours') {
        setStarted(true);
        startTimer();
        // Restore draft from localStorage
        const saved = localStorage.getItem(AUTOSAVE_KEY(numSeance));
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setReponses(parsed.reponses || {});
            setLastSaved(new Date(parsed.savedAt));
            toast('Brouillon restauré automatiquement.', { icon: '💾' });
          } catch {}
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Évaluation non accessible.');
        navigate('/dashboard');
      } else {
        toast.error('Erreur de chargement.');
      }
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => setTimeElapsed(p => p + 1), 1000);
    // Auto-save every 30 seconds
    autoSaveRef.current = setInterval(() => {
      setReponses(current => {
        const draft = { reponses: current, savedAt: new Date().toISOString() };
        localStorage.setItem(AUTOSAVE_KEY(numSeance), JSON.stringify(draft));
        setLastSaved(new Date());
        return current;
      });
    }, 30000);
  };

  const saveNow = () => {
    const draft = { reponses, savedAt: new Date().toISOString() };
    localStorage.setItem(AUTOSAVE_KEY(numSeance), JSON.stringify(draft));
    setLastSaved(new Date());
    toast.success('Brouillon sauvegardé.', { duration: 1500 });
  };

  const handleStart = async () => {
    try {
      await evaluationsAPI.start(numSeance);
      setStarted(true);
      startTimer();
      toast.success('Évaluation démarrée. Bonne chance ! ⏱');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    }
  };

  const handleSubmit = async () => {
    const answered = Object.keys(reponses).filter(k => reponses[k]?.trim()).length;
    if (answered < questions.length) {
      const confirmed = window.confirm(
        `Vous avez répondu à ${answered}/${questions.length} questions.\n\nLes questions sans réponse obtiendront 0 point.\n\nConfirmer la soumission ?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    clearInterval(timerRef.current);
    clearInterval(autoSaveRef.current);
    try {
      const reponsesArray = questions.map(q => ({
        enonce: q.texte,
        type: 'ouverte',
        reponseEtudiante: reponses[q.id] || '',
        pointsMax: q.points
      }));
      await evaluationsAPI.submit(numSeance, reponsesArray);
      localStorage.removeItem(AUTOSAVE_KEY(numSeance));
      toast.success('Évaluation soumise ! Votre formateur va la corriger. 📝');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" />
    </div>
  );

  if (!evaluation?.accessible) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Évaluation verrouillée</h1>
        <p className="text-gray-500 mb-6">Cette évaluation devient accessible une fois vos livrables collectifs validés par votre formateur.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (evaluation?.status === 'soumise' || evaluation?.status === 'en_correction') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Évaluation soumise</h1>
        <p className="text-gray-500 mb-6">Votre formateur est en train de la corriger. Résultat bientôt disponible.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (evaluation?.status === 'corrigee') {
    const note = evaluation.noteFinale;
    const noteColor = note >= 14 ? 'text-green-600' : note >= 10 ? 'text-amber-600' : 'text-red-600';
    const mention = note >= 16 ? 'Très bien' : note >= 14 ? 'Bien' : note >= 12 ? 'Assez bien' : note >= 10 ? 'Passable' : 'Insuffisant';
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center mb-6">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Séance {numSeance} — Vos résultats</h1>
          <p className="text-gray-500 mb-4">Contrôle de gestion sociale RH · Master RH 1</p>
          <div className={`text-6xl font-black mb-1 ${noteColor}`}>{note}/20</div>
          <div className={`text-lg font-semibold mb-4 ${noteColor}`}>{mention}</div>
          {evaluation.commentaireGlobal && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left border-l-4 border-cosmetica-300">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Retour de votre formateur</p>
              <p className="text-sm text-gray-700 leading-relaxed">{evaluation.commentaireGlobal}</p>
            </div>
          )}
        </div>
        <div className="card mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Détail par question</h3>
          <div className="space-y-2">
            {questions.map((q, i) => {
              const graded = evaluation.questions?.[i];
              const pts = graded?.pointsObtenus;
              return (
                <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{q.enonce}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {pts !== undefined ? (
                      <span className={`font-bold text-sm ${pts / q.points >= 0.7 ? 'text-green-700' : pts / q.points >= 0.5 ? 'text-amber-700' : 'text-red-700'}`}>
                        {pts}/{q.points}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">📝</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Évaluation individuelle — Séance {numSeance}</h1>
            <p className="text-gray-500">Contrôle de Gestion Sociale RH · Master RH 1ère année</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-cosmetica-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-cosmetica-700">{questions.length}</p>
              <p className="text-xs text-cosmetica-600 font-medium mt-0.5">questions ouvertes</p>
            </div>
            <div className="bg-cosmetica-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-cosmetica-700">20</p>
              <p className="text-xs text-cosmetica-600 font-medium mt-0.5">points au total</p>
            </div>
            <div className="bg-cosmetica-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-cosmetica-700">~30</p>
              <p className="text-xs text-cosmetica-600 font-medium mt-0.5">minutes estimées</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Règles importantes</p>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Travail <strong>strictement individuel</strong></li>
              <li>• Réponses évaluées sur la qualité du raisonnement et l'utilisation des données</li>
              <li>• Appuyez-vous sur les données COSMETICA™ analysées en cours</li>
              <li>• <strong>Brouillon sauvegardé automatiquement</strong> toutes les 30 secondes</li>
              <li>• Une fois soumise, vous ne pouvez plus modifier vos réponses</li>
            </ul>
          </div>

          <button onClick={handleStart} className="btn-primary w-full text-lg py-3">
            Démarrer l'évaluation →
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(reponses).filter(k => reponses[k]?.trim()).length;
  const totalChars = Object.values(reponses).reduce((acc, r) => acc + (r?.length || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Sticky header */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm -mx-4 px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">Séance {numSeance} · Évaluation individuelle</span>
            <span className="badge-blue">{answeredCount}/{questions.length} répondues</span>
          </div>
          <div className="flex items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-gray-400 hidden sm:block">
                💾 {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span className="text-sm font-mono bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
              ⏱ {formatTime(timeElapsed)}
            </span>
            <button onClick={saveNow} className="btn-secondary text-xs py-1.5 px-3 hidden sm:flex items-center gap-1">
              💾 Sauvegarder
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm py-2 px-4">
              {submitting ? '...' : 'Soumettre →'}
            </button>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cosmetica-500 transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{totalChars} caractères rédigés</span>
          <span>{20 - questions.reduce((a, q) => a + (reponses[q.id]?.trim() ? 0 : q.points), 20)}/20 pts couverts</span>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => {
          const hasAnswer = !!(reponses[q.id]?.trim());
          return (
            <div
              key={q.id}
              className={`card fade-in-up border-2 transition-colors ${hasAnswer ? 'border-green-200' : 'border-gray-100'}`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="badge-blue">{q.enonce}</span>
                    <span className="text-xs text-gray-500">{q.points} points</span>
                    {hasAnswer && <span className="text-xs text-green-600 font-medium">✓ Répondu</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-relaxed">{q.texte}</h3>
                </div>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ml-4 ${
                  hasAnswer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {hasAnswer ? '✓' : idx + 1}
                </div>
              </div>

              {/* Aide pédagogique */}
              <div className="mb-3">
                <button
                  onClick={() => setShowAide(p => ({ ...p, [q.id]: !p[q.id] }))}
                  className="text-xs text-cosmetica-600 hover:text-cosmetica-800 font-medium flex items-center gap-1"
                >
                  💡 {showAide[q.id] ? 'Masquer' : 'Afficher'} l'aide pédagogique
                </button>
                {showAide[q.id] && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
                    {q.aide}
                  </div>
                )}
              </div>

              <textarea
                className="input min-h-[160px] resize-y text-sm leading-relaxed"
                placeholder={q.placeholder}
                value={reponses[q.id] || ''}
                onChange={e => setReponses(p => ({ ...p, [q.id]: e.target.value }))}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {reponses[q.id]?.length || 0} caractères
                  {reponses[q.id]?.length > 0 && reponses[q.id].length < 100 && (
                    <span className="text-amber-500 ml-2">⚠ Réponse courte — développez votre argumentation</span>
                  )}
                </span>
                <span className="text-xs font-medium text-gray-500">{q.points} pts</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={saveNow} className="btn-secondary w-full sm:w-auto">
          💾 Sauvegarder le brouillon
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full sm:w-auto text-base px-8 py-3">
          {submitting ? 'Soumission en cours...' : '✅ Soumettre mon évaluation'}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">
        Brouillon sauvegardé automatiquement toutes les 30 secondes.{' '}
        {lastSaved && `Dernière sauvegarde : ${lastSaved.toLocaleTimeString('fr-FR')}`}
      </p>
    </div>
  );
}
