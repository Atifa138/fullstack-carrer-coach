import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import { useAuth } from '../context/AuthContext';

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}
export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
      <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
export function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── ProtectedRoute ────────────────────────────────────────────────────────────
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner full />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── Sidebar ── dark theme with per-feature color accents ──────────────────────
const NAV = [
  { to: '/app',         label: 'Dashboard', Icon: IconGrid, end: true,
    color: '#6c47ff', glow: 'rgba(108,71,255,0.4)',  bg: 'rgba(108,71,255,0.15)' },
  { to: '/app/coach',   label: 'AI Coach',  Icon: IconChat,
    color: '#f72585', glow: 'rgba(247,37,133,0.4)',  bg: 'rgba(247,37,133,0.15)' },
  { to: '/app/resume',  label: 'Resume',    Icon: IconDoc,
    color: '#4cc9f0', glow: 'rgba(76,201,240,0.4)',  bg: 'rgba(76,201,240,0.15)' },
  { to: '/app/roadmap', label: 'Roadmap',   Icon: IconMap,
    color: '#2eca7f', glow: 'rgba(46,202,127,0.4)',  bg: 'rgba(46,202,127,0.15)' },
  { to: '/app/profile', label: 'Profile',   Icon: IconUser,
    color: '#ff9f1c', glow: 'rgba(255,159,28,0.4)',  bg: 'rgba(255,159,28,0.15)' },
];

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <aside
      className={[
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col',
        'transition-transform duration-200 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ].join(' ')}
      style={{ background: '#0d0b1e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Ambient glow blobs behind content */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6c47ff, transparent)' }} />
        <div className="absolute bottom-20 -right-10 h-48 w-48 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #f72585, transparent)' }} />
      </div>

      {/* Logo */}
      <div className="relative flex h-16 shrink-0 items-center gap-3 px-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl shadow-violet"
          style={{ background: 'linear-gradient(135deg, #6c47ff, #f72585)' }}>
          <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
            <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 11H9V9h2v4zm0-6H9V5h2v2z"/>
          </svg>
        </div>
        <span className="font-display text-[17px] font-bold tracking-tight text-white">
          career<span style={{ color: '#a992ff' }}>coach</span><span style={{ color: '#f72585' }}>.</span>
        </span>
        <button onClick={onClose}
          className="ml-auto rounded-lg p-1 text-white/30 hover:text-white/70 md:hidden">
          <IconX />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/20">
          Menu
        </p>
        {NAV.map(({ to, label, Icon: NavIcon, end, color, glow, bg }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
            style={({ isActive }) => isActive
              ? { background: bg, color: color, boxShadow: `0 0 20px ${glow}` }
              : { color: 'rgba(255,255,255,0.45)' }
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all"
                  style={isActive
                    ? { background: color, color: '#fff', boxShadow: `0 4px 12px ${glow}` }
                    : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
                  }>
                  <NavIcon />
                </span>
                <span className={isActive ? 'font-semibold' : 'group-hover:text-white/80'}>{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full animate-glow-pulse"
                    style={{ background: color }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="shrink-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-violet"
            style={{ background: 'linear-gradient(135deg, #6c47ff, #f72585)' }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white/90">{user?.full_name}</p>
            <p className="truncate text-[11px] text-white/35">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff6b5e'; e.currentTarget.style.background = 'rgba(255,107,94,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = ''; }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ── Markdown ──────────────────────────────────────────────────────────────────
export function Markdown({ text }) {
  const html = marked.parse(text || '', { breaks: true });
  return <div className="prose-cc" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ full = false }) {
  const ring = (
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-violet/20" />
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet" />
      <div className="absolute inset-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.15), rgba(247,37,133,0.15))' }} />
    </div>
  );
  if (full)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        {ring}
        <p className="text-sm text-ink/40">Loading…</p>
      </div>
    );
  return ring;
}
