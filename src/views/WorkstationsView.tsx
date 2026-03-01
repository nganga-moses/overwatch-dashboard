import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Monitor, Key, Copy, Check } from 'lucide-react';

interface WorkstationItem {
  id: string;
  name: string | null;
  hardware_serial: string;
  software_version: string | null;
  status: string;
  last_seen_at: string | null;
  registered_at: string;
}

export default function WorkstationsView() {
  const [workstations, setWorkstations] = useState<WorkstationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setWorkstations(await apiClient.get('/workstations'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function generateCode() {
    setError('');
    try {
      const result = await apiClient.post<{ code: string; expires_at: string }>('/auth/activation-codes');
      setActivationCode(result.code);
      setExpiresAt(result.expires_at);
      setShowCode(true);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(activationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatCode(code: string) {
    return code.slice(0, 4) + '-' + code.slice(4);
  }

  const statusColor: Record<string, string> = {
    online: 'bg-ow-safe/20 text-ow-safe',
    offline: 'bg-ow-surface-3 text-ow-text-dim',
    error: 'bg-ow-danger/20 text-ow-danger',
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Monitor className="w-5 h-5 text-ow-accent" />
          Workstations
        </h1>
        <button
          onClick={generateCode}
          className="flex items-center gap-1 px-3 py-1.5 bg-ow-accent text-ow-bg rounded text-sm font-medium hover:bg-ow-accent-dim transition"
        >
          <Key className="w-4 h-4" />
          Generate Activation Code
        </button>
      </div>

      {error && <p className="text-ow-danger text-sm">{error}</p>}

      {showCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-ow-surface border border-ow-border rounded-lg w-full max-w-sm p-6 space-y-4 text-center">
            <Key className="w-8 h-8 text-ow-accent mx-auto" />
            <h2 className="text-lg font-semibold">Activation Code</h2>
            <p className="text-ow-text-muted text-sm">Share this code with the workstation operator.</p>
            <div className="flex items-center justify-center gap-3 bg-ow-surface-2 border border-ow-border rounded-lg p-4">
              <code className="text-2xl font-mono font-bold tracking-[0.3em] text-ow-accent">
                {formatCode(activationCode)}
              </code>
              <button onClick={copyCode} className="text-ow-text-muted hover:text-ow-text">
                {copied ? <Check className="w-5 h-5 text-ow-safe" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-ow-text-dim">
              Expires: {new Date(expiresAt).toLocaleString()}
            </p>
            <button
              onClick={() => setShowCode(false)}
              className="w-full py-2 bg-ow-surface-2 text-sm rounded hover:bg-ow-surface-3 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-ow-text-muted text-sm">Loading…</p>
      ) : workstations.length === 0 ? (
        <p className="text-ow-text-dim text-sm">No workstations registered yet</p>
      ) : (
        <div className="border border-ow-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ow-surface-2 text-left text-ow-text-muted">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Serial</th>
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ow-border">
              {workstations.map((ws) => (
                <tr key={ws.id} className="hover:bg-ow-surface-2/50 transition">
                  <td className="px-4 py-3">{ws.name ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ow-text-muted">{ws.hardware_serial}</td>
                  <td className="px-4 py-3 text-ow-text-muted">{ws.software_version ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColor[ws.status] ?? statusColor.offline}`}>
                      {ws.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ow-text-muted">
                    {ws.last_seen_at ? new Date(ws.last_seen_at).toLocaleString() : 'Never'}
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
