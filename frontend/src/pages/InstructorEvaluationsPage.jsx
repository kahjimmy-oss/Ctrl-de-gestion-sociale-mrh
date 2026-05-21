import { useState, useEffect } from 'react';
import { instructorAPI } from '../services/api';
import toast from 'react-hot-toast';

const SEANCE_QUESTIONS = {
  1: [
    { id: 'q1', label: 'Q1 — Définitions & formules', max: 4 },
    { id: 'q2', label: 'Q2 — Analyse turnover 40%', max: 5 },
    { id: 'q3', label: 'Q3 — Indicateurs prédictifs', max: 6 },
    { id: 'q4', label: 'Q4 — Budget recrutement', max: 5 }
  ],
  2: [
    { id: 'q1', label: 'Q1 — Charges patronales', max: 4 },
    { id: 'q2', label: 'Q2 — Analyse écarts MS', max: 5 },
    { id: 'q3', label: 'Q3 — PSE analyse', max: 6 },
    { id: 'q4', label: 'Q4 — Critique scénario collectif', max: 5 }
  ],
  3: [
    { id: 'q1', label: 'Q1 — Calculs indicateurs', max: 4 },
    { id: 'q2', label: 'Q2 — Cas Amandine Moreau', max: 5 },
    { id: 'q3', label: 'Q3 — Baromètre social', max: 6 },
    { id: 'q4', label: 'Q4 — Actions correctives chiffrées', max: 5 }
  ],
  4: [
    { id: 'q1', label: 'Q1 — Reporting RH efficace', max: 4 },
    { id: 'q2', label: 'Q2 — Analyse des écarts', max: 5 },
    { id: 'q3', label: 'Q3 — TOP 3 risques sociaux', max: 6 },
    { id: 'q4', label: 'Q4 — Réflexion synthèse', max: 5 }
  ]
};

