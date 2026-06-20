import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Spinner } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.getProfile().then(setForm).catch(() => {}); }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setError('');
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = {
        current_role: form.current_role || '',
        target_role: form.target_role || '',
        years_experience: parseFloat(form.years_experience) || 0,
        skills: form.skills || '',
        industry: form.industry || '',
        bio: form.bio || '',
      };
      const updated = await api.updateProfile(payload);
      setForm(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!form) return <div className="py-20 flex justify-center"><Spinner full /></div>;

  const initials = user?.full_name
    ? user.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="mx-auto max-w-2xl px-5 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink/50 mb-3">
          👤 Profile
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink">Your profile</h1>
        <p className="mt-2 text-ink/55">
          The AI coach uses this context to give you sharper, more personalised advice.
        </p>
      </div>

      {/* Avatar section */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-ink/[0.07] bg-white px-5 py-5 shadow-card">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-violet-soft text-2xl font-extrabold text-white shadow-violet">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-bold text-ink">{user?.full_name}</p>
          <p className="text-sm text-ink/45">{user?.email}</p>
          {form.current_role && (
            <p className="mt-1 text-xs font-medium text-violet">{form.current_role}</p>
          )}
        </div>
        {(form.current_role || form.target_role) && (
          <div className="ml-auto hidden sm:block">
            <div className="rounded-xl border border-violet/20 bg-violet-faint px-4 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet/60 mb-0.5">Target</p>
              <p className="text-sm font-bold text-violet">{form.target_role || '—'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={save} className="space-y-5">
        {/* Career section */}
        <Section title="Career details" icon="💼">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Current role" value={form.current_role ?? ''} onChange={(v) => update('current_role', v)} placeholder="e.g. Product Analyst" />
            <FormField label="Target role" value={form.target_role ?? ''} onChange={(v) => update('target_role', v)} placeholder="e.g. Senior PM" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Years of experience" type="number" value={form.years_experience ?? 0} onChange={(v) => update('years_experience', v)} placeholder="0" min={0} max={50} step={0.5} />
            <FormField label="Industry" value={form.industry ?? ''} onChange={(v) => update('industry', v)} placeholder="e.g. FinTech, Healthcare" />
          </div>
        </Section>

        {/* Skills section */}
        <Section title="Skills" icon="⚡">
          <FormField
            label="Skills"
            hint="Comma-separated"
            value={form.skills ?? ''}
            onChange={(v) => update('skills', v)}
            placeholder="e.g. Python, SQL, Data analysis, Figma"
          />
          {/* Skill preview tags */}
          {form.skills && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="rounded-full bg-violet-subtle px-2.5 py-0.5 text-xs font-medium text-violet">
                  {s}
                </span>
              ))}
            </div>
          )}
        </Section>

        {/* Bio section */}
        <Section title="Bio" icon="📝">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink/70">Short bio</span>
            <textarea
              rows={4}
              value={form.bio ?? ''}
              onChange={(e) => update('bio', e.target.value)}
              placeholder="A short description of your background, goals, or what you're working toward…"
              className="w-full resize-none rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-3 text-sm text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.1)]"
            />
          </label>
        </Section>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-coral-faint border border-coral/20 px-4 py-3 text-sm text-coral">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button
            disabled={busy}
            className="flex items-center gap-2 rounded-xl bg-violet px-7 py-3 font-semibold text-white shadow-violet hover:bg-violet-soft hover:shadow-violet-lg disabled:opacity-60 transition-all"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Saving…
              </>
            ) : 'Save profile'}
          </button>

          {saved && (
            <span className="animate-rise-fast flex items-center gap-1.5 text-sm font-medium text-success-DEFAULT">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Profile saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center gap-2 border-b border-ink/[0.06] pb-3">
        <span className="text-base">{icon}</span>
        <h2 className="font-display text-sm font-bold text-ink">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormField({ label, hint, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink/70">{label}</span>
        {hint && <span className="text-xs text-ink/35">{hint}</span>}
      </div>
      <input
        type={type}
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-2.5 text-sm text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.1)]"
      />
    </label>
  );
}
