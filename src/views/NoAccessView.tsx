import { useAuth } from '../contexts/AuthContext';
import { ShieldOff } from 'lucide-react';

export default function NoAccessView() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-ow-bg">
      <div className="w-full max-w-sm text-center space-y-6">
        <img src="/logo-white.png" alt="Overwatch" className="w-48 mx-auto" />

        <div className="bg-ow-surface rounded-lg border border-ow-border p-6 space-y-4">
          <ShieldOff className="w-10 h-10 text-ow-warning mx-auto" />
          <h2 className="text-lg font-semibold text-ow-text">Access Pending</h2>
          <p className="text-sm text-ow-text-muted">
            Your account <span className="text-ow-text">{user?.email}</span> has been created
            but does not have access to the dashboard yet.
          </p>
          <p className="text-xs text-ow-text-dim">
            Contact your platform administrator to be granted access.
          </p>
          <button
            onClick={signOut}
            className="w-full py-2 px-4 bg-ow-surface-2 border border-ow-border text-ow-text-muted font-medium rounded hover:bg-ow-surface-3 transition text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
