import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Shared shell ── */
function AuthShell({ children, mode }) {
  const isLogin = mode === 'login';
  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-gradient-to-br from-violet to-[#7c3af0] p-10 relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        {/* Blobs */}
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-soft/40 blur-3xl" />
        <div className="absolute top-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5">
                <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 11H9V9h2v4zm0-6H9V5h2v2z"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-white">
              careercoach<span className="text-coral">.</span>
            </span>
          </div>

          <div className="mt-16">
            <h2 className="font-display text-4xl font-extrabold leading-tight text-white">
              Your career,<br />on your terms.
            </h2>
            <p className="mt-4 text-violet-muted text-base leading-relaxed max-w-xs">
              AI-powered coaching, resume reviews, and career roadmaps — all in one place.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {[
              'Chat with your personal AI career coach',
              'Get your resume scored and improved',
              'Build a step-by-step career roadmap',
              'Works offline — no API key needed',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-sm text-white/80">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm border border-white/10">
          <p className="text-sm text-white/70 italic leading-relaxed">
            "Finally a career tool that gives me specific, honest advice — not just platitudes."
          </p>
          <p className="mt-2 text-xs font-semibold text-white/50">— Early user</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md animate-rise">
          {/* Mobile logo */}
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-soft shadow-sm">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 11H9V9h2v4zm0-6H9V5h2v2z"/>
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-ink">
              career<span className="text-violet">coach</span><span className="text-coral">.</span>
            </span>
          </Link>

          {children}

          <p className="mt-6 text-center text-xs text-ink/35">
            By continuing, you agree to our{' '}
            <span className="text-violet cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-violet cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Field ── */
function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink/80">{label}</span>
        {hint && <span className="text-xs text-ink/40">{hint}</span>}
      </div>
      <input
        {...props}
        className="w-full rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-3 text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.12)]"
      />
    </label>
  );
}

/* ── Error ── */
function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-coral-faint border border-coral/20 px-4 py-3">
      <svg className="mt-0.5 h-4 w-4 shrink-0 text-coral" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <span className="text-sm text-coral">{message}</span>
    </div>
  );
}

/* ── Login ── */
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell mode="login">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Welcome back</h1>
        <p className="mt-1.5 text-ink/50">Sign in to continue coaching your career.</p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <ErrorNote message={error} />
        <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
        <Field label="Password" hint="Min 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
        <button
          className="relative w-full overflow-hidden rounded-xl bg-violet py-3 font-semibold text-white shadow-violet hover:bg-violet-soft hover:shadow-violet-lg disabled:opacity-60 transition-all duration-150"
          disabled={busy}
        >
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Signing in…
            </span>
          ) : 'Sign in'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/50">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-violet hover:underline">
          Create one free
        </Link>
      </p>
    </AuthShell>
  );
}

/* ── Register ── */
export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await register(email, fullName, password);
      if (data.user.is_verified) {
        navigate('/app');
      } else {
        setAwaitingVerification(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (awaitingVerification) {
    return (
      <AuthShell mode="register">
        <div className="text-center py-4">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-faint text-3xl">
            📬
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Check your inbox</h1>
          <p className="mt-3 text-ink/55 leading-relaxed">
            We've sent a verification link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-violet px-7 py-3 font-semibold text-white shadow-violet hover:bg-violet-soft transition-colors"
          >
            Go to sign in
          </Link>
          <p className="mt-4 text-xs text-ink/35">Didn't get it? Check your spam folder.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell mode="register">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Create your account</h1>
        <p className="mt-1.5 text-ink/50">Free forever. No credit card needed.</p>
      </div>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <ErrorNote message={error} />
        <Field label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required autoComplete="name" />
        <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
        <Field label="Password" hint="Min 6 characters" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="new-password" />
        <button
          className="w-full rounded-xl bg-violet py-3 font-semibold text-white shadow-violet hover:bg-violet-soft hover:shadow-violet-lg disabled:opacity-60 transition-all duration-150"
          disabled={busy}
        >
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account…
            </span>
          ) : 'Create free account →'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink/50">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-violet hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
