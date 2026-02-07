export default function DesignGrid({ designs, selectedId, onSelect }) {
  if (!designs?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3">
      {designs.map((design, i) => {
        const active = selectedId === design.id;
        return (
          <button
            key={design.id}
            type="button"
            onClick={() => onSelect(design)}
            className={`rounded-xl border bg-coal-900 p-1 text-left shadow-glow transition ${
              active ? "border-white/60" : "border-white/10 hover:border-white/30"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <img
              src={design.preview}
              alt={`Design variation ${i + 1}`}
              className="aspect-square w-full rounded-lg object-cover opacity-95 animate-rise-in"
            />
          </button>
        );
      })}
    </div>
  );
}
