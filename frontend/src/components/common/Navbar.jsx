import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    const handler = () => setAlerts(prev => prev + 1);
    window.addEventListener('submission:received', handler);
    return () => window.removeEventListener('submission:received', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (path) => location.pathname.startsWith(path);

  const studentLinks = [
    { to: '/dashboard', label: 'Mission' },
    { to: '/employees', label: 'Équipe COSMETICA™' }
  ];

  const instructorLinks = [
    { to: '/instructor', label: 'Tableau de bord' },
    { to: '/instructor/submissions', label: 'Livrables' },
    { to: '/instructor/evaluations', label: 'Évaluations' },
    { to: '/employees', label: 'Salariés fictifs' }
  ];

  const links = user?.role === 'instructor' ? instructorLinks : studentLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cosmetica-500 to-cosmetica-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">COSMETICA™</span>
              <span className="text-gray-400 text-sm hidden sm:block">RH Game</span>
            </Link>

            <div className="flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-cosmetica-50 text-cosmetica-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {link.to === '/instructor/submissions' && alerts > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                      {alerts}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.prenom} {user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'instructor' ? '👩‍🏫 Formateur·trice' : `🎓 ${user?.groupe}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
