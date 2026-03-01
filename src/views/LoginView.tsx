import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginView() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message ?? 'Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ow-bg">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/logo.png" alt="Overwatch" className="w-14 h-14 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ow-text">Overwatch Dashboard</h1>
          <p className="text-ow-text-muted mt-2 text-sm">Sign in with your administrator account</p>
        </div>

        <div className="bg-ow-surface rounded-lg border border-ow-border p-6 space-y-4">
          {error && (
            <div className="bg-ow-danger/10 border border-ow-danger/30 text-ow-danger text-sm rounded px-3 py-2">
              {error}
            </div>
          )}

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full py-2 px-4 bg-ow-surface-2 border border-ow-border text-ow-text font-medium rounded hover:bg-ow-surface-3 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? 'Redirecting…' : 'Sign in with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ow-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-ow-surface px-2 text-xs text-ow-text-dim">or</span>
            </div>
          </div>

          {/* Email/password */}
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
                placeholder="admin@example.com"
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
        </div>
      </div>
    </div>
  );
}
