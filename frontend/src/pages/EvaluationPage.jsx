import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evaluationsAPI, questionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const EVAL_QUESTIONS = {
  1: [
    { id: 'q1', points: 4, enonce: 'Q1 — Définitions & Formules (4/20)', texte: 'Définissez le "taux de turnover" et le "délai moyen de recrutement". Donnez la formule de calcul de chacun et illustrez avec les données de COSMETICA™ 2023 (8 recrutements, 4 départs en 18 mois, effectif moyen : 65 salariés).', type: 'ouverte', placeholder: 'Taux de turnover = (Départs / Effectif moyen) × 100 = ...' },
    { id: 'q2', points: 5, enonce: 'Q2 — Analyse critique (5/20)', texte: 'Le département commercial de COSMETICA™ enregistre un turnover de 40% en 2023, contre 15% pour le secteur. Est-ce acceptable ? Justifiez avec au moins 3 arguments quantitatifs ET qualitatifs. Estimez le coût total des 4 départs (sachant que le coût moyen d\'un départ est estimé à 18 000€).', type: 'ouverte', placeholder: 'Non, 40% est inacceptable car...' },
    { id: 'q3', points: 6, enonce: 'Q3 — Anticipation & indicateurs prédictifs (6/20)', texte: 'Proposez 3 indicateurs qui permettraient d\'anticiper les risques de démission future chez COSMETICA™. Pour chaque indicateur : nommez-le, précisez sa formule ou méthode de mesure, et identifiez le signal d\'alerte à définir. Appuyez-vous sur les profils salariés que vous avez analysés.', type: 'ouverte', placeholder: 'Indicateur 1 : taux d\'absentéisme court et répété = ...' },
    { id: 'q4', points: 5, enonce: 'Q4 — Budget RH & recrutement (5/20)', texte: 'COSMETICA™ a dépensé 68 000€ en recrutement en 2023 (budget initial : 42 000€). Calculez le ratio "budget recrutement / masse salariale brute" (MS brute = 1 820 000€). Commentez ce ratio et expliquez le lien entre budget RH et politique de recrutement.', type: 'ouverte', placeholder: 'Ratio = 68 000 / 1 820 000 × 100 = ...' }
  ],
  2: [
    { id: 'q1', points: 4, enonce: 'Q1 — Charges patronales (4/20)', texte: 'Calculez le taux de charge patronale de COSMETICA™ à partir des données suivantes : salaire brut total = 1 820 000€, cotisations patronales totales = 762 400€. Décomposez les principales composantes des charges patronales (URSSAF, retraite, prévoyance, mutuelle...) en indiquant les taux approximatifs pour 2024.', type: 'ouverte', placeholder: 'Taux = 762 400 / 1 820 000 × 100 = ...' },
    { id: 'q2', points: 5, enonce: 'Q2 — Analyse des écarts MS (5/20)', texte: 'La masse salariale chargée 2023 de COSMETICA™ s\'élève à 2 582 400€ pour un budget de 2 435 000€. Calculez l\'écart en valeur et en %. Identifiez 3 causes probables de cet écart en vous appuyant sur les données des salariés fictifs. Quel levier prioritaire actionneriez-vous pour revenir dans le budget en 2024 ?', type: 'ouverte', placeholder: 'Écart = 2 582 400 - 2 435 000 = ...' },
    { id: 'q3', points: 6, enonce: 'Q3 — PSE : analyse critique (6/20)', texte: 'Marc Durand propose un PSE de 8 postes. Définissez le PSE (cadre juridique, conditions déclenchantes, obligations employeur). Analysez si un PSE est légalement envisageable pour COSMETICA™ (65 salariés, baisse activité -15%). Listez 3 mesures alternatives au PSE et évaluez leur efficacité relative.', type: 'ouverte', placeholder: 'Le PSE (Plan de Sauvegarde de l\'Emploi) est défini par...' },
    { id: 'q4', points: 5, enonce: 'Q4 — Analyse critique du scénario collectif (5/20)', texte: 'Votre groupe a proposé un scénario d\'adaptation de la masse salariale. Analysez ce scénario de manière critique : points forts, points faibles, risques non identifiés. Quel mix d\'actions correctives auriez-vous personnellement recommandé ? Justifiez en chiffrant l\'impact sur la masse salariale.', type: 'ouverte', placeholder: 'Mon analyse critique du scénario proposé : ...' }
  ],
  3: [
    { id: 'q1', points: 4, enonce: 'Q1 — Formules & calculs (4/20)', texte: 'Calculez à partir des données COSMETICA™ 2023 : (1) le taux de turnover global, (2) le taux d\'absentéisme global (178 jours d\'absence / 228 jours théoriques × 65 salariés ETP), (3) la productivité par ETP (CA 4 050 000€ / 58,5 ETP). Comparez chaque résultat au benchmark sectoriel.', type: 'ouverte', placeholder: '1. Taux turnover = ...' },
    { id: 'q2', points: 5, enonce: 'Q2 — Cas individuel : Amandine Moreau (5/20)', texte: 'Amandine Moreau : CDI depuis 6 ans, 3 absences maladie/an (dont 1 sans justificatif), demande de temps partiel refusée, TMS naissants signalés par la médecine du travail. Réalisez un diagnostic RH complet de sa situation. Identifiez les risques (pour elle, pour COSMETICA™). Proposez un plan d\'action RH individualisé.', type: 'ouverte', placeholder: 'Diagnostic Amandine Moreau : ...' },
    { id: 'q3', points: 6, enonce: 'Q3 — Baromètre social (6/20)', texte: 'Construisez un baromètre social pour COSMETICA™ avec 5 indicateurs clés. Pour chacun : (a) nom et formule de calcul, (b) valeur calculée pour COSMETICA™, (c) benchmark sectoriel, (d) signal RAG (Rouge/Ambre/Vert) justifié, (e) une action corrective associée. Concluez sur le "score de santé sociale" de COSMETICA™.', type: 'ouverte', placeholder: 'Indicateur 1 — Turnover : formule = ...' },
    { id: 'q4', points: 5, enonce: 'Q4 — Actions correctives chiffrées (5/20)', texte: 'Identifiez 3 actions RH prioritaires pour réduire le coût social de COSMETICA™ dans les 12 prochains mois. Pour chaque action : décrivez-la précisément, estimez son coût de mise en œuvre, estimez le ROI (coût évité / coût action). Construisez un tableau de priorisation (urgence / importance / coût).', type: 'ouverte', placeholder: 'Action 1 — Coaching managérial Marc Durand : ...' }
  ],
  4: [
    { id: 'q1', points: 4, enonce: 'Q1 — Reporting RH efficace (4/20)', texte: 'Définissez les 5 critères d\'un reporting RH efficace. Illustrez chaque critère avec un exemple concret tiré du contexte COSMETICA™. Quel format et quelle fréquence recommanderiez-vous pour le reporting RH de COSMETICA™ ? À qui est-il destiné ?', type: 'ouverte', placeholder: 'Critère 1 : Pertinence — Le reporting RH efficace doit...' },
    { id: 'q2', points: 5, enonce: 'Q2 — Analyse complète des écarts (5/20)', texte: 'Analysez les 4 écarts budgétaires RH 2023 de COSMETICA™ (MS : +147 400€, Formation : -23 000€, Recrutement : +26 000€, Intérim : +48 000€). Pour chaque écart : calcul %, causes identifiées (en lien avec les salariés du scénario), classification (conjoncturel/structurel), action corrective 2024 chiffrée.', type: 'ouverte', placeholder: 'Écart MS : +147 400€ = +6,1%. Causes : ...' },
    { id: 'q3', points: 6, enonce: 'Q3 — TOP 3 risques sociaux (6/20)', texte: 'Vous êtes DRH de COSMETICA™. Identifiez le TOP 3 des risques sociaux pour les 12 prochains mois. Pour chaque risque : nommez-le, quantifiez l\'impact potentiel en €, listez les 3 signaux faibles observés dans les données, proposez un plan préventif avec calendrier et budget. Estimez le coût total si ces risques se matérialisent.', type: 'ouverte', placeholder: 'Risque 1 — Départ de Julie Petit : ...' },
    { id: 'q4', points: 5, enonce: 'Q4 — Réflexion synthèse (5/20)', texte: 'Réflexion personnelle : (1) Qu\'est-ce que le contrôle de gestion sociale RH vous a appris sur la valeur de la fonction RH dans l\'entreprise ? (2) Quelle compétence développée dans ce module vous semble la plus précieuse pour votre futur métier de DRH ? (3) Qu\'est-ce qui vous a le plus surpris ou marqué dans les données de COSMETICA™, et pourquoi ?', type: 'ouverte', placeholder: 'Ce module m\'a appris que...' }
  ]
};

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
  const timerRef = useRef(null);

  const questions = EVAL_QUESTIONS[numSeance] || [];

  useEffect(() => {
    loadEvaluation();
    return () => clearInterval(timerRef.current);
  }, [seance]);

  const loadEvaluation = async () => {
    try {
      const res = await evaluationsAPI.getBySeance(numSeance);
      setEvaluation(res.data.data);
      if (res.data.data.status === 'en_cours') {
        setStarted(true);
        startTimer();
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
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
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
    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
    const answered = Object.keys(reponses).filter(k => reponses[k]?.trim()).length;

    if (answered < questions.length) {
      const confirmed = window.confirm(`Vous avez répondu à ${answered}/${questions.length} questions. Voulez-vous vraiment soumettre ?`);
      if (!confirmed) return;
    }

    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const reponsesArray = questions.map(q => ({
        enonce: q.texte,
        type: q.type,
        reponseEtudiante: reponses[q.id] || '',
        pointsMax: q.points
      }));
      await evaluationsAPI.submit(numSeance, reponsesArray);
      toast.success('Évaluation soumise ! Votre formateur va la corriger. 📝');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

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
        <p className="text-gray-500">Cette évaluation devient accessible une fois vos livrables collectifs validés par votre formateur.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (evaluation?.status === 'soumise' || evaluation?.status === 'en_correction') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Évaluation soumise</h1>
        <p className="text-gray-500">Votre formateur est en train de la corriger. Résultat bientôt disponible.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (evaluation?.status === 'corrigee') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center mb-6">
          <div className="text-6xl mb-3">📊</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Séance {numSeance} — Résultats</h1>
          <div className="text-5xl font-black text-cosmetica-600 mb-2">{evaluation.noteFinale}/20</div>
          {evaluation.commentaireGlobal && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
              <p className="text-sm font-semibold text-gray-700 mb-1">Commentaire de votre formateur :</p>
              <p className="text-sm text-gray-600">{evaluation.commentaireGlobal}</p>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">← Retour au tableau de bord</button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Évaluation individuelle — Séance {numSeance}</h1>
          <p className="text-gray-500 mb-6">Contrôle de Gestion Sociale RH · Master RH 1ère année</p>

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-bold text-2xl text-gray-900">{questions.length}</p>
              <p className="text-gray-500">questions</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-bold text-2xl text-gray-900">20</p>
              <p className="text-gray-500">points</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="font-bold text-2xl text-gray-900">30</p>
              <p className="text-gray-500">minutes</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-6">
            <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Règles de l'évaluation :</p>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Travail strictement individuel</li>
              <li>• Réponses ouvertes : qualité de l'argumentation et utilisation des données</li>
              <li>• Vous pouvez vous appuyer sur les données COSMETICA™ analysées en cours</li>
              <li>• Une fois soumise, vous ne pouvez plus modifier vos réponses</li>
            </ul>
          </div>

          <button onClick={handleStart} className="btn-primary text-lg px-8">
            Démarrer l'évaluation →
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(reponses).filter(k => reponses[k]?.trim()).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Timer & progress */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm -mx-4 px-4 py-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Séance {numSeance} — Évaluation individuelle</span>
            <span className="badge-blue">{answeredCount}/{questions.length} réponses</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">⏱ {formatTime(timeElapsed)}</span>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary text-sm"
            >
              {submitting ? 'Soumission...' : 'Soumettre →'}
            </button>
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-cosmetica-500 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="card fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="badge-blue text-xs mb-1 inline-block">{q.enonce}</span>
                <h3 className="font-bold text-gray-900 mt-2">{q.texte}</h3>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  reponses[q.id]?.trim() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {reponses[q.id]?.trim() ? '✓' : idx + 1}
                </div>
              </div>
            </div>
            <textarea
              className="input min-h-[140px] resize-y font-sans text-sm"
              placeholder={q.placeholder}
              value={reponses[q.id] || ''}
              onChange={e => setReponses(p => ({ ...p, [q.id]: e.target.value }))}
            />
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {reponses[q.id]?.length || 0} caractères · {q.points} points
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          ← Sauvegarder & quitter
        </button>
        <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-lg px-8">
          {submitting ? 'Soumission...' : '✅ Soumettre mon évaluation'}
        </button>
      </div>
    </div>
  );
}
