import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShirtMockup from "../components/ShirtMockup";
import { useThreadForge } from "../context/ThreadForgeContext";
import { PRINTFUL_PRODUCTS, SHIPPING_RATES } from "../data/printfulProducts";

export default function Customize() {
  const { selectedDesign, product, setProduct, placement } = useThreadForge();
  const navigate = useNavigate();
  const [printPreview, setPrintPreview] = useState(true);

  useEffect(() => {
    if (!selectedDesign) navigate("/studio");
  }, [selectedDesign, navigate]);

  if (!selectedDesign) return null;

  const selectedProduct = PRINTFUL_PRODUCTS.find((p) => p.id === product.printfulProduct) || PRINTFUL_PRODUCTS[0];
  const total = selectedProduct.basePrice + SHIPPING_RATES.standard.price;

  const handleSelectProduct = (prod) => {
    const firstColor = prod.colors[0];
    setProduct({
      ...product,
      printfulProduct: prod.id,
      shirtColor: firstColor.hex,
      shirtColorName: firstColor.name,
      shirtType: prod.name,
      size: prod.sizes.includes(product.size) ? product.size : "M",
    });
  };

  const handleSelectColor = (color) => {
    setProduct({ ...product, shirtColor: color.hex, shirtColorName: color.name });
  };

  const handleSelectSize = (size) => {
    setProduct({ ...product, size });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6">
      {/* Product Selector */}
      <section className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Choose your product</h1>
        <p className="mt-1 text-sm text-white/45">All shirts printed with DTG for vibrant, long-lasting designs</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRINTFUL_PRODUCTS.map((prod) => {
            const active = selectedProduct.id === prod.id;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleSelectProduct(prod)}
                className={`card group relative rounded-xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                  active ? "ring-1 ring-ember-400/50 border-ember-400/40" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/90">{prod.name}</p>
                    <p className="mt-0.5 text-[11px] text-white/45">{prod.subtitle}</p>
                  </div>
                  {prod.badge && (
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      prod.badge === "Best Seller" ? "bg-ember-500/15 text-ember-400" :
                      prod.badge === "Trending" ? "bg-amber-500/15 text-amber-400" :
                      prod.badge === "Premium" ? "bg-violet-500/15 text-violet-400" :
                      "bg-emerald-500/15 text-emerald-400"
                    }`}>
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {prod.colors.slice(0, 6).map((c) => (
                    <div
                      key={c.hex}
                      className="h-3.5 w-3.5 rounded-full border border-white/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  {prod.colors.length > 6 && (
                    <span className="text-[10px] text-white/30">+{prod.colors.length - 6}</span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-white/35">{prod.fabric}</span>
                  <span className="font-mono text-sm font-bold text-white/80">${prod.basePrice.toFixed(2)}</span>
                </div>

                {active && (
                  <div className="absolute right-3 top-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ember-500">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Configurator */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="card rounded-2xl p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
              <p className="text-sm text-white/45">{selectedProduct.description}</p>
            </div>
            <button
              type="button"
              onClick={() => setPrintPreview((prev) => !prev)}
              className={`rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                printPreview
                  ? "border-ember-400/30 bg-ember-500/10 text-ember-300"
                  : "border-white/[0.08] text-white/50 hover:border-white/15"
              }`}
            >
              {printPreview ? "Print preview on" : "Print preview off"}
            </button>
          </div>

          {/* Mockup */}
          <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-b from-coal-900/60 to-coal-900/30 p-6">
            <ShirtMockup
              color={product.shirtColor}
              design={selectedDesign}
              placement={placement}
              muted={printPreview}
            />
            {printPreview && (
              <p className="mt-3 text-center text-[11px] text-white/35">
                Simulating on-fabric muting &mdash; actual print will closely match.
              </p>
            )}
          </div>

          {/* Color Picker */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              Color &mdash; {product.shirtColorName || "Black"}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.colors.map((color) => {
                const active = product.shirtColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    className={`group relative h-10 w-10 rounded-full border-2 transition ${
                      active ? "border-white scale-110" : "border-white/15 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {active && (
                      <svg className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Picker */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Size</p>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.sizes.map((size) => {
                const active = size === product.size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSelectSize(size)}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-white/60 bg-white text-coal-950"
                        : "border-white/[0.08] text-white/60 hover:border-white/20"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product specs */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-white/[0.06] bg-coal-900/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Fabric</p>
              <p className="mt-1 text-xs text-white/65">{selectedProduct.fabric}</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-coal-900/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Weight</p>
              <p className="mt-1 text-xs text-white/65">{selectedProduct.weight}</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-coal-900/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">Fit</p>
              <p className="mt-1 text-xs text-white/65">{selectedProduct.fit}</p>
            </div>
          </div>
        </section>

        {/* Order Summary Sidebar */}
        <aside className="card h-fit rounded-2xl p-5 sm:p-6 lg:sticky lg:top-20">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-ember-400" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Order summary</p>
          </div>

          {/* Design preview */}
          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06] bg-coal-900/50">
            <img src={selectedDesign.preview} alt="Your design" className="aspect-square w-full object-cover" />
          </div>

          <h2 className="mt-4 text-lg font-bold">{selectedProduct.name}</h2>
          <p className="mt-0.5 text-sm text-white/45">
            {product.shirtColorName || "Black"} &middot; {product.size}
          </p>

          <div className="mt-5 space-y-2.5 text-sm">
            <div className="flex items-center justify-between text-white/70">
              <span>Product</span>
              <span className="font-mono">${selectedProduct.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-white/70">
              <span>{SHIPPING_RATES.standard.label}</span>
              <span className="font-mono">${SHIPPING_RATES.standard.price.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/[0.08] pt-3">
              <div className="flex items-center justify-between text-base font-bold">
                <span>Total</span>
                <span className="font-mono text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember-500/20 transition-all hover:shadow-ember-500/35 hover:brightness-110"
          >
            Continue to checkout
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <p className="mt-3 text-center text-[10px] text-white/30">
            Printed by Printful &middot; Ships from US/EU
          </p>
        </aside>
      </div>
    </main>
  );
}
