import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ow-bg">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/logo-white.png" alt="Overwatch" className="w-48 mx-auto mb-4" />
          <p className="text-ow-text-muted text-sm">Sign in to your account</p>
        </div>

        <div className="bg-ow-surface rounded-lg border border-ow-border p-6 space-y-4">
          {error && (
            <div className="bg-ow-danger/10 border border-ow-danger/30 text-ow-danger text-sm rounded px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-ow-text-muted mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-ow-text placeholder:text-ow-text-dim focus:outline-none focus:border-ow-accent text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-ow-text-muted mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-ow-text placeholder:text-ow-text-dim focus:outline-none focus:border-ow-accent text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-ow-accent text-ow-bg font-medium rounded hover:bg-ow-accent-dim transition disabled:opacity-50 text-sm"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-ow-text-dim">
            Don't have an account?{' '}
            <Link to="/signup" className="text-ow-accent hover:text-ow-accent-dim transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
