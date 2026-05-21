import { useState, useEffect } from 'react';
import { employeesAPI } from '../services/api';
import toast from 'react-hot-toast';

const RISK_CONFIG = {
  faible: { label: 'Faible', class: 'badge-green', dot: 'bg-green-500' },
  moyen: { label: 'Moyen', class: 'badge-orange', dot: 'bg-orange-500' },
  élevé: { label: 'Élevé', class: 'badge-red', dot: 'bg-red-500' }
};

const DEPT_COLORS = {
  'RH': 'bg-purple-100 text-purple-700',
  'Commercial': 'bg-blue-100 text-blue-700',
  'Production': 'bg-green-100 text-green-700',
  'Marketing': 'bg-pink-100 text-pink-700',
  'R&D': 'bg-indigo-100 text-indigo-700',
  'Finance': 'bg-yellow-100 text-yellow-700',
  'Direction': 'bg-gray-100 text-gray-700',
  'Logistique': 'bg-orange-100 text-orange-700',
  'Qualité': 'bg-teal-100 text-teal-700'
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({ departement: '', actif: 'true', search: '' });

  useEffect(() => {
    employeesAPI.getAll({ actif: filter.actif })
      .then(res => setEmployees(res.data.data || []))
      .catch(() => toast.error('Erreur de chargement.'))
      .finally(() => setLoading(false));
  }, [filter.actif]);

  const filtered = employees.filter(e => {
    const matchSearch = !filter.search || `${e.nom} ${e.prenom} ${e.poste}`.toLowerCase().includes(filter.search.toLowerCase());
    const matchDept = !filter.departement || e.departement === filter.departement;
    return matchSearch && matchDept;
  });

  const departments = [...new Set(employees.map(e => e.departement))].sort();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">🏢 Équipe COSMETICA™</h1>
        <p className="text-gray-500">PME cosmétique — 65 salariés — Vos "vrais faux" collègues</p>
      </div>

      {/* Filtres */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            className="input flex-1 min-w-[200px]"
            placeholder="🔍 Rechercher un salarié..."
            value={filter.search}
            onChange={e => setFilter(p => ({ ...p, search: e.target.value }))}
          />
          <select
            className="input w-auto"
            value={filter.departement}
            onChange={e => setFilter(p => ({ ...p, departement: e.target.value }))}
          >
            <option value="">Tous les départements</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="flex gap-2">
            {['true', 'false', ''].map(v => (
              <button
                key={v}
                onClick={() => setFilter(p => ({ ...p, actif: v }))}
                className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  filter.actif === v ? 'bg-cosmetica-50 border-cosmetica-300 text-cosmetica-700' : 'border-gray-200 text-gray-500'
                }`}
              >
                {v === 'true' ? '✅ Actifs' : v === 'false' ? '❌ Partis' : '🔎 Tous'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} salarié·e·s affiché·e·s</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Liste */}
        <div className="lg:col-span-1 space-y-2 overflow-y-auto max-h-[70vh]">
          {filtered.map(emp => {
            const risk = RISK_CONFIG[emp.turnoverRisk] || RISK_CONFIG.faible;
            return (
              <div
                key={emp._id}
                onClick={() => setSelected(emp)}
                className={`card cursor-pointer transition-all ${selected?._id === emp._id ? 'border-cosmetica-400 border-2' : 'hover:shadow-md'} ${!emp.actif ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${DEPT_COLORS[emp.departement] || 'bg-gray-100 text-gray-600'}`}>
                    {emp.prenom?.[0]}{emp.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-semibold text-gray-900 text-sm">{emp.prenom} {emp.nom}</p>
                      {!emp.actif && <span className="badge-red text-xs">Parti·e</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{emp.poste}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${DEPT_COLORS[emp.departement] || 'bg-gray-100 text-gray-600'}`}>{emp.departement}</span>
                      {emp.turnoverRisk && emp.actif && (
                        <span className={`flex items-center gap-1 text-xs ${risk.class}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                          Risque {risk.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <EmployeeDetail employee={selected} />
          ) : (
            <div className="card h-full flex items-center justify-center text-center p-12">
              <div>
                <div className="text-5xl mb-4">👥</div>
                <p className="text-gray-500">Sélectionnez un·e salarié·e pour voir son profil complet</p>
                <p className="text-xs text-gray-400 mt-2">Analysez les données RH pour vos missions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmployeeDetail({ employee: e }) {
  const risk = RISK_CONFIG[e.turnoverRisk] || RISK_CONFIG.faible;
  const tauxAbsence = e.absences?.length > 0
    ? ((e.absences.reduce((acc, a) => acc + (a.dureeJours || 0), 0) / 228) * 100).toFixed(1)
    : 0;

  return (
    <div className="card fade-in-up">
      {/* Header salarié */}
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${DEPT_COLORS[e.departement] || 'bg-gray-100 text-gray-600'}`}>
          {e.prenom?.[0]}{e.nom?.[0]}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-gray-900">{e.prenom} {e.nom}</h2>
            <span className="text-gray-400">·</span>
            <span className="text-sm font-mono text-gray-400">{e.matricule}</span>
            {!e.actif && <span className="badge-red">Parti·e ({e.motifSortie?.replace('_', ' ')})</span>}
          </div>
          <p className="text-gray-600 font-medium">{e.poste}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${DEPT_COLORS[e.departement]}`}>{e.departement}</span>
            <span className="badge-blue">{e.contrat}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{e.anciennete} an{e.anciennete > 1 ? 's' : ''} d'ancienneté</span>
          </div>
        </div>
        {e.turnoverRisk && e.actif && (
          <div className={`text-right flex-shrink-0`}>
            <p className="text-xs text-gray-400 mb-1">Risque départ</p>
            <span className={`font-bold text-sm ${e.turnoverRisk === 'élevé' ? 'text-red-600' : e.turnoverRisk === 'moyen' ? 'text-orange-500' : 'text-green-600'}`}>
              {risk.label}
            </span>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{e.salaireBase?.toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-gray-500">Salaire brut/mois</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{e.engagement || '—'}/100</p>
          <p className="text-xs text-gray-500">Engagement</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className={`text-xl font-bold ${tauxAbsence > 7 ? 'text-red-600' : tauxAbsence > 4 ? 'text-orange-500' : 'text-green-600'}`}>{tauxAbsence}%</p>
          <p className="text-xs text-gray-500">Taux absentéisme</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-gray-900">{e.evaluationsAnnuelles?.slice(-1)[0]?.score || '—'}/5</p>
          <p className="text-xs text-gray-500">Dernier EAD</p>
        </div>
      </div>

      {/* Biographie */}
      {e.biographie && (
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wide text-gray-500">Biographie RH</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{e.biographie}</p>
        </div>
      )}

      {/* Points forts / vigilance */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {e.pointsForts?.length > 0 && (
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs font-bold text-green-700 mb-2">✅ Points forts</p>
            <ul className="space-y-1">
              {e.pointsForts.map((p, i) => <li key={i} className="text-xs text-green-700">• {p}</li>)}
            </ul>
          </div>
        )}
        {e.pointsVigilance?.length > 0 && (
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-xs font-bold text-orange-700 mb-2">⚠️ Points de vigilance</p>
            <ul className="space-y-1">
              {e.pointsVigilance.map((p, i) => <li key={i} className="text-xs text-orange-700">• {p}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Anecdote RH */}
      {e.anecdoteRH && (
        <div className="bg-cosmetica-50 border border-cosmetica-200 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-cosmetica-700 mb-1">💡 Note RH confidentielle</p>
          <p className="text-sm text-cosmetica-800 italic">{e.anecdoteRH}</p>
        </div>
      )}

      {/* Absences */}
      {e.absences?.length > 0 && (
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 mb-2 text-sm">📅 Historique des absences</h3>
          <div className="space-y-1">
            {e.absences.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-500">{a.date ? new Date(a.date).toLocaleDateString('fr-FR') : '—'}</span>
                <span className={`font-medium ${a.motif === 'AT' ? 'text-red-600' : a.motif === 'sans_motif' ? 'text-red-500' : 'text-gray-700'}`}>{a.motif?.replace('_', ' ')}</span>
                <span className="text-gray-600">{a.dureeJours} jour{a.dureeJours > 1 ? 's' : ''}</span>
                <span className={a.justifie ? 'text-green-600' : 'text-red-500'}>{a.justifie ? 'Justifiée' : 'Non justifiée'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formations */}
      {e.formations?.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-2 text-sm">🎓 Formations suivies</h3>
          <div className="space-y-1">
            {e.formations.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-blue-50 rounded-lg px-3 py-2">
                <span className="font-medium text-blue-800">{f.titre}</span>
                <span className="text-blue-500">{f.dureeHeures}h · {f.cout?.toLocaleString('fr-FR')}€</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
