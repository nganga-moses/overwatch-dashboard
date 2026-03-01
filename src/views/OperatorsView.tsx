import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
import { Plus, Users, Pencil, Trash2 } from 'lucide-react';

interface Operator {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export default function OperatorsView() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', role: 'operator', pin: '' });
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setOperators(await apiGet('/auth/operators'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ name: '', role: 'operator', pin: '' });
    setShowForm(true);
    setError('');
  }

  function openEdit(op: Operator) {
    setEditId(op.id);
    setForm({ name: op.name, role: op.role, pin: '' });
    setShowForm(true);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        const body: Record<string, unknown> = { name: form.name, role: form.role };
        if (form.pin) body.pin = form.pin;
        await apiPatch(`/auth/operators/${editId}`, body);
      } else {
        await apiPost('/auth/operators', form);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm('Deactivate this operator?')) return;
    await apiDelete(`/auth/operators/${id}`);
    load();
  }

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-ow-warning/20 text-ow-warning',
      operator: 'bg-ow-accent-bg text-ow-accent',
      viewer: 'bg-ow-surface-3 text-ow-text-muted',
    };
    return colors[role] ?? colors.operator;
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-ow-accent" />
          Operators
        </h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 px-3 py-1.5 bg-ow-accent text-ow-bg rounded text-sm font-medium hover:bg-ow-accent-dim transition"
        >
          <Plus className="w-4 h-4" />
          Add Operator
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ow-surface border border-ow-border rounded-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">{editId ? 'Edit Operator' : 'New Operator'}</h2>
            {error && <p className="text-ow-danger text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                />
              </div>
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                >
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-ow-text-muted block mb-1">
                  {editId ? 'PIN (leave blank to keep current)' : 'PIN (6 digits)'}
                </label>
                <input
                  type="password"
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value })}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required={!editId}
                  placeholder="••••••"
                  className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent tracking-widest"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-sm text-ow-text-muted">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-ow-accent text-ow-bg text-sm font-medium rounded hover:bg-ow-accent-dim transition">
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ow-text-muted text-sm">Loading…</p>
      ) : operators.length === 0 ? (
        <p className="text-ow-text-dim text-sm">No operators yet</p>
      ) : (
        <div className="border border-ow-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ow-surface-2 text-left text-ow-text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ow-border">
              {operators.map((op) => (
                <tr key={op.id} className="hover:bg-ow-surface-2/50 transition">
                  <td className="px-4 py-3">{op.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${roleBadge(op.role)}`}>{op.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${op.is_active ? 'bg-ow-safe/20 text-ow-safe' : 'bg-ow-danger/20 text-ow-danger'}`}>
                      {op.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ow-text-muted">{new Date(op.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => openEdit(op)} className="p-1 text-ow-text-muted hover:text-ow-text"><Pencil className="w-4 h-4" /></button>
                    {op.is_active && (
                      <button onClick={() => handleDeactivate(op.id)} className="p-1 text-ow-text-muted hover:text-ow-danger"><Trash2 className="w-4 h-4" /></button>
                    )}
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
