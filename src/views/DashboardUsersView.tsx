import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../lib/api';
import { Plus, UserCog } from 'lucide-react';

interface DashboardUser {
  id: string;
  customer_id: string | null;
  supabase_uid: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface Customer {
  id: string;
  name: string;
}

export default function DashboardUsersView() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ supabase_uid: '', email: '', customer_id: '', role: 'customer_admin' });
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const [u, c] = await Promise.all([
        apiGet<DashboardUser[]>('/admin/dashboard-users'),
        apiGet<Customer[]>('/admin/customers'),
      ]);
      setUsers(u);
      setCustomers(c);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiPost('/admin/dashboard-users', {
        ...form,
        customer_id: form.customer_id || null,
      });
      setShowCreate(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function customerName(id: string | null) {
    if (!id) return '—';
    return customers.find((c) => c.id === id)?.name ?? id.slice(0, 8);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <UserCog className="w-5 h-5 text-ow-accent" />
          Dashboard Users
        </h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-ow-accent text-ow-bg rounded text-sm font-medium hover:bg-ow-accent-dim transition"
        >
          <Plus className="w-4 h-4" />
          Link User
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ow-surface border border-ow-border rounded-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Link Supabase User</h2>
            {error && <p className="text-ow-danger text-sm">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Supabase UID</label>
                <input
                  value={form.supabase_uid}
                  onChange={(e) => setForm({ ...form, supabase_uid: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                />
              </div>
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                />
              </div>
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Customer</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                >
                  <option value="">None (platform admin)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                >
                  <option value="customer_admin">Customer Admin</option>
                  <option value="platform_admin">Platform Admin</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-ow-text-muted">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-ow-accent text-ow-bg text-sm font-medium rounded hover:bg-ow-accent-dim transition">Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ow-text-muted text-sm">Loading…</p>
      ) : (
        <div className="border border-ow-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ow-surface-2 text-left text-ow-text-muted">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ow-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-ow-surface-2/50 transition">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${u.role === 'platform_admin' ? 'bg-ow-info/20 text-ow-info' : 'bg-ow-accent-bg text-ow-accent'}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ow-text-muted">{customerName(u.customer_id)}</td>
                  <td className="px-4 py-3">
                    <span className={`w-2 h-2 rounded-full inline-block ${u.is_active ? 'bg-ow-safe' : 'bg-ow-danger'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
