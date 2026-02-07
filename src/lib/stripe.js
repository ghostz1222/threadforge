import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");
  }
  return stripePromise;
}

export async function createCheckoutSession(payload) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Checkout session creation failed");
  }

  return response.json();
}

export async function redirectToCheckout(payload) {
  const { url } = await createCheckoutSession(payload);

  if (url) {
    window.location.href = url;
    return;
  }

  throw new Error("No checkout URL returned");
}
