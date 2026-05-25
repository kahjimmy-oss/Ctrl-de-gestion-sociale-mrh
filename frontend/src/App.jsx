import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSocket } from './hooks/useSocket';

import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import MissionPage from './pages/MissionPage';
import QuizPage from './pages/QuizPage';
import EvaluationPage from './pages/EvaluationPage';
import InstructorDashboard from './pages/InstructorDashboard';
import InstructorSubmissionsPage from './pages/InstructorSubmissionsPage';
import InstructorEvaluationsPage from './pages/InstructorEvaluationsPage';
import EmployeesPage from './pages/EmployeesPage';
import Navbar from './components/common/Navbar';
import NotesPanel from './components/common/NotesPanel';

function SocketProvider({ children }) {
  const { user } = useAuth();
  useSocket(user);
  return children;
}

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-cosmetica-400 border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'instructor' ? '/instructor' : '/dashboard'} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      {user && <NotesPanel />}
      <div className={user ? 'pt-16' : ''}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to={user.role === 'instructor' ? '/instructor' : '/dashboard'} replace /> : <LoginPage />} />

          <Route path="/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/missions/:id" element={<ProtectedRoute role="student"><MissionPage /></ProtectedRoute>} />
          <Route path="/quiz/:missionId" element={<ProtectedRoute role="student"><QuizPage /></ProtectedRoute>} />
          <Route path="/evaluation/:seance" element={<ProtectedRoute role="student"><EvaluationPage /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />

          <Route path="/instructor" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/submissions" element={<ProtectedRoute role="instructor"><InstructorSubmissionsPage /></ProtectedRoute>} />
          <Route path="/instructor/evaluations" element={<ProtectedRoute role="instructor"><InstructorEvaluationsPage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to={user ? (user.role === 'instructor' ? '/instructor' : '/dashboard') : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }
          }}
        />
      </SocketProvider>
    </AuthProvider>
  );
}
