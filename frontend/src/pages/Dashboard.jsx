import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ convos: 0, resumes: 0, roadmaps: 0, lastScore: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.listConversations(), api.resumeHistory(), api.roadmapHistory()])
      .then(([convos, resumes, roadmaps]) => {
        setStats({
          convos: convos.length,
          resumes: resumes.length,
          roadmaps: roadmaps.length,
          lastScore: resumes[0]?.score ?? null,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const firstName = user?.full_name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-10">
      {/* Welcome banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-violet to-[#7c3af0] px-7 py-8 shadow-violet">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-violet-muted text-sm font-medium">{greeting} 👋</p>
          <h1 className="font-display mt-1 text-3xl font-extrabold text-white md:text-4xl">
            {firstName}
          </h1>
          <p className="mt-1.5 text-violet-muted text-sm">
            {stats.convos + stats.resumes + stats.roadmaps === 0
              ? "You haven't started yet — pick a tool below to begin."
              : `${stats.convos} conversation${stats.convos !== 1 ? 's' : ''}, ${stats.resumes} review${stats.resumes !== 1 ? 's' : ''}, ${stats.roadmaps} roadmap${stats.roadmaps !== 1 ? 's' : ''} so far.`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Conversations" value={loading ? '—' : stats.convos} icon="💬" color="violet" />
        <StatCard label="Resume reviews" value={loading ? '—' : stats.resumes} icon="📄" color="coral" />
        <StatCard label="Roadmaps" value={loading ? '—' : stats.roadmaps} icon="🗺️" color="success" />
        <StatCard
          label="Last resume score"
          value={loading ? '—' : stats.lastScore != null ? `${stats.lastScore}` : '—'}
          suffix={stats.lastScore != null ? '/100' : ''}
          icon="⭐"
          color="amber"
          scoreColor={stats.lastScore != null ? scoreColor(stats.lastScore) : null}
        />
      </div>

      {/* Action cards */}
      <div>
        <h2 className="mb-4 font-display text-lg font-bold text-ink">What do you want to do?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            to="/app/coach"
            icon="💬"
            title="Talk to your coach"
            desc="Ask about interviews, growth, switching fields, or negotiating your next offer."
            gradient="from-violet to-violet-soft"
            cta="Start chatting"
          />
          <ActionCard
            to="/app/resume"
            icon="📄"
            title="Review a resume"
            desc="Upload or paste your resume and get a score with specific, actionable fixes."
            gradient="from-coral to-coral-soft"
            cta="Upload resume"
          />
          <ActionCard
            to="/app/roadmap"
            icon="🗺️"
            title="Build a roadmap"
            desc="Turn a career goal into a phased plan with skills, projects, and milestones."
            gradient="from-[#22c55e] to-[#16a34a]"
            cta="Generate plan"
          />
        </div>
      </div>

      {/* Quick tip */}
      <div className="mt-8 rounded-2xl border border-violet/20 bg-violet-faint px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-semibold text-ink">Pro tip</p>
            <p className="mt-0.5 text-sm text-ink/60">
              Fill out your{' '}
              <Link to="/app/profile" className="font-medium text-violet hover:underline">
                profile
              </Link>{' '}
              so the AI coach can give you personalised advice based on your role, skills, and experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function scoreColor(s) {
  if (s >= 80) return '#16a34a';
  if (s >= 60) return '#5b4bdb';
  return '#ff6b5e';
}

function StatCard({ label, value, suffix = '', icon, color, scoreColor: sc }) {
  const bg = {
    violet: 'bg-violet-faint',
    coral: 'bg-coral-faint',
    success: 'bg-success-faint',
    amber: 'bg-[#fffbeb]',
  }[color] || 'bg-sand';

  return (
    <div className="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-card">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl ${bg} text-base`}>
        {icon}
      </div>
      <p className="font-display text-3xl font-extrabold" style={sc ? { color: sc } : { color: '#141228' }}>
        {value}
        {suffix && <span className="text-lg font-semibold text-ink/30">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/35">{label}</p>
    </div>
  );
}

function ActionCard({ to, icon, title, desc, gradient, cta }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-ink/[0.07] bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 p-6"
    >
      {/* Gradient top line */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient} rounded-t-3xl`} />
      <div className="mt-1">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-xl shadow-sm`}>
          {icon}
        </span>
      </div>
      <h3 className="font-display mt-4 text-lg font-bold text-ink group-hover:text-violet transition-colors">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-violet group-hover:gap-2.5 transition-all">
        {cta}
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
