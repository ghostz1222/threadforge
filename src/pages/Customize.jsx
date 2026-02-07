import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShirtMockup from "../components/ShirtMockup";
import SizePicker from "../components/SizePicker";
import ColorPicker from "../components/ColorPicker";
import { SHIRT_TYPES, PRICE_TABLE } from "../data/constants";
import { useThreadForge } from "../context/ThreadForgeContext";

export default function Customize() {
  const { selectedDesign, product, setProduct, placement } = useThreadForge();
  const navigate = useNavigate();
  const [printPreview, setPrintPreview] = useState(true);

  useEffect(() => {
    if (!selectedDesign) {
      navigate("/studio");
    }
  }, [selectedDesign, navigate]);

  if (!selectedDesign) {
    return null;
  }

  const total = PRICE_TABLE.base + PRICE_TABLE.shipping;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Product configuration</h1>
          <button
            type="button"
            onClick={() => setPrintPreview((prev) => !prev)}
            className="rounded-md border border-white/20 px-3 py-2 text-xs font-semibold text-white/80"
          >
            {printPreview ? "Print preview on" : "Print preview off"}
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-coal-900/70 p-4">
          <ShirtMockup
            color={product.shirtColor}
            design={selectedDesign}
            placement={placement}
            muted={printPreview}
          />
          <p className="mt-2 text-center text-xs text-white/55">
            Print preview applies a muted simulation so on-fabric output matches expectation.
          </p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Shirt style</p>
            <div className="flex flex-wrap gap-2">
              {SHIRT_TYPES.map((type) => {
                const active = type === product.shirtType;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProduct({ ...product, shirtType: type })}
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-white bg-white text-coal-950"
                        : "border-white/20 text-white/75 hover:border-white/45"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Size</p>
            <SizePicker value={product.size} onChange={(size) => setProduct({ ...product, size })} />
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Color</p>
            <ColorPicker
              value={product.shirtColor}
              onChange={(shirtColor) => setProduct({ ...product, shirtColor })}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-coal-900/70 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Print quality</p>
            <p className="mt-2 text-sm text-white/70">
              Resolution: {selectedDesign.printSpec?.width || 4500}x{selectedDesign.printSpec?.height || 5400} at {selectedDesign.printSpec?.dpi || 300} DPI.
            </p>
            <p className="mt-1 text-xs text-white/50">
              CMYK-safe validation and contrast checks are run before routing to fulfillment.
            </p>
          </div>
        </div>
      </section>

      <aside className="card h-fit rounded-2xl p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Order summary</p>
        <h2 className="mt-3 text-xl font-bold">Custom Design Tee</h2>
        <p className="text-sm text-white/65">
          {product.shirtType} • {product.size}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-white/80">
            <span>Product</span>
            <span>${PRICE_TABLE.base.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-white/80">
            <span>Shipping</span>
            <span>${PRICE_TABLE.shipping.toFixed(2)}</span>
          </div>
          <div className="mt-3 border-t border-white/15 pt-3 text-base font-bold">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="mt-5 w-full rounded-lg bg-ember-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-ember-400"
        >
          Continue to checkout
        </button>
      </aside>
    </main>
  );
}
