import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Plus, Building2, Copy, Check } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  subscription_tier: string;
  max_kits: number;
  created_at: string;
}

export default function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', subscription_tier: 'starter', max_kits: 5 });
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setCustomers(await apiClient.get('/admin/customers'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const result = await apiClient.post<{ customer_id: string; name: string; api_key: string }>(
        '/admin/customers',
        form,
      );
      setCreatedKey(result.api_key);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function copyKey() {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5 text-ow-accent" />
          Customers
        </h1>
        <button
          onClick={() => { setShowCreate(true); setCreatedKey(null); }}
          className="flex items-center gap-1 px-3 py-1.5 bg-ow-accent text-ow-bg rounded text-sm font-medium hover:bg-ow-accent-dim transition"
        >
          <Plus className="w-4 h-4" />
          New Customer
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ow-surface border border-ow-border rounded-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Create Customer</h2>
            {error && <p className="text-ow-danger text-sm">{error}</p>}

            {createdKey ? (
              <div className="space-y-3">
                <p className="text-sm text-ow-text-muted">
                  Customer created. Copy the API key now — it won't be shown again.
                </p>
                <div className="flex items-center gap-2 bg-ow-surface-2 border border-ow-border rounded p-3">
                  <code className="text-xs flex-1 break-all text-ow-accent">{createdKey}</code>
                  <button onClick={copyKey} className="text-ow-text-muted hover:text-ow-text">
                    {copied ? <Check className="w-4 h-4 text-ow-safe" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => { setShowCreate(false); setCreatedKey(null); }}
                  className="w-full py-2 bg-ow-surface-2 text-sm rounded hover:bg-ow-surface-3 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm text-ow-text-muted block mb-1">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-ow-text-muted block mb-1">Tier</label>
                    <select
                      value={form.subscription_tier}
                      onChange={(e) => setForm({ ...form, subscription_tier: e.target.value })}
                      className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-ow-text-muted block mb-1">Max Kits</label>
                    <input
                      type="number"
                      min={1}
                      value={form.max_kits}
                      onChange={(e) => setForm({ ...form, max_kits: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-sm text-ow-text focus:outline-none focus:border-ow-accent"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-3 py-1.5 text-sm text-ow-text-muted hover:text-ow-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-ow-accent text-ow-bg text-sm font-medium rounded hover:bg-ow-accent-dim transition"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-ow-text-muted text-sm">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="text-ow-text-dim text-sm">No customers yet</p>
      ) : (
        <div className="border border-ow-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ow-surface-2 text-left text-ow-text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Max Kits</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ow-border">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-ow-surface-2/50 transition">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-ow-accent-bg text-ow-accent rounded text-xs">
                      {c.subscription_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.max_kits}</td>
                  <td className="px-4 py-3 text-ow-text-muted">
                    {new Date(c.created_at).toLocaleDateString()}
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
