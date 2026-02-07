export default function DesignGrid({ designs, selectedId, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton aspect-square rounded-xl" style={{ animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    );
  }

  if (!designs?.length) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-coal-900/40"
          >
            <span className="text-[10px] text-white/15">Variation {i + 1}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {designs.map((design, i) => {
        const active = selectedId === design.id;
        return (
          <button
            key={design.id}
            type="button"
            onClick={() => onSelect(design)}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
              active
                ? "border-ember-400/60 shadow-glow-ember ring-1 ring-ember-400/20"
                : "border-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <img
              src={design.preview}
              alt={`Design variation ${i + 1}`}
              className="aspect-square w-full object-cover opacity-0 animate-rise-in"
            />
            {active && (
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ember-500 shadow-lg">
                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-coal-950/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-medium text-white/70">Variation {i + 1}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
