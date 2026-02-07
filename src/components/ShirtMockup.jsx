import useTransparentDesign from "../hooks/useTransparentDesign";

export default function ShirtMockup({
  color,
  design,
  placement,
  product,
  muted = false,
  realMockupUrl,
  loadingRealMockup = false,
}) {
  const cutoutDesign = useTransparentDesign(design?.preview);
  const placementSpec = product?.mockupPlacement || { x: 50, y: 48, width: 32, maxWidth: 46 };
  const scale = placement?.scale ?? 20;
  const y = placement?.y ?? 0;
  const designWidth = clamp(placementSpec.width + scale * 0.22, 16, placementSpec.maxWidth || 46);
  const designTop = clamp(placementSpec.y + y * 0.14, 18, 72);

  return (
    <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-white/[0.08] bg-coal-950/55">
      {realMockupUrl ? (
        <img
          src={realMockupUrl}
          alt="Real product mockup"
          className="block w-full object-cover"
          draggable={false}
        />
      ) : (
        <FallbackGarment
          color={color}
          cutoutDesign={cutoutDesign}
          designWidth={designWidth}
          designTop={designTop}
          muted={muted}
        />
      )}

      {loadingRealMockup && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-coal-950/50 backdrop-blur-[1px]">
          <div className="rounded-lg border border-white/15 bg-coal-900/90 px-3 py-2 text-xs text-white/75">
            Rendering real mockup...
          </div>
        </div>
      )}
    </div>
  );
}

function FallbackGarment({ color, cutoutDesign, designWidth, designTop, muted }) {
  return (
    <div className="relative aspect-[4/5] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(15,20,26,0.9),rgba(10,13,17,0.95))]">
      <svg viewBox="0 0 400 500" className="h-full w-full">
        <path
          d="M115,78 L85,95 30,135 48,190 82,172 82,440 318,440 318,172 352,190 370,135 315,95 285,78 262,72 Q232,60 200,58 168,60 138,72 Z"
          fill={color || "#1A1A1A"}
        />
        <path
          d="M138,72 Q168,92 200,95 232,92 262,72 248,67 234,65 218,82 200,85 182,82 166,65 152,67 138,72"
          fill="rgba(0,0,0,0.25)"
        />
        <path
          d="M82,260 Q140,270 200,265 260,270 318,260 L318,440 L82,440 Z"
          fill="rgba(0,0,0,0.12)"
        />
      </svg>
      {cutoutDesign ? (
        <img
          src={cutoutDesign}
          alt="Placed design"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${designWidth}%`,
            top: `${designTop}%`,
            opacity: muted ? 0.86 : 0.97,
            filter: muted ? "saturate(0.85) brightness(0.95)" : "drop-shadow(0 2px 5px rgba(0,0,0,0.28))",
          }}
          draggable={false}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-white/35">
          Product mockup unavailable
        </div>
      )}
    </div>
  );
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
