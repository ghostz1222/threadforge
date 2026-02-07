import { Link } from "react-router-dom";

const EXAMPLES = [
  "Neon wolf over geometric mountains",
  "Vintage sunset with hand-drawn van",
  "Ink dragon wrapped around a crescent moon",
  "Minimal koi fish in split-color circle",
];

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <section className="mesh-bg overflow-hidden rounded-3xl border border-white/10 px-6 py-12 sm:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">ThreadForge</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Describe it. <span className="text-ember-400">Wear it.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
          Turn an idea into a wearable design in minutes. Pick a style, refine placement, and order without any signup wall.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/studio"
            className="rounded-lg bg-ember-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-ember-400"
          >
            Create Your Own
          </Link>
          <Link
            to="/marketplace"
            className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-white/40"
          >
            Browse Designs
          </Link>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        {EXAMPLES.map((label, i) => (
          <article key={label} className="card rounded-xl p-4">
            <div className="mb-3 aspect-[4/3] rounded-lg bg-gradient-to-br from-coal-700 to-coal-900 p-3">
              <div
                className="h-full w-full rounded-md border border-white/10"
                style={{
                  background:
                    i % 2
                      ? "radial-gradient(circle at 30% 30%, rgba(230,57,70,0.45), transparent 50%), #0f1419"
                      : "radial-gradient(circle at 70% 20%, rgba(244,162,97,0.45), transparent 45%), #0f1419",
                }}
              />
            </div>
            <p className="text-sm text-white/80">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["01", "Describe", "Tell us the idea in natural language."],
          ["02", "Customize", "Pick a variation, adjust scale and placement."],
          ["03", "Order", "Select shirt details and checkout in one flow."],
        ].map(([idx, title, desc]) => (
          <article key={title} className="card rounded-xl p-5">
            <p className="font-mono text-xs text-ember-300">{idx}</p>
            <h3 className="mt-2 text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-white/70">{desc}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
