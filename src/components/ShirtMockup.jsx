export default function ShirtMockup({ color, design, placement, muted = false }) {
  const isLight = ["#F5F5F0", "#C8B89A"].includes(color);
  const border = isLight ? "#D8D8D0" : "#2A313A";
  const neckline = isLight ? "#E5E5DE" : "#12161B";
  const stitch = isLight ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)";

  const scale = placement?.scale ?? 20;
  const y = placement?.y ?? 0;
  const dw = 120 + scale * 1.2;
  const dh = 130 + scale * 0.8;
  const dx = 200 - dw / 2;
  const dy = 160 + y * 0.8;

  return (
    <svg viewBox="0 0 400 480" className="mx-auto w-full max-w-[340px]">
      <defs>
        <filter id="shirtShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodOpacity="0.3" />
        </filter>
        <pattern id="fabric" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0 L6 6 M6 0 L0 6" stroke={isLight ? "#00000010" : "#FFFFFF10"} strokeWidth="0.5" />
        </pattern>
        <clipPath id="designClip">
          <rect x={dx} y={dy} width={dw} height={dh} rx="6" />
        </clipPath>
      </defs>

      <g filter="url(#shirtShadow)">
        <path
          d="M120,80 L90,95 40,130 55,180 85,165 85,420 315,420 315,165 345,180 360,130 310,95 280,80 260,75Q230,65 200,62 170,65 140,75Z"
          fill={color}
          stroke={border}
          strokeWidth="1"
        />
        <path
          d="M140,75Q170,90 200,93 230,90 260,75 245,70 230,68 215,82 200,84 185,82 170,68 155,70 140,75"
          fill={neckline}
          stroke={border}
          strokeWidth="0.6"
        />
        <path
          d="M90,170 C170,210 230,210 310,170 L310,420 L90,420 Z"
          fill="url(#fabric)"
          opacity="0.35"
        />
      </g>

      <line x1="85" y1="165" x2="120" y2="83" stroke={stitch} strokeWidth="1" strokeDasharray="4,3" />
      <line x1="315" y1="165" x2="280" y2="83" stroke={stitch} strokeWidth="1" strokeDasharray="4,3" />

      {design?.preview ? (
        <g clipPath="url(#designClip)" opacity={muted ? 0.86 : 1}>
          <image href={design.preview} x={dx} y={dy} width={dw} height={dh} preserveAspectRatio="xMidYMid meet" />
        </g>
      ) : (
        <text x="200" y="250" textAnchor="middle" fill={isLight ? "#8d8d8d" : "#6b7280"} fontSize="12">
          Your design appears here
        </text>
      )}
    </svg>
  );
}
