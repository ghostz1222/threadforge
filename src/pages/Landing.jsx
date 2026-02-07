import { Link } from "react-router-dom";

const EXAMPLES = [
  { label: "Neon wolf over geometric mountains", emoji: "\u{1F43A}", gradient: "from-rose-500/30 to-violet-600/20" },
  { label: "Vintage sunset with hand-drawn van", emoji: "\u{1F305}", gradient: "from-amber-500/30 to-orange-600/20" },
  { label: "Ink dragon wrapped around a crescent moon", emoji: "\u{1F409}", gradient: "from-cyan-500/25 to-blue-600/20" },
  { label: "Minimal koi fish in split-color circle", emoji: "\u{1F41F}", gradient: "from-emerald-500/25 to-teal-600/20" },
];

const STEPS = [
  { idx: "01", title: "Describe", desc: "Tell us your idea in natural language. Our AI creates 4 unique variations in seconds." },
  { idx: "02", title: "Customize", desc: "Pick your favorite, adjust scale and placement, choose shirt style and color." },
  { idx: "03", title: "Order", desc: "Secure checkout via Stripe. Printed and shipped to your door in 3-5 days." },
];

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
      {/* Hero */}
      <section className="mesh-bg relative overflow-hidden rounded-2xl border border-white/[0.06] px-7 py-14 sm:rounded-3xl sm:px-14 sm:py-20">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-ember-500/10 blur-[100px]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-white/60">AI-Powered Custom Apparel</span>
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Describe it.{" "}
            <span className="bg-gradient-to-r from-ember-400 to-brass bg-clip-text text-transparent">
              Wear it.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Turn any idea into a wearable design in under a minute. Pick a style, refine placement, and order &mdash; no signup required.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/studio"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember-500/25 transition-all hover:shadow-ember-500/40 hover:brightness-110"
            >
              Start Creating
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Browse Designs
            </Link>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {EXAMPLES.map(({ label, emoji, gradient }, i) => (
          <Link
            key={label}
            to="/studio"
            className="card group rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow-ember"
          >
            <div className={`mb-3.5 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${gradient} p-px`}>
              <div className="flex h-full w-full items-center justify-center rounded-lg bg-coal-900/80">
                <span className="text-3xl opacity-40 transition-transform group-hover:scale-110">{emoji}</span>
              </div>
            </div>
            <p className="text-[13px] font-medium text-white/70 transition-colors group-hover:text-white/90">{label}</p>
          </Link>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-14">
        <div className="mb-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember-400/70">How it works</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Three steps to your custom tee</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map(({ idx, title, desc }) => (
            <article key={title} className="card group rounded-xl p-6 transition-all hover:-translate-y-0.5">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ember-500/10 font-mono text-sm font-bold text-ember-400">
                {idx}
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <p className="text-sm text-white/40">No account needed. 3 free generations to start.</p>
        <Link
          to="/studio"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08] hover:text-white"
        >
          Try it free
        </Link>
      </section>
    </main>
  );
}
