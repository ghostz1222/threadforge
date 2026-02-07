export default function Logo({ className = "", iconOnly = false, size = 32 }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* ThreadForge icon — thread/needle intertwined in circle */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="3" />
        {/* Cross-hatch fabric pattern */}
        <g opacity="0.35" stroke="currentColor" strokeWidth="0.7">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1="15" y1={20 + i * 5} x2="85" y2={20 + i * 5} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={20 + i * 5} y1="15" x2={20 + i * 5} y2="85" />
          ))}
        </g>
        {/* Thread/needle swoosh */}
        <path
          d="M30 70 C30 50, 45 35, 50 30 C55 25, 70 25, 72 35 C74 45, 55 50, 50 50 C45 50, 28 55, 30 70Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M50 50 C55 50, 75 45, 73 60 C71 75, 55 70, 50 68 C45 66, 30 75, 30 70"
          fill="currentColor"
          opacity="0.7"
        />
        {/* Needle tip */}
        <path
          d="M26 73 L22 80 L30 76 Z"
          fill="currentColor"
        />
        {/* Thread eye */}
        <ellipse cx="50" cy="30" rx="3" ry="4" fill="currentColor" opacity="0" />
        <path d="M48 28 Q50 24, 52 28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      </svg>
      {!iconOnly && (
        <span className="text-[15px] font-extrabold tracking-tight">ThreadForge</span>
      )}
    </span>
  );
}
