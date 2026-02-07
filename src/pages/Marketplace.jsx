const CARDS = [
  ["Neon Atlas", "@midnightink", "Streetwear", "$34"],
  ["Sunset Grid", "@lunaforms", "Vintage", "$34"],
  ["Storm Bloom", "@wildvector", "Illustrated", "$34"],
  ["Shifted Orbit", "@foundryclub", "Minimal", "$34"],
];

export default function Marketplace() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <section className="card rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-300">Phase 2</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Creator marketplace</h1>
        <p className="mt-2 max-w-3xl text-sm text-white/70">
          Browse shared designs, follow creators, and buy in one click. Royalty routing (10-15%) and public moderation queue are prepared in the architecture and connect in backend phase 2.
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(([name, creator, style, price]) => (
          <article key={name} className="card rounded-xl p-4">
            <div className="aspect-square rounded-lg border border-white/10 bg-gradient-to-br from-coal-700 to-coal-900" />
            <h3 className="mt-3 text-lg font-bold">{name}</h3>
            <p className="text-sm text-white/65">{creator}</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="rounded-md border border-white/20 px-2 py-1 text-xs text-white/65">{style}</span>
              <span className="font-mono text-emerald-300">{price}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
