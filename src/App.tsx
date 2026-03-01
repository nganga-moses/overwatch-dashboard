import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth-context';
import LoginView from './views/LoginView';
import Layout from './components/Layout';
import CustomersView from './views/CustomersView';
import DashboardUsersView from './views/DashboardUsersView';
import OperatorsView from './views/OperatorsView';
import WorkstationsView from './views/WorkstationsView';

function AppRoutes() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ow-bg">
        <div className="w-6 h-6 border-2 border-ow-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <LoginView />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/customers" element={<CustomersView />} />
        <Route path="/dashboard-users" element={<DashboardUsersView />} />
        <Route path="/operators" element={<OperatorsView />} />
        <Route path="/workstations" element={<WorkstationsView />} />
        <Route path="*" element={<Navigate to="/operators" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
