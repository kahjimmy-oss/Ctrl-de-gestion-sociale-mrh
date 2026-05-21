import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionsAPI, submissionsAPI, questionsAPI } from '../services/api';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

const PHASE = { QUIZ: 'quiz', MISSION: 'mission', SUBMITTED: 'submitted' };

export default function MissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [question, setQuestion] = useState(null);
  const [phase, setPhase] = useState(PHASE.QUIZ);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadMission(); }, [id]);

  const loadMission = async () => {
    try {
      const res = await missionsAPI.getById(id);
      const m = res.data.data;
      setMission(m);

      if (m.questionPrealableId) {
        try {
          const qRes = await questionsAPI.getVariation(m.questionPrealableId._id || m.questionPrealableId);
          if (qRes.data.alreadyAnswered) {
            setPhase(PHASE.MISSION);
          } else {
            setQuestion(qRes.data.data);
            setPhase(PHASE.QUIZ);
          }
        } catch {
          setPhase(PHASE.MISSION);
        }
      } else {
        setPhase(PHASE.MISSION);
      }

      const subRes = await submissionsAPI.getByMission(id);
      if (subRes.data.data) {
        setSubmission(subRes.data.data);
        if (subRes.data.data.status === 'soumise' || subRes.data.data.status === 'approuvee') {
          setPhase(PHASE.SUBMITTED);
        } else {
          setPhase(PHASE.MISSION);
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Mission verrouillée.');
        navigate('/dashboard');
      } else {
        toast.error('Erreur de chargement.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onQuizAnswered = (correct) => {
    if (correct || mission?.type === 'individuel') {
      setPhase(PHASE.MISSION);
    }
  };

  const getOrCreateSubmission = async () => {
    if (submission) return submission;
    const res = await submissionsAPI.create({ missionId: id });
    setSubmission(res.data.data);
    return res.data.data;
  };

  const handleFileUpload = async (deliverableId, acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setUploading(p => ({ ...p, [deliverableId]: true }));
    try {
      const sub = await getOrCreateSubmission();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('deliverableId', deliverableId);
      const res = await submissionsAPI.upload(sub._id, formData);
      setSubmission(res.data.data.submission);
      toast.success(`${file.name} déposé avec succès.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur upload.');
    } finally {
      setUploading(p => ({ ...p, [deliverableId]: false }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const sub = await getOrCreateSubmission();
      const res = await submissionsAPI.submit(sub._id);
      setSubmission(res.data.data);
      setPhase(PHASE.SUBMITTED);
      toast.success('Livrables soumis ! Votre formateur a été alerté. ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" />
    </div>
  );

  if (!mission) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
          ← Retour au tableau de bord
        </button>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-cosmetica-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            {mission.type === 'collectif' ? '👥' : '👤'}
          </div>
          <div>
            <span className="badge-blue text-xs mb-1 inline-block">Séance {mission.seance} — Mission {mission.ordre}</span>
            <h1 className="text-2xl font-black text-gray-900">{mission.titre}</h1>
            <p className="text-gray-500 mt-0.5">{mission.sousTitre}</p>
          </div>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="flex items-center gap-2 mb-6">
        {['Question de déverrouillage', 'Mission', 'Soumission'].map((label, i) => {
          const phases = [PHASE.QUIZ, PHASE.MISSION, PHASE.SUBMITTED];
          const isActive = phase === phases[i];
          const isDone = (phase === PHASE.MISSION && i === 0) || (phase === PHASE.SUBMITTED && i <= 1);
          return (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                isDone ? 'bg-green-100 text-green-700' :
                isActive ? 'bg-cosmetica-100 text-cosmetica-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {isDone ? '✓' : i + 1} {label}
              </div>
              {i < 2 && <div className={`w-6 h-px ${isDone ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* PHASE: Quiz */}
      {phase === PHASE.QUIZ && question && (
        <QuizPhase question={question} onAnswered={onQuizAnswered} missionId={mission.questionPrealableId?._id || mission.questionPrealableId} />
      )}

      {/* PHASE: Mission active */}
      {(phase === PHASE.MISSION || phase === PHASE.SUBMITTED) && (
        <div className="space-y-6">
          {/* Contexte narratif */}
          <div className="card border-l-4 border-cosmetica-400">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              📖 Contexte de la mission
            </h2>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {mission.contexteNarratif}
            </div>
          </div>

          {/* Objectifs */}
          {mission.objectifsPedagogiques?.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-3">🎯 Objectifs pédagogiques</h2>
              <ul className="space-y-2">
                {mission.objectifsPedagogiques.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-cosmetica-500 mt-0.5 flex-shrink-0">→</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Données fournies */}
          {mission.donneesFournies && Object.keys(mission.donneesFournies).length > 0 && (
            <div className="card bg-blue-50 border border-blue-100">
              <h2 className="font-bold text-blue-900 mb-3">📋 Données fournies par Sophie Martin (RRH)</h2>
              <div className="overflow-x-auto">
                <pre className="text-xs text-blue-800 whitespace-pre-wrap font-mono">
                  {JSON.stringify(mission.donneesFournies, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Livrables */}
          {mission.deliverables?.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">📤 Livrables à déposer</h2>
              <div className="space-y-4">
                {mission.deliverables.map(del => {
                  const uploadedFile = submission?.fichiers?.find(f => f.deliverableId === del.id);
                  return (
                    <DeliverableUpload
                      key={del.id}
                      deliverable={del}
                      uploadedFile={uploadedFile}
                      uploading={uploading[del.id]}
                      submissionStatus={submission?.status}
                      onUpload={(files) => handleFileUpload(del.id, files)}
                    />
                  );
                })}
              </div>

              {phase === PHASE.MISSION && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-3">
                    Déposez tous les livrables obligatoires avant de soumettre. Votre formateur sera alerté immédiatement.
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-primary"
                  >
                    {submitting ? 'Soumission en cours...' : '✅ Soumettre mes livrables'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Submitted state */}
          {phase === PHASE.SUBMITTED && (
            <SubmittedStatus submission={submission} onReload={loadMission} />
          )}
        </div>
      )}
    </div>
  );
}

function QuizPhase({ question, onAnswered, missionId }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExplication, setShowExplication] = useState(false);

  const handleAnswer = async () => {
    if (!selected && question.type !== 'ouverte') return;
    setLoading(true);
    try {
      const res = await questionsAPI.answer(missionId, {
        reponse: selected,
        variationIndex: 0
      });
      setResult(res.data.data);
    } catch (err) {
      toast.error('Erreur lors de la réponse.');
    } finally {
      setLoading(false);
    }
  };

  if (!question) return null;

  const { variation } = question;

  return (
    <div className="card border-2 border-cosmetica-200 fade-in-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-cosmetica-100 rounded-lg flex items-center justify-center text-cosmetica-600 font-bold text-sm">?</div>
        <div>
          <p className="text-xs text-cosmetica-600 font-semibold uppercase tracking-wide">Question de déverrouillage</p>
          <p className="text-xs text-gray-500">{question.sujet}</p>
        </div>
      </div>

      {question.contexte && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
          {question.contexte}
        </div>
      )}

      <h3 className="font-bold text-gray-900 mb-2">{question.enonce}</h3>
      <p className="text-gray-800 mb-5 font-medium">{variation?.texte}</p>

      {variation?.options?.length > 0 && (
        <div className="space-y-2 mb-5">
          {variation.options.map(opt => (
            <button
              key={opt.id}
              disabled={!!result}
              onClick={() => !result && setSelected(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                result
                  ? opt.id === selected
                    ? result.correct ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800'
                    : 'border-gray-100 bg-gray-50 text-gray-400'
                  : selected === opt.id
                  ? 'border-cosmetica-400 bg-cosmetica-50 text-cosmetica-800'
                  : 'border-gray-200 bg-white hover:border-cosmetica-200 text-gray-700'
              }`}
            >
              {opt.texte}
            </button>
          ))}
        </div>
      )}

      {result ? (
        <div className={`p-4 rounded-xl mb-4 ${result.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-bold mb-2 ${result.correct ? 'text-green-800' : 'text-red-800'}`}>
            {result.correct ? '✅ Bonne réponse !' : '❌ Pas tout à fait...'}
          </p>
          <p className="text-sm text-gray-700">{result.feedback}</p>
          {result.explicationComplete && (
            <button onClick={() => setShowExplication(p => !p)} className="text-xs text-cosmetica-600 mt-2 underline">
              {showExplication ? 'Masquer' : 'Voir'} l'explication complète
            </button>
          )}
          {showExplication && result.explicationComplete && (
            <div className="mt-2 p-3 bg-white rounded-lg border text-xs text-gray-600">
              {result.explicationComplete}
            </div>
          )}
          {result.correct && (
            <button onClick={() => onAnswered(true)} className="btn-primary mt-3 text-sm">
              Accéder à la mission →
            </button>
          )}
          {!result.correct && (
            <button onClick={() => { setResult(null); setSelected(null); }} className="btn-secondary mt-3 text-sm">
              Réessayer
            </button>
          )}
        </div>
      ) : (
        <button onClick={handleAnswer} disabled={!selected || loading} className="btn-primary">
          {loading ? 'Analyse...' : 'Valider ma réponse'}
        </button>
      )}
    </div>
  );
}

function DeliverableUpload({ deliverable, uploadedFile, uploading, submissionStatus, onUpload }) {
  const isReadOnly = submissionStatus === 'soumise' || submissionStatus === 'approuvee';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: isReadOnly ? null : onUpload,
    disabled: isReadOnly,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/csv': ['.csv'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  return (
    <div className={`border-2 rounded-xl p-4 ${uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900 text-sm">{deliverable.nom}</h4>
            {deliverable.obligatoire ? (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Obligatoire</span>
            ) : (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Optionnel</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{deliverable.description}</p>
        </div>
        {uploadedFile && <span className="text-green-500 text-xl flex-shrink-0">✓</span>}
      </div>

      {deliverable.instructions && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3">
          <p className="text-xs text-blue-700"><span className="font-semibold">Instructions : </span>{deliverable.instructions}</p>
        </div>
      )}

      {uploadedFile ? (
        <div className="flex items-center gap-2 text-sm text-green-700">
          <span>📎</span>
          <span className="font-medium">{uploadedFile.nomFichier}</span>
          <span className="text-gray-400 text-xs">({(uploadedFile.taille / 1024).toFixed(0)} ko)</span>
          {!isReadOnly && (
            <button {...getRootProps()} className="text-xs text-cosmetica-500 underline ml-2">Remplacer</button>
          )}
        </div>
      ) : (
        !isReadOnly && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-cosmetica-400 bg-cosmetica-50' : 'border-gray-300 hover:border-cosmetica-300'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-cosmetica-400 border-t-transparent rounded-full animate-spin" />
                Upload en cours...
              </div>
            ) : (
              <>
                <div className="text-2xl mb-1">📤</div>
                <p className="text-sm text-gray-600 font-medium">Glissez votre fichier ici</p>
                <p className="text-xs text-gray-400">ou cliquez pour sélectionner (PDF, DOCX, XLSX, PPTX...)</p>
              </>
            )}
          </div>
        )
      )}
    </div>
  );
}

function SubmittedStatus({ submission, onReload }) {
  const statusConfig = {
    soumise: { color: 'bg-amber-50 border-amber-200', title: '⏳ En attente de validation', text: 'Votre formateur a été alerté et va examiner vos livrables.' },
    en_revision: { color: 'bg-blue-50 border-blue-200', title: '🔍 En cours de révision', text: 'Votre formateur examine vos livrables.' },
    approuvee: { color: 'bg-green-50 border-green-200', title: '✅ Validé !', text: 'Bravo ! Vos livrables ont été validés. La prochaine mission est débloquée.' },
    approuvee_partielle: { color: 'bg-green-50 border-green-200', title: '✅ Partiellement validé', text: 'Voir le retour de votre formateur.' },
    a_retravailler: { color: 'bg-red-50 border-red-200', title: '⚠️ À retravailler', text: 'Votre formateur a des retours à vous partager.' }
  };

  const config = statusConfig[submission?.status] || statusConfig.soumise;

  return (
    <div className={`card border-2 ${config.color}`}>
      <h3 className="font-bold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-600">{config.text}</p>
      {submission?.feedbackFormateur && (
        <div className="mt-3 p-3 bg-white rounded-xl border">
          <p className="text-xs font-semibold text-gray-500 mb-1">Retour du formateur :</p>
          <p className="text-sm text-gray-800">{submission.feedbackFormateur}</p>
        </div>
      )}
      <button onClick={onReload} className="btn-secondary text-sm mt-3">
        🔄 Actualiser le statut
      </button>
    </div>
  );
}