export default function InstructorEvaluationsPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('soumise');
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [scores, setScores] = useState({});
  const [globalComment, setGlobalComment] = useState('');

  useEffect(() => { loadEvaluations(); }, [filter]);

  const loadEvaluations = async () => {
    setLoading(true);
    try {
      const res = await instructorAPI.getEvaluations(filter ? { status: filter } : {});
      setEvaluations(res.data.data || []);
    } catch { toast.error('Erreur.'); }
    finally { setLoading(false); }
  };

  const selectEvaluation = (ev) => {
    setSelected(ev);
    setGlobalComment('');
    const initScores = {};
    (ev.questions || []).forEach((q, i) => { initScores[i] = q.pointsObtenus || 0; });
    setScores(initScores);
  };

  const totalScore = Object.values(scores).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const noteFinale = Math.min(20, Math.round(totalScore * 10) / 10);

  const handleGrade = async () => {
    if (!globalComment.trim()) {
      toast.error('Rédigez un commentaire global avant de valider la correction.');
      return;
    }
    setGrading(true);
    try {
      const questions = (selected.questions || []).map((q, i) => ({
        ...q,
        pointsObtenus: parseFloat(scores[i]) || 0
      }));
      await instructorAPI.gradeEvaluation(selected._id, {
        noteFinale,
        commentaireGlobal: globalComment,
        questionsGradees: questions
      });
      toast.success(`Note enregistrée : ${noteFinale}/20. L'étudiante a été notifiée.`);
      setSelected(null);
      loadEvaluations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    } finally {
      setGrading(false);
    }
  };

  const seanceQuestions = selected ? (SEANCE_QUESTIONS[selected.seance] || []) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">📝 Correction des évaluations</h1>
        <p className="text-gray-500">Notez et commentez les évaluations individuelles sur 20</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'soumise', label: '⏳ À corriger' },
          { value: 'corrigee', label: '✅ Corrigées' },
          { value: '', label: '🔎 Toutes' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              filter === f.value ? 'bg-cosmetica-600 text-white border-cosmetica-600' : 'border-gray-200 text-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste */}
        <div className="space-y-3">
          {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> :
           evaluations.length === 0 ? (
             <div className="card text-center py-12 text-gray-400">
               <p className="text-3xl mb-2">✅</p>
               <p>Aucune évaluation dans cette catégorie</p>
             </div>
           ) : evaluations.map(ev => (
            <div
              key={ev._id}
              onClick={() => selectEvaluation(ev)}
              className={`card cursor-pointer transition-all ${selected?._id === ev._id ? 'border-2 border-cosmetica-400' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cosmetica-100 rounded-xl flex items-center justify-center font-bold text-cosmetica-700 flex-shrink-0">
                  {ev.etudiantId?.prenom?.[0]}{ev.etudiantId?.name?.[0] || ev.etudiantId?.nom?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{ev.etudiantId?.prenom} {ev.etudiantId?.name}</p>
                  <p className="text-xs text-gray-500">Séance {ev.seance} · Soumise {ev.soumisLe ? new Date(ev.soumisLe).toLocaleDateString('fr-FR') : '—'}</p>
                  {ev.dureeSecondes && <p className="text-xs text-gray-400">Durée : {Math.floor(ev.dureeSecondes / 60)} min</p>}
                </div>
                <div className="text-right">
                  {ev.status === 'corrigee' ? (
                    <span className="text-2xl font-black text-green-600">{ev.noteFinale}/20</span>
                  ) : (
                    <span className="badge-orange">À corriger</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Correction */}
        <div>
          {selected ? (
            <div className="card space-y-5">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  Séance {selected.seance} — {selected.etudiantId?.prenom} {selected.etudiantId?.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Note totale automatique : <span className="font-bold text-cosmetica-600">{noteFinale}/20</span>
                </p>
              </div>

              {/* Questions et réponses */}
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {(selected.questions || []).map((q, i) => {
                  const qConfig = seanceQuestions[i];
                  return (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700 flex-1">{qConfig?.label || `Question ${i + 1}`}</p>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <input
                            type="number"
                            min="0"
                            max={qConfig?.max || 5}
                            step="0.5"
                            className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cosmetica-400"
                            value={scores[i] ?? 0}
                            onChange={e => setScores(p => ({ ...p, [i]: parseFloat(e.target.value) || 0 }))}
                          />
                          <span className="text-xs text-gray-400">/ {qConfig?.max || 5}</span>
                        </div>
                      </div>
                      {q.reponseEtudiante ? (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                          {q.reponseEtudiante}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Pas de réponse fournie</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Note totale */}
              <div className={`p-4 rounded-xl text-center ${noteFinale >= 14 ? 'bg-green-50' : noteFinale >= 10 ? 'bg-amber-50' : 'bg-red-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Note finale</p>
                <p className={`text-4xl font-black ${noteFinale >= 14 ? 'text-green-700' : noteFinale >= 10 ? 'text-amber-700' : 'text-red-700'}`}>
                  {noteFinale}/20
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {noteFinale >= 16 ? 'Excellent' : noteFinale >= 14 ? 'Très bien' : noteFinale >= 12 ? 'Bien' : noteFinale >= 10 ? 'Passable' : 'Insuffisant'}
                </p>
              </div>

              {/* Commentaire */}
              {(selected.status === 'soumise' || selected.status === 'en_correction') && (
                <>
                  <div>
                    <label className="label">Commentaire global pour l'étudiante *</label>
                    <textarea
                      className="input min-h-[100px] resize-y text-sm"
                      placeholder={`Bonjour ${selected.etudiantId?.prenom},\n\nVos points forts : ...\nÀ travailler : ...\n\nBravo pour votre engagement sur les missions COSMETICA™ !`}
                      value={globalComment}
                      onChange={e => setGlobalComment(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleGrade}
                    disabled={grading || !globalComment.trim()}
                    className="btn-primary w-full"
                  >
                    {grading ? 'Enregistrement...' : `✅ Valider la note ${noteFinale}/20`}
                  </button>
                </>
              )}

              {selected.status === 'corrigee' && selected.commentaireGlobal && (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-700 mb-1">Commentaire enregistré :</p>
                  <p className="text-sm text-green-800">{selected.commentaireGlobal}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-center p-12">
              <div className="text-gray-400">
                <p className="text-4xl mb-3">📝</p>
                <p className="font-medium">Sélectionnez une évaluation à corriger</p>
                <p className="text-sm mt-1">Notation par question + commentaire personnalisé</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
