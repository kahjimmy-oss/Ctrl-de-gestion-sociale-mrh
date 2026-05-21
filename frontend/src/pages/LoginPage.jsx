import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Bienvenue ${user.prenom} ! 🎮`);
      navigate(user.role === 'instructor' ? '/instructor' : '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmetica-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cosmetica-500 to-cosmetica-700 rounded-3xl shadow-xl mb-4">
            <span className="text-white text-3xl font-black">C</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">COSMETICA™</h1>
          <p className="text-cosmetica-600 font-semibold mt-1">RH Game — Master 1</p>
          <p className="text-gray-500 text-sm mt-2">Contrôle de Gestion Sociale Appliquée</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Connexion à votre espace</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email"
                className="input"
                placeholder="votre.email@etudiant.fr"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-center mt-6">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : 'Accéder au jeu →'}
            </button>
          </form>
        </div>

        {/* Context */}
        <div className="mt-6 p-4 bg-cosmetica-50 rounded-2xl border border-cosmetica-100">
          <p className="text-xs text-cosmetica-800 text-center font-medium">
            🎓 Master RH 1ère année · 4 séances · 3h30 chacune
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            Identifiants fournis par votre formateur·trice
          </p>
        </div>
      </div>
    </div>
  );
}
