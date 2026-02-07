export default function GenCounter({ used, limit, emailUnlocked }) {
  const left = Math.max(limit - used, 0);
  return (
    <div className="rounded-lg border border-white/10 bg-coal-800/70 p-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
        Generation Access
      </div>
      <div className="mt-1 text-sm text-white">
        {used}/{limit} free used
      </div>
      <div className="text-xs text-white/60">
        {emailUnlocked
          ? "Email tier enabled: up to 20 generations/day"
          : left > 0
            ? `${left} free generation${left === 1 ? "" : "s"} remaining`
            : "Unlock more by saving favorites with email"}
      </div>
    </div>
  );
}
