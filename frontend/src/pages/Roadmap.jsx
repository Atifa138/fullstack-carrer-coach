import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Markdown } from '../components/ui';

export default function Roadmap() {
  const [goal, setGoal] = useState('');
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.roadmapHistory().then(setHistory).catch(() => {}); }, []);

  async function generate(e) {
    e.preventDefault();
    if (goal.trim().length < 3 || busy) return;
    setError('');
    setBusy(true);
    setCurrent(null);
    try {
      const res = await api.generateRoadmap({ goal });
      setCurrent(res);
      setHistory((h) => [res, ...h.filter((x) => x.id !== res.id)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const EXAMPLES = [
    'Become a machine learning engineer in 6 months',
    'Transition from marketing to product management',
    'Get my first software engineering job',
    'Move from junior to senior developer',
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-success-faint px-3 py-1 text-xs font-semibold text-success-DEFAULT mb-3">
          🗺️ Career roadmap
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          Build your roadmap
        </h1>
        <p className="mt-2 text-ink/55">
          Describe a career goal and get a phased, actionable plan with skills, projects, and milestones.
        </p>
      </div>

      {/* Generate form */}
      <div className="rounded-3xl border border-ink/[0.07] bg-white p-6 shadow-card mb-6">
        <form onSubmit={generate} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink/70">What's your career goal?</label>
            <input
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setError(''); }}
              placeholder="e.g. Become a backend engineer in 6 months"
              className="w-full rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-3 text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.1)]"
            />
          </div>

          {/* Example prompts */}
          {!goal && (
            <div>
              <p className="mb-2 text-xs font-semibold text-ink/35 uppercase tracking-wide">Try one of these</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setGoal(ex)}
                    className="rounded-full border border-ink/12 bg-sand/60 px-3 py-1.5 text-xs text-ink/60 hover:border-violet/40 hover:bg-violet-faint hover:text-violet transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-coral-faint border border-coral/20 px-4 py-3 text-sm text-coral">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            disabled={busy || goal.trim().length < 3}
            className="w-full rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] py-3 font-semibold text-white shadow-[0_4px_16px_rgba(34,197,94,0.28)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.35)] disabled:opacity-50 transition-all"
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Generating your roadmap…
              </span>
            ) : '🗺️ Generate roadmap →'}
          </button>
        </form>
      </div>

      {/* Loading shimmer */}
      {busy && (
        <div className="rounded-3xl border border-ink/[0.07] bg-white p-7 shadow-card space-y-4">
          {[80, 60, 90, 70, 50].map((w, i) => (
            <div key={i} className={`h-4 rounded-full animate-shimmer`} style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* Result */}
      {current && !busy && (
        <div className="animate-rise rounded-3xl border border-ink/[0.07] bg-white shadow-card overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-3 border-b border-ink/[0.07] bg-success-faint px-6 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-lg shadow-sm">
              🗺️
            </span>
            <div>
              <p className="font-display font-bold text-ink text-sm">Roadmap generated</p>
              <p className="text-xs text-ink/45 truncate">{current.goal}</p>
            </div>
            <button
              onClick={() => { navigator.clipboard?.writeText(current.content); }}
              className="ml-auto rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/50 hover:text-ink hover:border-ink/20 transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="p-7">
            <Markdown text={current.content} />
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-ink">Past roadmaps</h2>
          <div className="space-y-2">
            {history.map((r) => (
              <button
                key={r.id ?? r.goal}
                onClick={() => setCurrent(r)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  current?.id === r.id
                    ? 'border-success-light/40 bg-success-faint text-success-DEFAULT'
                    : 'border-ink/[0.07] bg-white text-ink/60 hover:border-success-light/30 hover:bg-success-faint hover:text-success-DEFAULT shadow-card'
                }`}
              >
                <span className="text-base">🗺️</span>
                <span className="truncate text-sm font-medium">{r.goal}</span>
                <svg className="ml-auto h-4 w-4 shrink-0 text-ink/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
