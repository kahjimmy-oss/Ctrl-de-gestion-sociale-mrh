import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionsAPI, progressAPI, evaluationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  verrouillee: { label: 'Verrouillée', color: 'bg-gray-100 text-gray-500', icon: '🔒', canAccess: false },
  active: { label: 'En cours', color: 'bg-cosmetica-50 text-cosmetica-700 border border-cosmetica-200', icon: '▶️', canAccess: true },
  soumise: { label: 'Soumise', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: '⏳', canAccess: true },
  completee: { label: 'Validée', color: 'bg-green-50 text-green-700 border border-green-200', icon: '✅', canAccess: true }
};

const TYPE_LABELS = { collectif: '👥 Mission collectif', individuel: '👤 Mission individuel', prerequis: '🔓 Pré-requis' };

const SEANCE_THEMES = {
  1: { title: 'Audit Recrutement & Indicateurs RH', color: 'from-blue-500 to-blue-700', emoji: '🔍' },
  2: { title: 'Budget RH & Masse Salariale', color: 'from-emerald-500 to-emerald-700', emoji: '💰' },
  3: { title: 'Performance, Turnover & Absentéisme', color: 'from-orange-500 to-orange-700', emoji: '📊' },
  4: { title: 'Reporting, Baromètre Social & Synthèse', color: 'from-purple-500 to-purple-700', emoji: '🏆' }
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSeance, setActiveSeance] = useState(1);

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener('submission:update', handler);
    window.addEventListener('evaluation:unlocked', handler);
    window.addEventListener('seance:unlocked', handler);
    return () => {
      window.removeEventListener('submission:update', handler);
      window.removeEventListener('evaluation:unlocked', handler);
      window.removeEventListener('seance:unlocked', handler);
    };
  }, []);

  const loadData = async () => {
    try {
      const [missionsRes, progressRes, evalsRes] = await Promise.all([
        missionsAPI.getAll(),
        progressAPI.getMe(),
        evaluationsAPI.getAll()
      ]);
      setMissions(missionsRes.data.data || []);
      setProgress(progressRes.data.data);
      setEvaluations(evalsRes.data.data || []);
      const prog = progressRes.data.data;
      if (prog?.seanceActive) setActiveSeance(prog.seanceActive);
    } catch (err) {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-cosmetica-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Chargement de COSMETICA™...</p>
      </div>
    </div>
  );

  const missionsBySeance = {};
  for (let i = 1; i <= 4; i++) missionsBySeance[i] = missions.filter(m => m.seance === i);

  const seanceProgress = (num) => {
    const seanceMissions = missionsBySeance[num] || [];
    const done = seanceMissions.filter(m => m.progressStatus === 'completee').length;
    return seanceMissions.length > 0 ? Math.round((done / seanceMissions.length) * 100) : 0;
  };

  const getEvalForSeance = (seance) => evaluations.find(e => e.seance === seance);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-8 bg-gradient-to-r from-cosmetica-600 to-cosmetica-800 rounded-3xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-cosmetica-200 text-sm font-medium mb-1">Bienvenue,</p>
            <h1 className="text-2xl sm:text-3xl font-black">{user?.prenom} {user?.name} 👋</h1>
            <p className="text-cosmetica-200 mt-2">Consultante RH chez COSMETICA™ · {user?.groupe}</p>
          </div>
          <div className="text-right">
            <p className="text-cosmetica-200 text-sm">Score total</p>
            <p className="text-3xl font-black">{progress?.scoreTotal || 0} pts</p>
            {progress?.badges?.length > 0 && (
              <p className="text-cosmetica-200 text-xs mt-1">{progress.badges.join(' · ')}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cosmetica-200 text-sm">Progression globale</span>
            <span className="text-white font-bold">{progress?.progressionGlobale || 0}%</span>
          </div>
          <div className="h-2.5 bg-cosmetica-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress?.progressionGlobale || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Seance tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map(n => {
          const theme = SEANCE_THEMES[n];
          const pct = seanceProgress(n);
          const seanceInfo = progress?.seances?.find(s => s.numero === n);
          const isLocked = !seanceInfo?.debloquee;
          return (
            <button
              key={n}
              onClick={() => !isLocked && setActiveSeance(n)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all text-left min-w-[150px] ${
                activeSeance === n
                  ? 'border-cosmetica-400 bg-cosmetica-50'
                  : isLocked
                  ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 bg-white hover:border-cosmetica-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{isLocked ? '🔒' : theme.emoji}</span>
                <span className="font-bold text-gray-900 text-sm">Séance {n}</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${theme.color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-1">{pct}% complété</p>
            </button>
          );
        })}
      </div>

      {/* Active Seance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={`bg-gradient-to-r ${SEANCE_THEMES[activeSeance].color} rounded-2xl p-5 mb-4 text-white`}>
            <h2 className="text-xl font-bold flex items-center gap-2">
              {SEANCE_THEMES[activeSeance].emoji} Séance {activeSeance}
              <span className="text-sm font-normal opacity-80">— 3h30</span>
            </h2>
            <p className="text-sm opacity-90 mt-1">{SEANCE_THEMES[activeSeance].title}</p>
          </div>

          <div className="space-y-3">
            {(missionsBySeance[activeSeance] || []).map((mission, idx) => {
              const status = STATUS_CONFIG[mission.progressStatus] || STATUS_CONFIG.verrouillee;
              return (
                <div
                  key={mission._id}
                  onClick={() => status.canAccess && navigate(`/missions/${mission._id}`)}
                  className={`card flex items-start gap-4 ${status.canAccess ? 'cursor-pointer hover:shadow-md transition-shadow' : 'opacity-70'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    mission.progressStatus === 'completee' ? 'bg-green-100' :
                    mission.progressStatus === 'active' ? 'bg-cosmetica-100' : 'bg-gray-100'
                  }`}>
                    {status.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{mission.titre}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{mission.sousTitre}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>{TYPE_LABELS[mission.type]}</span>
                      {mission.dureeEstimeeMin && <span>⏱ {mission.dureeEstimeeMin} min</span>}
                      {mission.pointsRecompense > 0 && <span>⭐ +{mission.pointsRecompense} pts</span>}
                    </div>
                  </div>
                  {status.canAccess && (
                    <div className="text-cosmetica-500 text-xl">→</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: évaluation + info */}
        <div className="space-y-4">
          {/* Évaluation */}
          {(() => {
            const eval_ = getEvalForSeance(activeSeance);
            const evalStatuses = {
              non_commence: { label: 'Non commencée', color: 'badge-blue', btn: '📝 Accéder', canStart: true },
              en_cours: { label: 'En cours', color: 'badge-orange', btn: '▶ Continuer', canStart: true },
              soumise: { label: 'Soumise — En correction', color: 'badge-orange', btn: null, canStart: false },
              corrigee: { label: 'Corrigée', color: 'badge-green', btn: '📊 Voir résultat', canStart: true }
            };
            const es = evalStatuses[eval_?.status] || evalStatuses.non_commence;
            return (
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📝 Évaluation individuelle
                  <span className="text-xs font-normal text-gray-500">20 pts</span>
                </h3>
                {eval_?.accessible ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={eval_?.status === 'corrigee' ? 'badge-green' : 'badge-orange'}>{es.label}</span>
                      {eval_?.noteFinale !== undefined && (
                        <span className="font-bold text-lg text-gray-900">{eval_.noteFinale}/20</span>
                      )}
                    </div>
                    {es.btn && (
                      <button
                        onClick={() => navigate(`/evaluation/${activeSeance}`)}
                        className="btn-primary w-full text-sm"
                      >
                        {es.btn}
                      </button>
                    )}
                    {eval_?.commentaireGlobal && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-600 font-medium mb-1">Retour formateur :</p>
                        <p className="text-sm text-gray-700">{eval_.commentaireGlobal}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-sm text-gray-500">Accessible après validation de vos livrables collectifs par le formateur</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Quick access */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">🏢 COSMETICA™</h3>
            <p className="text-sm text-gray-500 mb-3">PME cosmétique · 65 salariés · Consultez les profils de votre équipe fictive.</p>
            <button
              onClick={() => navigate('/employees')}
              className="btn-secondary w-full text-sm"
            >
              👥 Voir les salariés →
            </button>
          </div>

          {/* Badges */}
          {progress?.badges?.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">🏅 Badges obtenus</h3>
              <div className="flex flex-wrap gap-2">
                {progress.badges.map(b => (
                  <span key={b} className="badge-purple">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
