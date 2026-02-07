export default function GenCounter({ used, limit, emailUnlocked }) {
  const left = Math.max(limit - used, 0);
  const progress = Math.min(used / limit, 1);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-coal-900/40 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Generation Access</span>
        <span className="text-xs font-semibold text-white/60">{used}/{limit}</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-ember-500 to-ember-400 transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-white/40">
        {emailUnlocked
          ? "Email tier: up to 20 generations/day"
          : left > 0
            ? `${left} free generation${left === 1 ? "" : "s"} remaining`
            : "Unlock more by saving favorites with email"}
      </p>
    </div>
  );
}
