import { useRef, useState } from 'react';
import { api } from '../api/client';
import { Markdown } from '../components/ui';

const ACCEPTED = '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';

export default function ResumeAnalyzer() {
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  async function analyze(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    if (mode === 'upload' && !file) { setError('Please select a file.'); return; }
    if (mode === 'paste' && resumeText.trim().length < 20) { setError('Please paste at least a few lines of your resume.'); return; }
    setBusy(true);
    try {
      const res = mode === 'upload'
        ? await api.uploadResume(file, targetRole)
        : await api.analyzeResume({ resume_text: resumeText, target_role: targetRole });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleFile(f) {
    if (f) { setFile(f); setError(''); setResult(null); }
  }

  function switchMode(m) {
    setMode(m); setFile(null); setResumeText(''); setError(''); setResult(null);
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-coral-faint px-3 py-1 text-xs font-semibold text-coral mb-3">
          📄 Resume analyser
        </div>
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
          Get your resume scored
        </h1>
        <p className="mt-2 text-ink/55">
          Upload or paste your resume, name the role you're aiming for, and get a score
          with specific fixes.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left: Form */}
        <div className="rounded-3xl border border-ink/[0.07] bg-white p-6 shadow-card">
          {/* Mode tabs */}
          <div className="mb-5 flex gap-1.5 rounded-xl bg-sand p-1">
            {['upload', 'paste'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink/50 hover:text-ink'
                }`}
              >
                {m === 'upload' ? '📎 Upload file' : '✏️ Paste text'}
              </button>
            ))}
          </div>

          <form onSubmit={analyze} className="space-y-4">
            {/* Target role */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink/70">
                Target role <span className="text-ink/30 font-normal">(optional)</span>
              </label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-2.5 text-sm text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.1)]"
              />
            </div>

            {/* Upload zone */}
            {mode === 'upload' ? (
              <div
                onClick={() => inputRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                  dragging
                    ? 'border-violet bg-violet-faint scale-[1.01]'
                    : file
                    ? 'border-success-light bg-success-faint'
                    : 'border-ink/15 bg-sand/40 hover:border-violet/50 hover:bg-violet-faint'
                }`}
              >
                <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                {file ? (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-faint border border-success-light/30 text-2xl">📄</div>
                    <div>
                      <p className="font-semibold text-ink">{file.name}</p>
                      <p className="mt-1 text-xs text-ink/40">{(file.size / 1024).toFixed(0)} KB · click to replace</p>
                    </div>
                    <span className="rounded-full bg-success-faint border border-success-light/30 px-3 py-1 text-xs font-semibold text-success-DEFAULT">
                      Ready to analyse
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-subtle text-2xl">
                      ☁️
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        <span className="text-violet">Click to upload</span> or drag &amp; drop
                      </p>
                      <p className="mt-1 text-xs text-ink/40">PDF, DOCX, or plain text · max 5 MB</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here…"
                rows={12}
                className="w-full rounded-xl border-[1.5px] border-ink/12 bg-sand/50 px-4 py-3 font-mono text-sm text-ink placeholder-ink/30 outline-none transition focus:border-violet focus:bg-white focus:shadow-[0_0_0_3px_rgba(91,75,219,0.1)] resize-none"
              />
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-coral-faint border border-coral/20 px-4 py-3 text-sm text-coral">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-violet py-3 font-semibold text-white shadow-violet hover:bg-violet-soft hover:shadow-violet-lg disabled:opacity-60 transition-all"
            >
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Analysing resume…
                </span>
              ) : 'Analyse resume →'}
            </button>
          </form>
        </div>

        {/* Right: Tips or result preview */}
        {!result ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-card">
              <h3 className="font-display text-sm font-bold text-ink mb-3">What you'll get</h3>
              <div className="space-y-3">
                {[
                  ['Score out of 100', 'Calibrated to your target role'],
                  ['Strengths', "What's already working well"],
                  ['Weaknesses', 'Specific issues to address'],
                  ['Improvements', 'Concrete rewrites and fixes'],
                  ['Missing keywords', 'What ATS scanners look for'],
                ].map(([title, sub]) => (
                  <div key={title} className="flex gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-violet-subtle text-center text-xs font-bold text-violet flex items-center justify-center">✓</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{title}</p>
                      <p className="text-xs text-ink/45">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-violet/20 bg-violet-faint p-5">
              <p className="text-xs font-semibold text-violet mb-1">💡 Tip</p>
              <p className="text-xs text-ink/60 leading-relaxed">
                Tailor your resume to each role. Mention the job title in your summary and match keywords from the job description.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-ink/[0.07] bg-white p-5 shadow-card flex flex-col items-center gap-3">
            <ScoreRing score={result.score} />
            <p className="font-display text-sm font-bold text-ink">Resume score</p>
            <p className="text-xs text-ink/45 text-center">
              {result.target_role ? `For: ${result.target_role}` : 'General review'}
            </p>
            <div className="w-full h-px bg-ink/8 my-1" />
            <ScoreLegend />
          </div>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="mt-6 animate-rise rounded-3xl border border-ink/[0.07] bg-white p-7 shadow-card">
          <div className="mb-6 flex items-center gap-4">
            <ScoreRing score={result.score} size="sm" />
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Analysis complete</h2>
              <p className="text-sm text-ink/45">
                {result.target_role ? `Target role: ${result.target_role}` : 'General resume review'}
              </p>
            </div>
          </div>
          <Markdown text={result.feedback} />
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score, size = 'lg' }) {
  const s = score ?? 0;
  const color = s >= 80 ? '#16a34a' : s >= 60 ? '#5b4bdb' : '#ff6b5e';
  const dim = size === 'lg' ? 96 : 72;
  const inner = size === 'lg' ? 68 : 52;
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white shadow-sm`}
      style={{
        width: dim, height: dim,
        background: `conic-gradient(${color} ${s * 3.6}deg, #ece9f8 0deg)`,
      }}
    >
      <span
        className={`flex items-center justify-center rounded-full bg-white ${textSize} font-extrabold`}
        style={{ width: inner, height: inner, color }}
      >
        {s}
      </span>
    </div>
  );
}

function ScoreLegend() {
  return (
    <div className="w-full space-y-2">
      {[['80–100', 'Excellent', '#16a34a'], ['60–79', 'Good', '#5b4bdb'], ['0–59', 'Needs work', '#ff6b5e']].map(([range, label, color]) => (
        <div key={range} className="flex items-center gap-2 text-xs">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
          <span className="font-semibold" style={{ color }}>{range}</span>
          <span className="text-ink/40">{label}</span>
        </div>
      ))}
    </div>
  );
}
