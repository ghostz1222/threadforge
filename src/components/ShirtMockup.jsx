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

  const baseImage = product?.image;
  const placementSpec = product?.mockupPlacement || { x: 50, y: 48, width: 32, maxWidth: 46 };
  const scale = placement?.scale ?? 20;
  const y = placement?.y ?? 0;
  const designWidth = clamp(placementSpec.width + scale * 0.22, 16, placementSpec.maxWidth || 46);
  const designTop = clamp(placementSpec.y + y * 0.14, 18, 72);

  const colorTint = getColorTint(product, color);

  return (
    <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-xl border border-white/[0.08] bg-coal-950/55">
      {realMockupUrl ? (
        <img
          src={realMockupUrl}
          alt="Real product mockup"
          className="block w-full object-cover"
          draggable={false}
        />
      ) : baseImage ? (
        <div className="relative">
          <img
            src={baseImage}
            alt={product?.name || "Product mockup"}
            className="block w-full object-cover"
            draggable={false}
          />

          {/* Optional color tint to better approximate selected garment color */}
          {colorTint && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundColor: color,
                mixBlendMode: "multiply",
                opacity: colorTint,
              }}
            />
          )}

          {cutoutDesign && (
            <img
              src={cutoutDesign}
              alt="Placed design"
              className="pointer-events-none absolute left-1/2 -translate-x-1/2"
              style={{
                width: `${designWidth}%`,
                top: `${designTop}%`,
                opacity: muted ? 0.86 : 0.97,
                filter: muted ? "saturate(0.85) brightness(0.95)" : "drop-shadow(0 2px 5px rgba(0,0,0,0.28))",
                transform: "translateX(-50%) perspective(700px) rotateX(1deg)",
                transformOrigin: "center center",
              }}
              draggable={false}
            />
          )}

          {/* Shirt depth layer so the print looks embedded, not floating */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15" />
        </div>
      ) : (
        <div className="grid aspect-[4/5] place-items-center bg-coal-900/70 text-xs text-white/35">
          Product mockup unavailable
        </div>
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

function getColorTint(product, selectedHex) {
  const baseHex =
    product?.colors?.find((c) => c.name === product.imageColorName)?.hex ||
    product?.colors?.[0]?.hex ||
    null;

  if (!baseHex || !selectedHex) return 0;
  const distance = colorDistance(baseHex, selectedHex);
  if (distance < 45) return 0;
  if (distance < 95) return 0.12;
  return 0.2;
}

function colorDistance(aHex, bHex) {
  const a = parseHex(aHex);
  const b = parseHex(bHex);
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function parseHex(hex) {
  const c = (hex || "#000000").replace("#", "");
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
