import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionsAPI, progressAPI, evaluationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  verrouillee: { label: 'Verrouillée', color: 'bg-gray-100 text-gray-500', icon: '🔒', canAccess: false },
  active: { label: 'À faire', color: 'bg-cosmetica-50 text-cosmetica-700 border border-cosmetica-200', icon: '▶', canAccess: true },
  soumise: { label: 'En attente validation', color: 'bg-amber-50 text-amber-700 border border-amber-200', icon: '⏳', canAccess: true },
  completee: { label: 'Validée ✓', color: 'bg-green-50 text-green-700 border border-green-200', icon: '✅', canAccess: true }
};

const TYPE_LABELS = {
  collectif: { label: 'Mission collectif', icon: '👥' },
  individuel: { label: 'Mission individuel', icon: '👤' },
  prerequis: { label: 'Pré-requis', icon: '🔓' }
};

const SEANCE_THEMES = {
  1: { title: 'Audit Recrutement & Indicateurs RH', color: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 border-blue-200', emoji: '🔍', description: 'Analysez les indicateurs de recrutement de COSMETICA™ et identifiez les dysfonctionnements.' },
  2: { title: 'Budget RH & Masse Salariale', color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 border-emerald-200', emoji: '💰', description: 'Analysez les écarts budgétaires et proposez des mesures d\'adaptation de la masse salariale.' },
  3: { title: 'Performance, Turnover & Absentéisme', color: 'from-orange-500 to-red-500', light: 'bg-orange-50 border-orange-200', emoji: '📊', description: 'Construisez le baromètre social et identifiez les risques de la promotion.' },
  4: { title: 'Reporting, Baromètre & Synthèse CODIR', color: 'from-purple-600 to-violet-700', light: 'bg-purple-50 border-purple-200', emoji: '🏆', description: 'Produisez le rapport de contrôle de gestion RH et présentez vos recommandations au CODIR.' }
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
      const m = missionsRes.data.data || [];
      const p = progressRes.data.data;
      const e = evalsRes.data.data || [];
      setMissions(m);
      setProgress(p);
      setEvaluations(e);
      if (p?.seanceActive) setActiveSeance(p.seanceActive);
    } catch {
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

  const seancePct = (num) => {
    const ms = missionsBySeance[num] || [];
    const done = ms.filter(m => m.progressStatus === 'completee').length;
    return ms.length > 0 ? Math.round((done / ms.length) * 100) : 0;
  };

  const getEval = (seance) => evaluations.find(e => e.seance === seance);

  // Compute "next action" for the hero banner
  const getNextAction = () => {
    // Look for an unlocked eval first
    for (let s = 1; s <= 4; s++) {
      const eval_ = getEval(s);
      if (eval_?.accessible && (eval_.status === 'non_commence' || eval_.status === 'en_cours')) {
        return { type: 'eval', seance: s, label: `Évaluation Séance ${s} disponible`, cta: 'Commencer l\'évaluation →', path: `/evaluation/${s}`, color: 'bg-purple-600' };
      }
    }
    // Active mission
    const activeMission = missions.find(m => m.progressStatus === 'active');
    if (activeMission) {
      return { type: 'mission', label: activeMission.titre, cta: 'Accéder à la mission →', path: `/missions/${activeMission._id}`, color: 'bg-cosmetica-600', sub: `Séance ${activeMission.seance} · ${TYPE_LABELS[activeMission.type]?.label}` };
    }
    // Waiting for validation
    const waiting = missions.find(m => m.progressStatus === 'soumise');
    if (waiting) {
      return { type: 'wait', label: `"${waiting.titre}" — soumise`, cta: null, color: 'bg-amber-500', sub: 'En attente de validation par votre formateur.' };
    }
    // All done
    if (progress?.progressionGlobale >= 100) {
      return { type: 'done', label: 'Formation terminée !', cta: null, color: 'bg-green-600', sub: 'Félicitations ! Vous avez complété toutes les missions.' };
    }
    return null;
  };

  const nextAction = getNextAction();
  const seanceUnlocked = (n) => progress?.seances?.find(s => s.numero === n)?.debloquee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero */}
      <div className="mb-6 bg-gradient-to-br from-cosmetica-700 via-cosmetica-600 to-cosmetica-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-cosmetica-300 text-sm font-medium">Bienvenue,</p>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5">{user?.prenom} {user?.name}</h1>
            <p className="text-cosmetica-200 text-sm mt-1">Consultant(e) RH fictif(ve) chez COSMETICA™ · 65 salariés</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-cosmetica-300 text-xs font-medium">Score total</p>
            <p className="text-4xl font-black">{progress?.scoreTotal || 0} <span className="text-xl text-cosmetica-300">pts</span></p>
            {progress?.badges?.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end mt-1">
                {progress.badges.slice(0, 3).map(b => (
                  <span key={b} className="text-xs bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-cosmetica-300 text-xs font-medium">Progression globale</span>
            <span className="text-white text-sm font-bold">{progress?.progressionGlobale || 0}%</span>
          </div>
          <div className="h-2.5 bg-cosmetica-900 bg-opacity-50 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress?.progressionGlobale || 0}%` }} />
          </div>
        </div>
      </div>

      {/* NEXT ACTION BANNER */}
      {nextAction && (
        <div className={`mb-6 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white ${nextAction.color}`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">
              {nextAction.type === 'eval' ? '📝 Évaluation disponible' :
               nextAction.type === 'mission' ? '▶ À faire maintenant' :
               nextAction.type === 'wait' ? '⏳ En attente' : '🏆 Terminé'}
            </p>
            <p className="font-bold text-lg leading-tight">{nextAction.label}</p>
            {nextAction.sub && <p className="text-sm opacity-80 mt-0.5">{nextAction.sub}</p>}
          </div>
          {nextAction.cta && nextAction.path && (
            <button
              onClick={() => navigate(nextAction.path)}
              className="flex-shrink-0 bg-white text-gray-900 font-bold py-2.5 px-5 rounded-xl text-sm hover:shadow-lg transition-all"
            >
              {nextAction.cta}
            </button>
          )}
        </div>
      )}

      {/* Séance tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map(n => {
          const theme = SEANCE_THEMES[n];
          const pct = seancePct(n);
          const locked = !seanceUnlocked(n);
          return (
            <button
              key={n}
              onClick={() => !locked && setActiveSeance(n)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 text-left min-w-[160px] transition-all ${
                activeSeance === n ? `border-cosmetica-400 bg-cosmetica-50` :
                locked ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' :
                'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span>{locked ? '🔒' : theme.emoji}</span>
                <span className="font-bold text-gray-900 text-sm">Séance {n}</span>
                {pct === 100 && <span className="text-green-500 text-xs">✓</span>}
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div className={`h-full bg-gradient-to-r ${theme.color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-500">{pct}% complété</p>
            </button>
          );
        })}
      </div>

      {/* Active Seance content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Seance header */}
          <div className={`bg-gradient-to-r ${SEANCE_THEMES[activeSeance].color} rounded-2xl p-5 text-white`}>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
              {SEANCE_THEMES[activeSeance].emoji} Séance {activeSeance}
              <span className="text-sm font-normal opacity-75">— 3h30</span>
            </h2>
            <p className="font-semibold text-base opacity-95">{SEANCE_THEMES[activeSeance].title}</p>
            <p className="text-sm opacity-80 mt-1">{SEANCE_THEMES[activeSeance].description}</p>
          </div>

          {/* Missions */}
          <div className="space-y-3">
            {(missionsBySeance[activeSeance] || []).map((mission, idx) => {
              const status = STATUS_CONFIG[mission.progressStatus] || STATUS_CONFIG.verrouillee;
              const typeInfo = TYPE_LABELS[mission.type] || { label: mission.type, icon: '📋' };
              const isNextAction = nextAction?.path === `/missions/${mission._id}`;

              return (
                <div
                  key={mission._id}
                  onClick={() => status.canAccess && navigate(`/missions/${mission._id}`)}
                  className={`card flex items-start gap-4 transition-all ${
                    status.canAccess ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : 'opacity-60'
                  } ${isNextAction ? 'ring-2 ring-cosmetica-400 shadow-cosmetica-100 shadow-lg' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    mission.progressStatus === 'completee' ? 'bg-green-100' :
                    mission.progressStatus === 'active' ? 'bg-cosmetica-100' :
                    mission.progressStatus === 'soumise' ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    {status.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900">{mission.titre}</h3>
                      {isNextAction && <span className="text-xs bg-cosmetica-100 text-cosmetica-700 px-2 py-0.5 rounded-full font-semibold">→ À faire</span>}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{mission.sousTitre}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                      <span className="flex items-center gap-1">{typeInfo.icon} {typeInfo.label}</span>
                      {mission.dureeEstimeeMin && <span>⏱ {mission.dureeEstimeeMin} min</span>}
                      {mission.pointsRecompense > 0 && <span className="text-cosmetica-500 font-semibold">+{mission.pointsRecompense} pts</span>}
                    </div>
                  </div>
                  {status.canAccess && (
                    <span className="text-cosmetica-400 text-lg self-center flex-shrink-0">→</span>
                  )}
                </div>
              );
            })}
            {(missionsBySeance[activeSeance] || []).length === 0 && (
              <div className="card text-center py-10 text-gray-400">
                <p className="text-4xl mb-2">🔒</p>
                <p>Cette séance n'est pas encore disponible.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Évaluation individuelle */}
          {(() => {
            const eval_ = getEval(activeSeance);
            return (
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                  <span>📝 Évaluation Séance {activeSeance}</span>
                  <span className="text-xs font-normal text-gray-400">20 pts</span>
                </h3>
                {eval_?.accessible ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {eval_.status === 'corrigee' ? (
                        <>
                          <span className="badge-green">Corrigée</span>
                          <span className="text-2xl font-black text-gray-900">{eval_.noteFinale}/20</span>
                        </>
                      ) : eval_.status === 'soumise' ? (
                        <span className="badge-orange">Soumise — en correction</span>
                      ) : (
                        <span className="badge-blue">Disponible</span>
                      )}
                    </div>
                    {(eval_.status === 'non_commence' || eval_.status === 'en_cours') && (
                      <button onClick={() => navigate(`/evaluation/${activeSeance}`)} className="btn-primary w-full text-sm">
                        {eval_.status === 'en_cours' ? '▶ Continuer' : '📝 Commencer'}
                      </button>
                    )}
                    {eval_.status === 'corrigee' && (
                      <button onClick={() => navigate(`/evaluation/${activeSeance}`)} className="btn-secondary w-full text-sm">
                        📊 Voir mes résultats
                      </button>
                    )}
                    {eval_?.commentaireGlobal && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl border-l-4 border-cosmetica-300">
                        <p className="text-xs text-gray-500 font-medium mb-1">Retour formateur :</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{eval_.commentaireGlobal}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-sm text-gray-500 leading-relaxed">Accessible après validation de vos livrables collectifs par le formateur.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* COSMETICA link */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-1">🏢 Salariés COSMETICA™</h3>
            <p className="text-xs text-gray-500 mb-3">PME cosmétique · 65 salariés fictifs · Données RH détaillées disponibles.</p>
            <button onClick={() => navigate('/employees')} className="btn-secondary w-full text-sm">
              👥 Consulter l'annuaire →
            </button>
          </div>

          {/* Progression séances overview */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">📈 Avancement global</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(n => {
                const pct = seancePct(n);
                const locked = !seanceUnlocked(n);
                const theme = SEANCE_THEMES[n];
                return (
                  <div key={n} className={locked ? 'opacity-40' : ''}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{theme.emoji} Séance {n}</span>
                      <span className={pct === 100 ? 'text-green-600 font-bold' : 'text-gray-500'}>{pct === 100 ? '✓ Terminée' : `${pct}%`}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${theme.color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges */}
          {(progress?.badges?.length || 0) > 0 && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">🏅 Mes badges</h3>
              <div className="flex flex-wrap gap-2">
                {progress.badges.map(b => (
                  <span key={b} className="badge-purple text-xs">{b}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
