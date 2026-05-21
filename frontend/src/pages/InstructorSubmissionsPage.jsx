import { useState, useEffect } from 'react';
import { instructorAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  brouillon: { label: 'Brouillon', color: 'badge-blue' },
  soumise: { label: '⏳ À valider', color: 'bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full' },
  en_revision: { label: 'En révision', color: 'badge-orange' },
  approuvee: { label: '✅ Approuvée', color: 'badge-green' },
  approuvee_partielle: { label: '✅ Partielle', color: 'badge-green' },
  a_retravailler: { label: '⚠️ À retravailler', color: 'badge-red' }
};

export default function InstructorSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('soumise');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [form, setForm] = useState({ status: 'approuvee', feedbackFormateur: '', scoreQualite: 80 });

  useEffect(() => { loadSubmissions(); }, [filter]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await instructorAPI.getSubmissions(filter ? { status: filter } : {});
      setSubmissions(res.data.data || []);
    } catch {
      toast.error('Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!selected || !form.feedbackFormateur.trim()) {
      toast.error('Rédigez un retour pour l\'étudiante avant de valider.');
      return;
    }
    setValidating(true);
    try {
      await instructorAPI.validateSubmission(selected._id, form);
      toast.success('Livrable validé ! L\'étudiante a été notifiée.');
      setSelected(null);
      loadSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">📋 Validation des livrables</h1>
        <p className="text-gray-500">Examinez, annotez et validez les dépôts de vos étudiantes</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'soumise', label: '⏳ À valider' },
          { value: 'approuvee', label: '✅ Approuvées' },
          { value: 'a_retravailler', label: '⚠️ À retravailler' },
          { value: '', label: '🔎 Toutes' }
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              filter === f.value ? 'bg-cosmetica-600 text-white border-cosmetica-600' : 'border-gray-200 text-gray-600 hover:border-cosmetica-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement...</div>
          ) : submissions.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">✅</p>
              <p>Aucun livrable dans cette catégorie</p>
            </div>
          ) : (
            submissions.map(sub => {
              const sc = STATUS_LABELS[sub.status] || STATUS_LABELS.brouillon;
              return (
                <div
                  key={sub._id}
                  onClick={() => { setSelected(sub); setForm({ status: 'approuvee', feedbackFormateur: '', scoreQualite: 80 }); }}
                  className={`card cursor-pointer transition-all ${selected?._id === sub._id ? 'border-2 border-cosmetica-400' : 'hover:shadow-md'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cosmetica-100 rounded-xl flex items-center justify-center font-bold text-cosmetica-700 flex-shrink-0">
                      {sub.etudiantId?.prenom?.[0]}{sub.etudiantId?.name?.[0] || sub.etudiantId?.nom?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 text-sm">{sub.etudiantId?.prenom} {sub.etudiantId?.name}</p>
                        <span className={sc.color}>{sc.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{sub.missionId?.titre} — Séance {sub.missionId?.seance}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>📎 {sub.fichiers?.length || 0} fichier(s)</span>
                        {sub.soumisLe && <span>Soumis {new Date(sub.soumisLe).toLocaleDateString('fr-FR')}</span>}
                        {sub.tentative > 1 && <span className="badge-orange">Tentative {sub.tentative}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panneau de validation */}
        <div>
          {selected ? (
            <div className="card space-y-5">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Validation — {selected.etudiantId?.prenom} {selected.etudiantId?.name}</h2>
                <p className="text-sm text-gray-500">{selected.missionId?.titre}</p>
              </div>

              {/* Fichiers */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">📎 Fichiers déposés</h3>
                {selected.fichiers?.map((f, i) => (
                  <a
                    key={i}
                    href={f.urlFichier}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-cosmetica-600"
                  >
                    <span>📄</span>
                    <span className="underline">{f.nomFichier}</span>
                    <span className="text-gray-400 text-xs">({(f.taille / 1024).toFixed(0)} ko)</span>
                  </a>
                ))}
              </div>

              {/* Grille deliverables */}
              {selected.missionId?.deliverables?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">📋 Critères d'évaluation</h3>
                  {selected.missionId.deliverables.map(del => {
                    const file = selected.fichiers?.find(f => f.deliverableId === del.id);
                    return (
                      <div key={del.id} className={`p-2 rounded-lg mb-1 text-xs ${file ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center gap-2">
                          <span>{file ? '✅' : '❌'}</span>
                          <span className="font-medium">{del.nom}</span>
                          {del.obligatoire && <span className="badge-red text-xs">Obligatoire</span>}
                        </div>
                        {del.critereEvaluation && <p className="text-gray-500 mt-0.5 ml-6">{del.critereEvaluation}</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formulaire validation */}
              {selected.status === 'soumise' || selected.status === 'en_revision' ? (
                <>
                  <div>
                    <label className="label">Décision</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'approuvee', label: '✅ Approuvé', color: 'border-green-400 bg-green-50 text-green-700' },
                        { value: 'approuvee_partielle', label: '⚡ Partiel', color: 'border-amber-400 bg-amber-50 text-amber-700' },
                        { value: 'a_retravailler', label: '⚠️ À retravailler', color: 'border-red-400 bg-red-50 text-red-700' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setForm(p => ({ ...p, status: opt.value }))}
                          className={`flex-1 py-2 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                            form.status === opt.value ? opt.color : 'border-gray-200 text-gray-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Score qualité (0-100)</label>
                    <input
                      type="number"
                      min="0" max="100"
                      className="input"
                      value={form.scoreQualite}
                      onChange={e => setForm(p => ({ ...p, scoreQualite: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="label">Retour personnalisé pour l'étudiante *</label>
                    <textarea
                      className="input min-h-[120px] resize-y text-sm"
                      placeholder={`Bonjour ${selected.etudiantId?.prenom},\n\nVotre travail sur ${selected.missionId?.titre}...\n\nPoints forts :\nPoints à améliorer :\n\nVotre formateur·trice`}
                      value={form.feedbackFormateur}
                      onChange={e => setForm(p => ({ ...p, feedbackFormateur: e.target.value }))}
                    />
                  </div>

                  <button
                    onClick={handleValidate}
                    disabled={validating || !form.feedbackFormateur.trim()}
                    className="btn-primary w-full"
                  >
                    {validating ? 'Validation en cours...' : '✅ Valider & notifier l\'étudiante'}
                  </button>
                </>
              ) : (
                <div className={`p-4 rounded-xl ${STATUS_LABELS[selected.status]?.color?.includes('green') ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <p className="text-sm font-medium text-gray-700 mb-1">Décision : {STATUS_LABELS[selected.status]?.label}</p>
                  {selected.feedbackFormateur && <p className="text-sm text-gray-600">{selected.feedbackFormateur}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="card h-full flex items-center justify-center text-center p-12">
              <div className="text-gray-400">
                <p className="text-4xl mb-3">📋</p>
                <p className="font-medium">Sélectionnez un livrable à valider</p>
                <p className="text-sm mt-1">Vous pourrez l'annoter et notifier l'étudiante</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
