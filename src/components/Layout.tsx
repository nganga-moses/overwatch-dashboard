import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';
import { Building2, LogOut, Monitor, Shield, Users, UserCog } from 'lucide-react';

export default function Layout() {
  const { profile, signOut, user } = useAuth();
  const isPlatformAdmin = profile?.role === 'platform_admin';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
      isActive
        ? 'bg-ow-accent-bg text-ow-accent'
        : 'text-ow-text-muted hover:text-ow-text hover:bg-ow-surface-2'
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-ow-surface border-r border-ow-border flex flex-col">
        <div className="p-4 border-b border-ow-border flex items-center gap-2">
          <Shield className="w-5 h-5 text-ow-accent" />
          <span className="font-semibold text-sm">Overwatch</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {isPlatformAdmin && (
            <>
              <NavLink to="/customers" className={linkClass}>
                <Building2 className="w-4 h-4" />
                Customers
              </NavLink>
              <NavLink to="/dashboard-users" className={linkClass}>
                <UserCog className="w-4 h-4" />
                Dashboard Users
              </NavLink>
            </>
          )}
          <NavLink to="/operators" className={linkClass}>
            <Users className="w-4 h-4" />
            Operators
          </NavLink>
          <NavLink to="/workstations" className={linkClass}>
            <Monitor className="w-4 h-4" />
            Workstations
          </NavLink>
        </nav>

        <div className="p-3 border-t border-ow-border">
          <div className="text-xs text-ow-text-dim mb-2 truncate">{user?.email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-ow-text-muted hover:text-ow-danger transition w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
