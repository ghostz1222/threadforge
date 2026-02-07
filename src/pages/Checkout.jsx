import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { redirectToCheckout } from "../lib/stripe";
import { useThreadForge } from "../context/ThreadForgeContext";
import { PRICE_TABLE, SHIRT_COLORS } from "../data/constants";

export default function Checkout() {
  const { selectedDesign, product, checkoutDraft, setCheckoutDraft, setActiveOrder } = useThreadForge();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => PRICE_TABLE.base + PRICE_TABLE.shipping, []);
  const colorLabel = SHIRT_COLORS.find((c) => c.hex === product.shirtColor)?.label || "Black";

  useEffect(() => {
    if (!selectedDesign) {
      navigate("/studio");
    }
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
        designId: selectedDesign.id,
        designPreviewUrl: selectedDesign.preview,
      });
    } catch (checkoutError) {
      setError(checkoutError.message || "Checkout failed. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_340px]">
      <section className="card rounded-2xl p-5 sm:p-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-white/65">
          Guest checkout — no account required. Stripe handles payment securely.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/65">
              Email for order confirmation
            </label>
            <input
              type="email"
              value={checkoutDraft.email}
              onChange={(e) => setCheckoutDraft({ ...checkoutDraft, email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-white/15 bg-coal-900 px-3 py-2.5"
              placeholder="you@example.com"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-coal-900/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              What happens next
            </p>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">1.</span>
                You'll be redirected to Stripe's secure checkout
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">2.</span>
                Enter your shipping address and payment details
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-emerald-400">3.</span>
                Your custom tee is printed and shipped in 3-5 business days
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-coal-900/50 p-3 text-xs text-white/55">
            Accepts cards, Apple Pay, and Google Pay via Stripe. Shipping address collected at checkout.
          </div>

          {!!error && (
            <div className="rounded-lg border border-ember-500/30 bg-ember-500/10 p-3 text-sm text-ember-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={submitting}
            className="w-full rounded-lg bg-ember-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-ember-400 disabled:opacity-50"
          >
            {submitting ? "Redirecting to Stripe..." : `Proceed to payment — $${total.toFixed(2)}`}
          </button>
        </div>
      </section>

      <aside className="card h-fit rounded-2xl p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Order summary</p>
        <div className="mt-3 rounded-lg border border-white/10 bg-coal-900/65 p-3">
          <img
            src={selectedDesign.preview}
            alt="Your design"
            className="aspect-square w-full rounded-lg object-cover"
          />
        </div>
        <p className="mt-3 text-sm font-semibold text-white/90">Custom Design Tee</p>
        <p className="text-sm text-white/65">
          {product.shirtType} · {product.size} · {colorLabel}
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
          <div className="border-t border-white/15 pt-3 text-base font-bold">
            <div className="flex items-center justify-between">
              <span>Total</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
