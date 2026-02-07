import useTransparentDesign from "../hooks/useTransparentDesign";
import { toOverlayPercentages } from "../lib/mockupPlacement";

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
  const overlay = toOverlayPercentages(placement);

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
          product={product}
          color={color}
          cutoutDesign={cutoutDesign}
          overlay={overlay}
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

function FallbackGarment({ product, color, cutoutDesign, overlay, muted }) {
  return (
    <div className="relative aspect-[4/5] w-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,rgba(15,20,26,0.9),rgba(10,13,17,0.95))]">
      {product?.image ? (
        <>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundColor: color || "#1A1A1A", opacity: 0.28, mixBlendMode: "multiply" }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-coal-900/70" />
      )}

      {cutoutDesign ? (
        <img
          src={cutoutDesign}
          alt="Placed design"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2"
          style={{
            width: `${overlay.widthPct}%`,
            top: `${overlay.topPct}%`,
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
