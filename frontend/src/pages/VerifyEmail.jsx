import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in this link.');
      return;
    }
    api
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have already been used.');
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-md text-center animate-rise">
        {/* Logo */}
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-soft shadow-sm">
            <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
              <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 11H9V9h2v4zm0-6H9V5h2v2z"/>
            </svg>
          </div>
          <span className="font-display text-lg font-bold text-ink">
            career<span className="text-violet">coach</span><span className="text-coral">.</span>
          </span>
        </Link>

        {status === 'loading' && (
          <div className="mt-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-faint">
              <span className="h-7 w-7 rounded-full border-2 border-violet/30 border-t-violet animate-spin" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">Verifying your email…</h1>
            <p className="mt-2 text-ink/45">Just a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-success-faint text-3xl">
              ✅
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">Email verified!</h1>
            <p className="mt-2 text-ink/55">Your account is active. You can now sign in.</p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-xl bg-violet px-8 py-3 font-semibold text-white shadow-violet hover:bg-violet-soft transition-colors"
            >
              Sign in →
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-faint text-3xl">
              ⚠️
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">Verification failed</h1>
            <p className="mt-2 text-ink/55">{message}</p>
            <div className="mt-6 flex flex-col gap-2 items-center">
              <Link
                to="/login"
                className="rounded-xl bg-violet px-8 py-3 font-semibold text-white shadow-violet hover:bg-violet-soft transition-colors"
              >
                Go to sign in
              </Link>
              <Link to="/register" className="text-sm text-ink/40 hover:text-violet transition-colors">
                Create a new account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
