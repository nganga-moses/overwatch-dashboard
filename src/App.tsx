import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginView from './views/LoginView';
import Layout from './components/Layout';
import CustomersView from './views/CustomersView';
import DashboardUsersView from './views/DashboardUsersView';
import OperatorsView from './views/OperatorsView';
import WorkstationsView from './views/WorkstationsView';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ow-bg">
        <Loader2 className="w-8 h-8 animate-spin text-ow-accent" />
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return <>{children}</>;
}

function AppRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ow-bg">
        <Loader2 className="w-8 h-8 animate-spin text-ow-accent" />
      </div>
    );
  }

  if (user && window.location.pathname === '/login') {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/customers" element={<CustomersView />} />
        <Route path="/dashboard-users" element={<DashboardUsersView />} />
        <Route path="/operators" element={<OperatorsView />} />
        <Route path="/workstations" element={<WorkstationsView />} />
        <Route path="/" element={<Navigate to="/operators" replace />} />
        <Route path="*" element={<Navigate to="/operators" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
