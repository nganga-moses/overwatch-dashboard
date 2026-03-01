import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function SignUpView() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ow-bg">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/logo-white.png" alt="Overwatch" className="w-48 mx-auto mb-4" />
          <p className="text-ow-text-muted text-sm">Create your account</p>
        </div>

        <div className="bg-ow-surface rounded-lg border border-ow-border p-6 space-y-4">
          {success ? (
            <div className="text-center py-4 space-y-3">
              <CheckCircle className="w-10 h-10 text-ow-safe mx-auto" />
              <h2 className="text-lg font-semibold text-ow-text">Check your email</h2>
              <p className="text-sm text-ow-text-muted">
                We've sent a confirmation link to <span className="text-ow-text">{email}</span>.
                Please verify your email to continue.
              </p>
              <p className="text-xs text-ow-text-dim">
                Once verified, a platform administrator will grant you access.
              </p>
              <Link
                to="/login"
                className="inline-block mt-2 text-sm text-ow-accent hover:text-ow-accent-dim transition"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
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
                    minLength={6}
                    className="w-full px-3 py-2 bg-ow-surface-2 border border-ow-border rounded text-ow-text placeholder:text-ow-text-dim focus:outline-none focus:border-ow-accent text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm text-ow-text-muted mb-1">Confirm Password</label>
                  <input
                    id="confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm text-ow-text-dim">
                Already have an account?{' '}
                <Link to="/login" className="text-ow-accent hover:text-ow-accent-dim transition">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
