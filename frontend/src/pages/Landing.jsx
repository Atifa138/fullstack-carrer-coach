import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

/* ── Header ── */
function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/60 sm:flex">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="rounded-xl bg-violet px-4 py-2 text-sm font-medium text-white shadow-violet hover:bg-violet-soft transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-soft shadow-sm">
        <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
          <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 11H9V9h2v4zm0-6H9V5h2v2z"/>
        </svg>
      </div>
      <span className="font-display text-[18px] font-bold text-ink">
        career<span className="text-violet">coach</span><span className="text-coral">.</span>
      </span>
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-violet-faint opacity-60 blur-3xl" />
        <div className="absolute top-40 -left-20 h-[400px] w-[400px] rounded-full bg-coral-faint opacity-50 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-subtle opacity-40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Left */}
          <div className="animate-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet-faint px-3 py-1.5 text-xs font-semibold text-violet">
              <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
              AI-powered career coaching
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-ink md:text-6xl">
              Plan the next <span className="gradient-text">move</span>,<br />
              not just the<br />next job.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
              Chat with an AI coach, get honest resume feedback with a score, and build a
              step-by-step roadmap to the role you actually want.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-violet px-7 py-3.5 font-semibold text-white shadow-violet hover:bg-violet-soft hover:shadow-violet-lg transition-all duration-150"
              >
                Start for free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-ink/12 bg-white px-7 py-3.5 font-semibold text-ink hover:border-violet/30 hover:bg-violet-faint transition-all duration-150"
              >
                I have an account
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-xs text-ink/40">
              <span className="flex items-center gap-1.5"><CheckIcon /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckIcon /> Free offline mode</span>
              <span className="flex items-center gap-1.5"><CheckIcon /> Works with Groq / Gemini</span>
            </div>
          </div>

          {/* Right — Chat mockup */}
          <div className="animate-rise" style={{ animationDelay: '0.1s' }}>
            <div className="animate-float">
              <ChatMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-success-light" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ChatMockup() {
  return (
    <div className="relative rounded-3xl border border-ink/10 bg-white shadow-card-hover overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-ink/[0.07] bg-sand px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-coral/70" />
        <span className="h-3 w-3 rounded-full bg-sand-dark" />
        <span className="h-3 w-3 rounded-full bg-success-light/70" />
        <div className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-1 text-[11px] text-ink/30">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          app.careercoach.ai/coach
        </div>
      </div>

      {/* Chat content */}
      <div className="space-y-3 p-5">
        <MockBubble role="user">
          How do I move from analyst to data scientist?
        </MockBubble>
        <MockBubble role="coach">
          Great goal — the overlap is bigger than most think. Here's a practical sequence:{' '}
          <strong>solidify Python + stats fundamentals</strong>, build 2 portfolio projects
          (start simple: EDA + a model), then target analyst-to-DS hybrid roles first.
          <br /><br />
          Want me to generate a 16-week roadmap with specific resources?
        </MockBubble>
        <MockBubble role="user">Yes please!</MockBubble>
        <div className="flex items-center gap-2 rounded-2xl bg-sand px-4 py-3 text-sm">
          <span className="inline-flex gap-1">
            {[0, 150, 300].map((d) => (
              <span key={d} className="h-1.5 w-1.5 rounded-full bg-violet-muted animate-bounce" style={{ animationDelay: `${d}ms` }} />
            ))}
          </span>
          <span className="text-ink/40 text-xs">CareerCoach is thinking…</span>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-ink/[0.07] px-4 py-3">
        <div className="flex-1 rounded-xl bg-sand px-4 py-2.5 text-sm text-ink/30">
          Ask your coach anything…
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet text-white shadow-violet">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MockBubble({ role, children }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mr-2 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet text-white text-[10px] font-bold">
          AI
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser ? 'bg-ink text-white' : 'bg-sand text-ink'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Features ── */
const FEATURES = [
  {
    icon: '💬',
    title: 'AI Career Coach',
    desc: 'Ask about interviews, switching fields, salary negotiation, or getting unstuck. Practical, honest answers — not generic advice.',
    color: 'from-violet to-violet-soft',
    badge: 'Chat',
  },
  {
    icon: '📄',
    title: 'Resume Analyser',
    desc: 'Upload or paste your resume. Get a score out of 100, specific fixes, and missing keywords for your target role.',
    color: 'from-coral to-coral-soft',
    badge: 'PDF • DOCX • TXT',
  },
  {
    icon: '🗺️',
    title: 'Career Roadmap',
    desc: 'Turn a vague goal into a phased plan: skills, projects, resources, and milestones — all in one markdown document.',
    color: 'from-[#22c55e] to-[#16a34a]',
    badge: 'Generate',
  },
];

function Features() {
  return (
    <section id="features" className="bg-[#f5f4f9] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl font-bold text-ink">
            Everything you need to move faster
          </h2>
          <p className="mt-3 text-ink/55 text-lg">
            Three tools. One mission: get you to the role you want.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon, title, desc, color, badge }) => (
            <div
              key={title}
              className="group relative rounded-3xl border border-ink/[0.07] bg-white p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-sm text-xl`}>
                {icon}
              </div>
              <span className="mb-3 inline-block rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-medium text-ink/50">
                {badge}
              </span>
              <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{desc}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-violet group-hover:gap-2 transition-all">
                Try it free
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ── */
const STEPS = [
  { n: '01', title: 'Create your free account', desc: 'Sign up in seconds. No credit card required.' },
  { n: '02', title: 'Fill in your profile', desc: 'Tell the coach your current role, target, skills, and experience. It uses this context for sharper advice.' },
  { n: '03', title: 'Start coaching', desc: 'Chat, upload your resume, or generate a roadmap. All three are available from day one.' },
  { n: '04', title: 'Add a free AI key (optional)', desc: 'Drop a Groq or Gemini key in settings to unlock full AI responses. Works offline too.' },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-14 text-center">
          <h2 className="font-display text-4xl font-bold text-ink">How it works</h2>
          <p className="mt-3 text-ink/55 text-lg">Up and running in under two minutes.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="relative">
              <div className="mb-4 font-display text-4xl font-extrabold text-violet-subtle select-none">{n}</div>
              <h3 className="font-display text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section className="py-24 bg-[#f5f4f9]">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet to-[#7c3af0] px-8 py-14 shadow-violet-lg">
          {/* Background dots */}
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <div className="relative">
            <h2 className="font-display text-4xl font-extrabold text-white md:text-5xl">
              Your next role<br />starts here.
            </h2>
            <p className="mt-4 text-violet-muted text-lg">
              Join the waitlist or dive straight in — it's free.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-white px-7 py-3.5 font-semibold text-violet shadow-lg hover:bg-violet-faint transition-colors"
              >
                Get started free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="border-t border-ink/[0.07] bg-white py-8">
      <div className="mx-auto max-w-6xl px-5 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
        <Logo />
        <p className="text-xs text-ink/35">
          © {new Date().getFullYear()} CareerCoach AI · Built for job seekers
        </p>
      </div>
    </footer>
  );
}
