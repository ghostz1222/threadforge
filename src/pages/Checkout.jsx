import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { redirectToCheckout } from "../lib/stripe";
import { useThreadForge } from "../context/ThreadForgeContext";
import { PRINTFUL_PRODUCTS, SHIPPING_RATES } from "../data/printfulProducts";

export default function Checkout() {
  const { selectedDesign, product, checkoutDraft, setCheckoutDraft, setActiveOrder } = useThreadForge();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedProduct = useMemo(
    () => PRINTFUL_PRODUCTS.find((p) => p.id === product.printfulProduct) || PRINTFUL_PRODUCTS[0],
    [product.printfulProduct]
  );
  const total = useMemo(() => selectedProduct.basePrice + SHIPPING_RATES.standard.price, [selectedProduct]);
  const colorLabel = product.shirtColorName || "Black";

  useEffect(() => {
    if (!selectedDesign) navigate("/studio");
  }, [selectedDesign, navigate]);

  if (!selectedDesign) return null;

  const handleCheckout = async () => {
    if (!checkoutDraft.email) {
      setError("Enter your email to continue.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await redirectToCheckout({
        email: checkoutDraft.email,
        product,
        productName: selectedProduct.name,
        productSubtitle: selectedProduct.subtitle,
        basePrice: selectedProduct.basePrice,
        shippingPrice: SHIPPING_RATES.standard.price,
        designId: selectedDesign.id,
        designPreviewUrl: selectedDesign.preview,
      });
    } catch (checkoutError) {
      setError(checkoutError.message || "Checkout failed. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-5 px-5 py-8 sm:px-6 lg:grid-cols-[1fr_320px]">
      <section className="card rounded-2xl p-5 sm:p-7">
        <h1 className="text-2xl font-extrabold tracking-tight">Checkout</h1>
        <p className="mt-1.5 text-sm text-white/45">Guest checkout &mdash; no account required.</p>

        <div className="mt-7 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/55">Email for order confirmation</label>
            <input
              type="email"
              value={checkoutDraft.email}
              onChange={(e) => setCheckoutDraft({ ...checkoutDraft, email: e.target.value })}
              className="mt-2 w-full rounded-xl border border-white/[0.08] bg-coal-900/60 px-4 py-3 text-sm transition focus:border-white/20 focus:bg-coal-900"
              placeholder="you@example.com"
            />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-coal-900/40 p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">What happens next</p>
            <ul className="mt-4 space-y-3">
              {["Redirected to Stripe's secure checkout", "Enter shipping address and payment details", "Custom tee printed and shipped in 3-5 business days"].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/65">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ember-500/15 text-[10px] font-bold text-ember-400">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-coal-900/30 px-4 py-3">
            <svg className="h-4 w-4 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-[11px] text-white/40">Accepts cards, Apple Pay, and Google Pay via Stripe.</p>
          </div>

          {!!error && (
            <div className="rounded-xl border border-ember-500/20 bg-ember-500/[0.06] px-4 py-3">
              <p className="text-sm text-ember-300">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-ember-500/20 transition-all hover:shadow-ember-500/35 hover:brightness-110 disabled:opacity-50 disabled:shadow-none"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Redirecting to Stripe...
              </span>
            ) : (
              `Proceed to payment — $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </section>

      <aside className="card h-fit rounded-2xl p-5 sm:p-6 lg:sticky lg:top-20">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Your order</p>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.06] bg-coal-900/50">
          <img src={selectedDesign.preview} alt="Your design" className="aspect-square w-full object-cover" />
        </div>
        <p className="mt-4 font-semibold text-white/90">{selectedProduct.name}</p>
        <p className="mt-0.5 text-sm text-white/45">{selectedProduct.subtitle} &middot; {product.size} &middot; {colorLabel}</p>
        <div className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-white/65">
            <span>Product</span>
            <span className="font-mono">${selectedProduct.basePrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-white/65">
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
      </aside>
    </main>
  );
}
