import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructorAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const SESSION_TIMER_KEY = 'cosmetica_session_timer';
const SESSION_DURATION = 3.5 * 60 * 60; // 3h30 in seconds

const STUDENT_STATUS_CONFIG = {
  avance: { label: 'Avancé', dot: 'bg-green-500', card: 'border-green-200 bg-green-50' },
  en_cours: { label: 'En cours', dot: 'bg-blue-500', card: 'border-blue-200 bg-blue-50' },
  attente: { label: 'En attente validation', dot: 'bg-amber-400', card: 'border-amber-200 bg-amber-50' },
  bloque: { label: 'Non démarré / Bloqué', dot: 'bg-red-400', card: 'border-red-100 bg-red-50' }
};

function getStudentStatus(student) {
  if ((student.progression || 0) >= 75) return 'avance';
  if (student.submissionEnAttente) return 'attente';
  if ((student.progression || 0) > 0) return 'en_cours';
  return 'bloque';
}

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState({});
  const [view, setView] = useState('classe'); // 'classe' | 'liste' | 'analytics'
  const [sessionTime, setSessionTime] = useState(null); // null = not started
  const [sessionRunning, setSessionRunning] = useState(false);
  const sessionTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        instructorAPI.getDashboard(),
        instructorAPI.getAnalytics()
      ]);
      setData(dashRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 45s
    refreshTimerRef.current = setInterval(loadData, 45000);
    const handler = () => loadData();
    window.addEventListener('submission:received', handler);

    // Restore session timer
    const saved = localStorage.getItem(SESSION_TIMER_KEY);
    if (saved) {
      const { startedAt } = JSON.parse(saved);
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = SESSION_DURATION - elapsed;
      if (remaining > 0) {
        setSessionTime(remaining);
        setSessionRunning(true);
      } else {
        localStorage.removeItem(SESSION_TIMER_KEY);
      }
    }

    return () => {
      clearInterval(refreshTimerRef.current);
      clearInterval(sessionTimerRef.current);
      window.removeEventListener('submission:received', handler);
    };
  }, [loadData]);

  useEffect(() => {
    if (sessionRunning && sessionTime !== null) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => {
          if (prev <= 1) {
            clearInterval(sessionTimerRef.current);
            setSessionRunning(false);
            toast('⏰ La session de 3h30 est terminée !', { duration: 10000 });
            localStorage.removeItem(SESSION_TIMER_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sessionTimerRef.current);
  }, [sessionRunning]);

  const startSession = () => {
    localStorage.setItem(SESSION_TIMER_KEY, JSON.stringify({ startedAt: Date.now() }));
    setSessionTime(SESSION_DURATION);
    setSessionRunning(true);
    toast.success('Session démarrée ! 3h30 au chrono.', { duration: 3000 });
  };

  const pauseSession = () => {
    setSessionRunning(false);
    clearInterval(sessionTimerRef.current);
    toast('Session en pause.', { icon: '⏸' });
  };

  const resumeSession = () => {
    const remaining = sessionTime;
    const startedAt = Date.now() - (SESSION_DURATION - remaining) * 1000;
    localStorage.setItem(SESSION_TIMER_KEY, JSON.stringify({ startedAt }));
    setSessionRunning(true);
    toast.success('Session reprise.', { duration: 2000 });
  };

  const resetSession = () => {
    if (!window.confirm('Réinitialiser le chronomètre de session ?')) return;
    clearInterval(sessionTimerRef.current);
    setSessionRunning(false);
    setSessionTime(null);
    localStorage.removeItem(SESSION_TIMER_KEY);
  };

  const handleUnlockSeance = async (studentId, seance, e) => {
    e?.stopPropagation();
    const key = `${studentId}-${seance}`;
    setUnlocking(p => ({ ...p, [key]: true }));
    try {
      await instructorAPI.unlockSeance(studentId, seance);
      toast.success(`Séance ${seance} débloquée !`);
      loadData();
    } catch {
      toast.error('Erreur de déverrouillage.');
    } finally {
      setUnlocking(p => ({ ...p, [key]: false }));
    }
  };

  const formatTimer = (s) => {
    if (s === null) return '--:--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const timerColor = () => {
    if (sessionTime === null || !sessionRunning) return 'text-gray-600';
    if (sessionTime < 15 * 60) return 'text-red-600';
    if (sessionTime < 30 * 60) return 'text-amber-600';
    return 'text-green-700';
  };

  const exportCSV = () => {
    const students = data?.students || [];
    const rows = [
      ['Prénom', 'Nom', 'Email', 'Progression %', 'Séance active', 'Score total', 'Badges'],
      ...students.map(s => [s.prenom, s.name, s.email, s.progression, s.seanceActive, s.scoreTotal, (s.badges || []).join(', ')])
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmetica_progression_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV téléchargé.');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-cosmetica-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-500">Chargement du tableau de bord formateur...</p>
      </div>
    </div>
  );

  const { students = [], alertes = [], stats = {} } = data || {};
  const notesBySeance = analytics?.notesMoyennesParSeance || [];

  // Mark students with pending submissions
  const pendingStudentIds = new Set(alertes.filter(a => a.type === 'submission').map(a => a.studentId || a.id));
  const studentsWithStatus = students.map(s => ({
    ...s,
    submissionEnAttente: pendingStudentIds.has(s._id),
    statusCode: getStudentStatus({ ...s, submissionEnAttente: pendingStudentIds.has(s._id) })
  }));

  const statusCounts = {
    avance: studentsWithStatus.filter(s => s.statusCode === 'avance').length,
    en_cours: studentsWithStatus.filter(s => s.statusCode === 'en_cours').length,
    attente: studentsWithStatus.filter(s => s.statusCode === 'attente').length,
    bloque: studentsWithStatus.filter(s => s.statusCode === 'bloque').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Top bar: title + session timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Espace Formateur — COSMETICA™</h1>
          <p className="text-gray-500 text-sm">Pilotage en temps réel · Master RH 1 · Promotion {new Date().getFullYear()}</p>
        </div>

        {/* Session timer */}
        <div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 font-medium mb-0.5">Chrono session</p>
            <p className={`text-2xl font-mono font-black ${timerColor()}`}>{formatTimer(sessionTime)}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            {sessionTime === null ? (
              <button onClick={startSession} className="btn-primary text-xs py-1.5 px-3">▶ Lancer 3h30</button>
            ) : sessionRunning ? (
              <button onClick={pauseSession} className="btn-secondary text-xs py-1.5 px-3">⏸ Pause</button>
            ) : (
              <button onClick={resumeSession} className="btn-primary text-xs py-1.5 px-3">▶ Reprendre</button>
            )}
            {sessionTime !== null && (
              <button onClick={resetSession} className="text-xs text-gray-400 hover:text-gray-600 text-center">↺ Reset</button>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Étudiantes', value: stats.totalEtudiantes, icon: '🎓', color: 'bg-gray-50' },
          { label: 'Avancées', value: statusCounts.avance, icon: '✅', color: 'bg-green-50' },
          { label: 'En cours', value: statusCounts.en_cours + statusCounts.attente, icon: '▶', color: 'bg-blue-50' },
          { label: 'À valider', value: stats.submissionsEnAttente, icon: '📋', color: stats.submissionsEnAttente > 0 ? 'bg-red-50' : 'bg-gray-50', urgent: stats.submissionsEnAttente > 0 },
          { label: 'Évals à corriger', value: stats.evaluationsACorreger, icon: '📝', color: stats.evaluationsACorreger > 0 ? 'bg-amber-50' : 'bg-gray-50', urgent: stats.evaluationsACorreger > 0 }
        ].map((s, i) => (
          <div key={i} className={`card ${s.color} border-0 py-4 px-4 ${s.urgent ? 'ring-2 ring-red-300' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-xl font-black text-gray-900">{s.value ?? '—'}</p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View selector + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {[
            { id: 'classe', label: '🎓 Vue Classe' },
            { id: 'liste', label: '📋 Liste' },
            { id: 'analytics', label: '📊 Analytics' }
          ].map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === v.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/instructor/submissions')} className="btn-secondary text-sm py-2 relative">
            ✅ Valider livrables
            {stats.submissionsEnAttente > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{stats.submissionsEnAttente}</span>
            )}
          </button>
          <button onClick={() => navigate('/instructor/evaluations')} className="btn-secondary text-sm py-2 relative">
            📝 Corriger évals
            {stats.evaluationsACorreger > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{stats.evaluationsACorreger}</span>
            )}
          </button>
          <button onClick={exportCSV} className="btn-secondary text-sm py-2">⬇ CSV</button>
          <button onClick={loadData} className="btn-secondary text-sm py-2">🔄</button>
        </div>
      </div>

      {/* ALERTS BANNER */}
      {alertes.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="font-bold text-amber-900 mb-2">{alertes.length} action{alertes.length > 1 ? 's' : ''} en attente</p>
              <div className="flex flex-wrap gap-2">
                {alertes.slice(0, 6).map((a, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(a.type === 'submission' ? '/instructor/submissions' : '/instructor/evaluations')}
                    className="bg-white border border-amber-200 rounded-xl px-3 py-1.5 text-xs font-medium text-amber-900 hover:shadow-sm transition-shadow"
                  >
                    {a.type === 'submission' ? '📋' : '📝'} {a.studentName} — {a.type === 'submission' ? a.missionTitle : `Éval S${a.seance}`}
                  </button>
                ))}
                {alertes.length > 6 && (
                  <span className="text-xs text-amber-700 self-center">+{alertes.length - 6} autres</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VUE CLASSE ===================== */}
      {view === 'classe' && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{students.length}</span> étudiantes · Actualisation auto toutes les 45s
            </p>
            <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
              {Object.entries(STUDENT_STATUS_CONFIG).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${v.dot}`} />
                  {v.label} ({statusCounts[k]})
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {studentsWithStatus.map(student => (
              <StudentCard
                key={student._id}
                student={student}
                onUnlockSeance={handleUnlockSeance}
                unlocking={unlocking}
                onGoToSubmissions={() => navigate('/instructor/submissions')}
              />
            ))}
            {students.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">🎓</p>
                <p>Aucune étudiante enregistrée. Utilisez le code <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">COSMETICA2024</code> pour s'inscrire.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== VUE LISTE ===================== */}
      {view === 'liste' && (
        <div className="card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">Étudiante</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold hidden sm:table-cell">Email</th>
                <th className="text-center py-3 px-4 text-gray-500 font-semibold">Séance</th>
                <th className="text-center py-3 px-4 text-gray-500 font-semibold">Progression</th>
                <th className="text-center py-3 px-4 text-gray-500 font-semibold">Score</th>
                <th className="text-left py-3 px-4 text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentsWithStatus.map(student => (
                <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cosmetica-100 rounded-lg flex items-center justify-center text-xs font-bold text-cosmetica-700 flex-shrink-0">
                        {student.prenom?.[0]}{student.name?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold">{student.prenom} {student.name}</p>
                        {student.submissionEnAttente && <span className="badge-orange text-xs">À valider</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{student.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold">S{student.seanceActive}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cosmetica-500 rounded-full" style={{ width: `${student.progression}%` }} />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">{student.progression}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">{student.scoreTotal} pts</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {[1, 2, 3, 4].map(s => (
                        <button
                          key={s}
                          onClick={() => handleUnlockSeance(student._id, s)}
                          disabled={unlocking[`${student._id}-${s}`]}
                          className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:border-cosmetica-300 hover:text-cosmetica-600 transition-colors disabled:opacity-40"
                        >
                          {unlocking[`${student._id}-${s}`] ? '...' : `🔓S${s}`}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== ANALYTICS ===================== */}
      {view === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">📊 Notes moyennes par séance</h3>
            {notesBySeance.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={notesBySeance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="seance" tickFormatter={v => `Séance ${v}`} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={v => [`${v}/20`, 'Moyenne']} />
                  <Bar dataKey="moyenne" fill="#db2777" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-2">📉</p>
                <p className="text-sm">Aucune évaluation corrigée pour le moment.</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">🎓 Répartition de la promotion</h3>
            <div className="space-y-4">
              {Object.entries(STUDENT_STATUS_CONFIG).map(([key, conf]) => {
                const count = statusCounts[key];
                const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${conf.dot}`} />
                        {conf.label}
                      </span>
                      <span className="font-semibold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${conf.dot} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
              Progression moyenne : <strong className="text-gray-900">{stats.progressionMoyenne || 0}%</strong>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">🏅 Classement (score total)</h3>
            <div className="space-y-2">
              {[...studentsWithStatus]
                .sort((a, b) => (b.scoreTotal || 0) - (a.scoreTotal || 0))
                .map((s, i) => (
                  <div key={s._id} className="flex items-center gap-3 py-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{s.prenom} {s.name}</p>
                    </div>
                    <span className="font-bold text-cosmetica-600">{s.scoreTotal || 0} pts</span>
                    {s.badges?.length > 0 && (
                      <span className="text-xs text-gray-400">{s.badges.length} 🏅</span>
                    )}
                  </div>
                ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">⏱ Activité récente</h3>
            {alertes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-3xl mb-2">✅</p>
                <p className="text-sm">Aucune action en attente</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alertes.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(a.type === 'submission' ? '/instructor/submissions' : '/instructor/evaluations')}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-cosmetica-200 hover:bg-cosmetica-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{a.type === 'submission' ? '📋' : '📝'}</span>
                      <span className="text-sm font-medium text-gray-900">{a.studentName}</span>
                      <span className="text-xs text-gray-500">
                        {a.type === 'submission' ? a.missionTitle : `Éval S${a.seance}`}
                      </span>
                    </div>
                    {a.date && (
                      <p className="text-xs text-gray-400 mt-0.5 ml-6">
                        {new Date(a.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student, onUnlockSeance, unlocking, onGoToSubmissions }) {
  const [expanded, setExpanded] = useState(false);
  const conf = STUDENT_STATUS_CONFIG[student.statusCode];
  const timeSince = student.derniereActivite
    ? getTimeSince(student.derniereActivite)
    : 'Aucune activité';

  return (
    <div className={`rounded-2xl border-2 transition-all ${conf.card} overflow-hidden`}>
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-sm font-black text-cosmetica-700 border border-cosmetica-100 flex-shrink-0">
              {student.prenom?.[0]}{student.name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{student.prenom} {student.name}</p>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${conf.dot}`} />
                <span className="text-xs text-gray-500">{conf.label}</span>
              </div>
            </div>
          </div>
          {student.submissionEnAttente && (
            <button
              onClick={(e) => { e.stopPropagation(); onGoToSubmissions(); }}
              className="text-xs bg-amber-500 text-white px-2 py-1 rounded-lg font-semibold flex-shrink-0"
            >
              À valider
            </button>
          )}
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Séance {student.seanceActive} · {student.scoreTotal || 0} pts</span>
            <span className="font-semibold">{student.progression}%</span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cosmetica-400 to-cosmetica-600"
              style={{ width: `${student.progression}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-gray-400">{timeSince}</p>
      </div>

      {expanded && (
        <div className="border-t border-white border-opacity-60 bg-white bg-opacity-50 p-3">
          {student.badges?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {student.badges.map(b => <span key={b} className="badge-purple text-xs">{b}</span>)}
            </div>
          )}
          <p className="text-xs font-semibold text-gray-600 mb-2">Débloquer une séance :</p>
          <div className="grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map(s => (
              <button
                key={s}
                onClick={(e) => onUnlockSeance(student._id, s, e)}
                disabled={unlocking[`${student._id}-${s}`]}
                className="text-xs py-1.5 rounded-lg bg-white border border-gray-200 hover:border-cosmetica-300 hover:text-cosmetica-700 font-medium transition-colors disabled:opacity-40"
              >
                {unlocking[`${student._id}-${s}`] ? '...' : `S${s}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeSince(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMin = Math.floor((now - date) / 60000);
  if (diffMin < 2) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Il y a ${diffH}h`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}
