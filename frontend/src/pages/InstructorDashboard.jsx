import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructorAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import toast from 'react-hot-toast';

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState({});

  const loadData = useCallback(async () => {
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        instructorAPI.getDashboard(),
        instructorAPI.getAnalytics()
      ]);
      setData(dashRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (err) {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const handler = () => loadData();
    window.addEventListener('submission:received', handler);
    return () => window.removeEventListener('submission:received', handler);
  }, [loadData]);

  const handleUnlockSeance = async (studentId, seance) => {
    const key = `${studentId}-${seance}`;
    setUnlocking(p => ({ ...p, [key]: true }));
    try {
      await instructorAPI.unlockSeance(studentId, seance);
      toast.success(`Séance ${seance} débloquée !`);
      loadData();
    } catch (err) {
      toast.error('Erreur de déverrouillage.');
    } finally {
      setUnlocking(p => ({ ...p, [key]: false }));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" />
    </div>
  );

  const { students = [], alertes = [], stats = {} } = data || {};
  const notesBySeance = analytics?.notesMoyennesParSeance || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">👩‍🏫 Espace Formateur — COSMETICA™ RH Game</h1>
        <p className="text-gray-500">Pilotage en temps réel de votre promotion Master RH 1</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Étudiantes', value: stats.totalEtudiantes, icon: '🎓', color: 'bg-blue-50 text-blue-700' },
          { label: 'Livrables à valider', value: stats.submissionsEnAttente, icon: '📋', color: stats.submissionsEnAttente > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500', urgent: stats.submissionsEnAttente > 0 },
          { label: 'Évals à corriger', value: stats.evaluationsACorreger, icon: '📝', color: stats.evaluationsACorreger > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500', urgent: stats.evaluationsACorreger > 0 },
          { label: 'Progression moy.', value: `${stats.progressionMoyenne}%`, icon: '📈', color: 'bg-green-50 text-green-700' }
        ].map((stat, i) => (
          <div key={i} className={`card ${stat.color} border-0 ${stat.urgent ? 'ring-2 ring-red-300 animate-pulse-slow' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs font-medium opacity-75">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertes temps réel */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                🔔 Alertes temps réel
                {alertes.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{alertes.length}</span>
                )}
              </h2>
              <button onClick={() => navigate('/instructor/submissions')} className="text-xs text-cosmetica-600 hover:underline">
                Voir tout →
              </button>
            </div>

            {alertes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm">Aucune alerte en attente</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {alertes.map((alerte, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(alerte.type === 'submission' ? '/instructor/submissions' : '/instructor/evaluations')}
                    className={`p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-shadow ${
                      alerte.urgence === 'haute' ? 'border-amber-200 bg-amber-50' : 'border-blue-100 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{alerte.type === 'submission' ? '📋' : '📝'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{alerte.studentName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {alerte.type === 'submission' ? alerte.missionTitle : `Éval. Séance ${alerte.seance}`}
                        </p>
                        <p className="text-xs text-gray-400">{alerte.date ? new Date(alerte.date).toLocaleString('fr-FR') : ''}</p>
                      </div>
                      <span className="text-gray-400 text-sm">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes moyennes */}
          {notesBySeance.length > 0 && (
            <div className="card mt-4">
              <h2 className="font-bold text-gray-900 mb-4">📊 Notes moyennes / séance</h2>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={notesBySeance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="seance" tick={{ fontSize: 11 }} tickFormatter={v => `S${v}`} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}/20`, 'Moyenne']} />
                  <Bar dataKey="moyenne" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Suivi étudiantes */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="font-bold text-gray-900 mb-4">🎓 Suivi individuel des étudiantes</h2>
            <div className="space-y-4">
              {students.map(student => (
                <StudentProgressRow
                  key={student._id}
                  student={student}
                  onUnlockSeance={handleUnlockSeance}
                  unlocking={unlocking}
                />
              ))}
              {students.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>Aucune étudiante enregistrée.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Valider les livrables', icon: '✅', to: '/instructor/submissions', badge: stats.submissionsEnAttente },
          { label: 'Corriger les évals', icon: '📝', to: '/instructor/evaluations', badge: stats.evaluationsACorreger },
          { label: 'Salariés fictifs', icon: '👥', to: '/employees' },
          { label: 'Actualiser', icon: '🔄', onClick: loadData }
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => action.to ? navigate(action.to) : action.onClick?.()}
            className="card text-center hover:shadow-md transition-shadow cursor-pointer relative"
          >
            {action.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{action.badge}</span>
            )}
            <div className="text-2xl mb-1">{action.icon}</div>
            <p className="text-sm font-medium text-gray-700">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function StudentProgressRow({ student, onUnlockSeance, unlocking }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="w-10 h-10 bg-cosmetica-100 rounded-xl flex items-center justify-center font-bold text-cosmetica-700 flex-shrink-0">
          {student.prenom?.[0]}{student.name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">{student.prenom} {student.name}</p>
          <p className="text-xs text-gray-500">{student.email}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-gray-900">{student.progression}%</p>
          <p className="text-xs text-gray-500">Séance {student.seanceActive}</p>
        </div>
        <div className="w-20">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-cosmetica-500 rounded-full transition-all"
              style={{ width: `${student.progression}%` }}
            />
          </div>
        </div>
        <div className="text-gray-400">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-500">⭐ {student.scoreTotal} pts</span>
            {student.badges?.map(b => <span key={b} className="badge-purple text-xs">{b}</span>)}
            {student.derniereActivite && (
              <span className="text-xs text-gray-400">Dernière activité : {new Date(student.derniereActivite).toLocaleDateString('fr-FR')}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map(seance => {
              const key = `${student._id}-${seance}`;
              return (
                <button
                  key={seance}
                  onClick={(e) => { e.stopPropagation(); onUnlockSeance(student._id, seance); }}
                  disabled={unlocking[key]}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-cosmetica-300 hover:text-cosmetica-600 transition-colors disabled:opacity-50"
                >
                  {unlocking[key] ? '...' : `🔓 Débloquer S${seance}`}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
