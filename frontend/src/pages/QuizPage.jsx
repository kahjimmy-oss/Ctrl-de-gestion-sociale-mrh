import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    questionsAPI.getBySeance(1, 'cours')
      .then(res => setQuestions(res.data.data || []))
      .catch(() => toast.error('Erreur.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="btn-secondary mb-6 text-sm">← Retour</button>
      <h1 className="text-2xl font-black mb-6">Questions de cours</h1>
      <p className="text-gray-500">Cette page sera disponible après intégration avec le moteur de progression.</p>
    </div>
  );
}
