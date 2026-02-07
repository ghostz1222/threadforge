import { Link } from "react-router-dom";

const EXAMPLES = [
  { label: "Neon wolf over geometric mountains", gradient: "from-rose-500/30 to-violet-600/20", thumb: makeExampleThumb("wolf") },
  { label: "Vintage sunset with hand-drawn van", gradient: "from-amber-500/30 to-orange-600/20", thumb: makeExampleThumb("sunset") },
  { label: "Ink dragon wrapped around a crescent moon", gradient: "from-cyan-500/25 to-blue-600/20", thumb: makeExampleThumb("dragon") },
  { label: "Minimal koi fish in split-color circle", gradient: "from-emerald-500/25 to-teal-600/20", thumb: makeExampleThumb("koi") },
];

const STEPS = [
  { idx: "01", title: "Describe", desc: "Tell us your idea in a few words. We'll create 4 unique design variations for you in seconds." },
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
            <span className="text-[11px] font-medium tracking-wide text-white/60">Custom Apparel, Made to Order</span>
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
        {EXAMPLES.map(({ label, thumb, gradient }) => (
          <Link
            key={label}
            to="/studio"
            className="card group rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow-ember"
          >
            <div className={`mb-3.5 aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br ${gradient} p-px`}>
              <div className="h-full w-full rounded-lg bg-coal-900/80 p-2">
                <img
                  src={thumb}
                  alt={label}
                  className="h-full w-full rounded-md object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
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
        <p className="text-sm text-white/40">No account needed. 3 free designs to start.</p>
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

function makeExampleThumb(kind) {
  const variants = {
    wolf:
      '<rect width="320" height="240" fill="#0e1118"/><circle cx="240" cy="64" r="34" fill="#f472b6" opacity=".9"/><path d="M56 198L124 120L174 162L222 108L286 198Z" fill="#334155"/><path d="M116 178L148 98L194 126L186 194Z" fill="#67e8f9"/><path d="M120 166L148 120L168 136L182 182Z" fill="#facc15"/>',
    sunset:
      '<rect width="320" height="240" fill="#111217"/><circle cx="164" cy="102" r="56" fill="#fb923c"/><rect x="44" y="150" width="232" height="10" fill="#1f2937"/><rect x="86" y="144" width="120" height="42" rx="6" fill="#475569"/><circle cx="108" cy="190" r="10" fill="#0f172a"/><circle cx="188" cy="190" r="10" fill="#0f172a"/><path d="M56 146H270" stroke="#f59e0b" stroke-width="4" opacity=".7"/>',
    dragon:
      '<rect width="320" height="240" fill="#091225"/><circle cx="206" cy="84" r="34" fill="#60a5fa" opacity=".9"/><path d="M66 188C124 90 196 92 238 144C256 166 250 196 220 206C172 222 94 214 66 188Z" fill="#22d3ee"/><path d="M88 182C132 128 176 130 210 166" stroke="#0f172a" stroke-width="8" fill="none"/><path d="M166 120C178 86 206 70 224 62" stroke="#a78bfa" stroke-width="7" fill="none"/>',
    koi:
      '<rect width="320" height="240" fill="#0b1517"/><circle cx="160" cy="120" r="78" fill="#e2e8f0" opacity=".18"/><path d="M84 124C112 96 156 94 198 118C166 136 138 156 124 184C104 168 92 148 84 124Z" fill="#34d399"/><path d="M236 116C214 142 182 152 148 144C182 118 198 92 202 64C220 78 232 94 236 116Z" fill="#38bdf8"/><circle cx="170" cy="116" r="4" fill="#0f172a"/>',
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">${variants[kind] || variants.wolf}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
