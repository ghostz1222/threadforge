import { useId } from "react";

export default function ShirtMockup({ color, design, placement, muted = false }) {
  const uid = useId().replace(/:/g, "");
  const isLight = isLightColor(color);
  const border = isLight ? "#D8D8D0" : "#2A313A";
  const neckline = isLight ? "#E5E5DE" : "#12161B";
  const stitch = isLight ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)";

  const scale = placement?.scale ?? 20;
  const y = placement?.y ?? 0;
  const dw = 120 + scale * 1.2;
  const dh = 130 + scale * 0.8;
  const dx = 200 - dw / 2;
  const dy = 160 + y * 0.8;

  // Shirt body path — used for both rendering and clipping
  const shirtBody =
    "M120,80 L90,95 40,130 55,180 85,165 85,420 315,420 315,165 345,180 360,130 310,95 280,80 260,75Q230,65 200,62 170,65 140,75Z";

  return (
    <svg viewBox="0 0 400 480" className="mx-auto w-full max-w-[340px]">
      <defs>
        <filter id={`shadow-${uid}`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" floodOpacity="0.3" />
        </filter>
        <pattern id={`fabric-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0 L6 6 M6 0 L0 6" stroke={isLight ? "#00000010" : "#FFFFFF10"} strokeWidth="0.5" />
        </pattern>
        {/* Clip design to the shirt body shape — no more rectangle */}
        <clipPath id={`shirtClip-${uid}`}>
          <path d={shirtBody} />
        </clipPath>
      </defs>

      {/* Shirt body */}
      <g filter={`url(#shadow-${uid})`}>
        <path d={shirtBody} fill={color} stroke={border} strokeWidth="1" />
        <path
          d="M140,75Q170,90 200,93 230,90 260,75 245,70 230,68 215,82 200,84 185,82 170,68 155,70 140,75"
          fill={neckline}
          stroke={border}
          strokeWidth="0.6"
        />
        <path
          d="M90,170 C170,210 230,210 310,170 L310,420 L90,420 Z"
          fill={`url(#fabric-${uid})`}
          opacity="0.35"
        />
      </g>

      {/* Stitching lines */}
      <line x1="85" y1="165" x2="120" y2="83" stroke={stitch} strokeWidth="1" strokeDasharray="4,3" />
      <line x1="315" y1="165" x2="280" y2="83" stroke={stitch} strokeWidth="1" strokeDasharray="4,3" />

      {/* Design overlay — blended onto the shirt using screen mode */}
      {design?.preview ? (
        <g clipPath={`url(#shirtClip-${uid})`}>
          <image
            href={design.preview}
            x={dx}
            y={dy}
            width={dw}
            height={dh}
            preserveAspectRatio="xMidYMid meet"
            style={{
              mixBlendMode: "screen",
              opacity: muted ? 0.82 : 0.95,
            }}
          />
          {/* Subtle multiply layer for light shirts to add depth */}
          {isLight && (
            <image
              href={design.preview}
              x={dx}
              y={dy}
              width={dw}
              height={dh}
              preserveAspectRatio="xMidYMid meet"
              style={{
                mixBlendMode: "multiply",
                opacity: 0.3,
              }}
            />
          )}
        </g>
      ) : (
        <text x="200" y="250" textAnchor="middle" fill={isLight ? "#8d8d8d" : "#6b7280"} fontSize="12">
          Your design appears here
        </text>
      )}

      {/* Fabric texture overlay on top of design for realism */}
      <g clipPath={`url(#shirtClip-${uid})`} style={{ mixBlendMode: "overlay", opacity: 0.08 }}>
        <path
          d="M90,170 C170,210 230,210 310,170 L310,420 L90,420 Z"
          fill={`url(#fabric-${uid})`}
        />
      </g>
    </svg>
  );
}

function isLightColor(hex) {
  // Parse hex and check perceived brightness
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Perceived luminance formula
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}
