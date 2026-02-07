import useTransparentDesign from "../hooks/useTransparentDesign";

/**
 * T-shirt mockup with client-side background removal.
 * The design image has its dark background removed via canvas thresholding,
 * then overlaid on a realistic SVG shirt with proper positioning.
 */
export default function ShirtMockup({ color, design, placement, muted = false }) {
  const processedDesign = useTransparentDesign(design?.preview);

  const scale = placement?.scale ?? 20;
  const y = placement?.y ?? 0;

  // Design positioning on the shirt (percentages of container)
  const designWidthPct = 32 + scale * 0.45;
  const designTopPct = 26 + y * 0.25;

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Realistic SVG shirt */}
      <ShirtSilhouette color={color} />

      {/* Design overlay — background already removed */}
      {processedDesign ? (
        <img
          src={processedDesign}
          alt="Your design"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${designWidthPct}%`,
            top: `${designTopPct}%`,
            opacity: muted ? 0.78 : 0.95,
            filter: muted ? "saturate(0.85) brightness(0.95)" : "none",
          }}
          draggable={false}
        />
      ) : design?.preview ? (
        <div
          className="absolute left-1/2 -translate-x-1/2 animate-pulse rounded-lg bg-white/[0.06]"
          style={{ width: `${designWidthPct}%`, top: `${designTopPct}%`, aspectRatio: "1" }}
        />
      ) : (
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 text-center text-[11px] text-white/25">
          Your design appears here
        </div>
      )}
    </div>
  );
}

/** Realistic SVG shirt with shading, seams, and fabric texture */
function ShirtSilhouette({ color }) {
  const isLight = isLightColor(color);
  const shadow = isLight ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.4)";
  const highlight = isLight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)";
  const fold = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.03)";
  const neckFill = isLight ? darken(color, 0.1) : lighten(color, 0.08);
  const stitch = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";

  return (
    <svg viewBox="0 0 400 500" className="w-full" style={{ filter: `drop-shadow(0 8px 24px ${shadow})` }}>
      {/* Main body */}
      <path
        d="M115,78 L85,95 30,135 48,190 82,172 82,440 318,440 318,172 352,190 370,135 315,95 285,78 262,72 Q232,60 200,58 168,60 138,72 Z"
        fill={color}
      />
      {/* Left shoulder highlight */}
      <path d="M115,78 L85,95 30,135 48,190 82,172 82,130 Z" fill={highlight} opacity="0.25" />
      {/* Right shoulder subtle highlight */}
      <path d="M285,78 L315,95 370,135 352,190 318,172 318,130 Z" fill={highlight} opacity="0.15" />
      {/* Lower body fold shadow */}
      <path d="M82,260 Q140,270 200,265 260,270 318,260 L318,440 L82,440 Z" fill={fold} />
      {/* Center fold crease */}
      <line x1="200" y1="100" x2="200" y2="440" stroke={fold} strokeWidth="1.5" opacity="0.5" />
      {/* Side seam shadows */}
      <line x1="82" y1="172" x2="82" y2="440" stroke={shadow} strokeWidth="1.2" opacity="0.2" />
      <line x1="318" y1="172" x2="318" y2="440" stroke={shadow} strokeWidth="1.2" opacity="0.12" />
      {/* Neckline */}
      <path
        d="M138,72 Q168,92 200,95 232,92 262,72 248,67 234,65 218,82 200,85 182,82 166,65 152,67 138,72"
        fill={neckFill}
      />
      <path d="M138,72 Q168,92 200,95 232,92 262,72" fill="none" stroke={stitch} strokeWidth="1" />
      {/* Sleeve stitching */}
      <line x1="82" y1="172" x2="115" y2="80" stroke={stitch} strokeWidth="0.7" strokeDasharray="3,4" />
      <line x1="318" y1="172" x2="285" y2="80" stroke={stitch} strokeWidth="0.7" strokeDasharray="3,4" />
      {/* Bottom hem */}
      <line x1="82" y1="436" x2="318" y2="436" stroke={stitch} strokeWidth="0.7" strokeDasharray="3,4" />
      {/* Subtle fabric crosshatch texture */}
      <defs>
        <pattern id="fabricTex" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M0 0L4 4M4 0L0 4" stroke={isLight ? "#00000006" : "#FFFFFF04"} strokeWidth="0.4" />
        </pattern>
      </defs>
      <path
        d="M82,172 L82,440 318,440 318,172 Q260,200 200,205 140,200 82,172Z"
        fill="url(#fabricTex)"
      />
    </svg>
  );
}

function isLightColor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}

function darken(hex, amt) {
  const c = hex.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(c.substring(0, 2), 16) * (1 - amt)));
  const g = Math.max(0, Math.round(parseInt(c.substring(2, 4), 16) * (1 - amt)));
  const b = Math.max(0, Math.round(parseInt(c.substring(4, 6), 16) * (1 - amt)));
  return `rgb(${r},${g},${b})`;
}

function lighten(hex, amt) {
  const c = hex.replace("#", "");
  const r = Math.min(255, Math.round(parseInt(c.substring(0, 2), 16) * (1 + amt)));
  const g = Math.min(255, Math.round(parseInt(c.substring(2, 4), 16) * (1 + amt)));
  const b = Math.min(255, Math.round(parseInt(c.substring(4, 6), 16) * (1 + amt)));
  return `rgb(${r},${g},${b})`;
}
