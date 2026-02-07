import { Link, useParams } from "react-router-dom";
import { useThreadForge } from "../context/ThreadForgeContext";

const STATUSES = [
  ["Paid", "Stripe payment confirmed"],
  ["Prepared", "Print-ready file validated at 300 DPI"],
  ["Routed", "Order sent to Printful for production"],
  ["Shipped", "Tracking will be emailed when label is generated"],
];

export default function OrderStatus() {
  const { orderId } = useParams();
  const { activeOrder } = useThreadForge();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <section className="card rounded-2xl p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">Order confirmed</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Your shirt is in motion</h1>
        <p className="mt-2 text-sm text-white/70">Order ID: {orderId}</p>
        <p className="text-sm text-white/65">
          {activeOrder?.id === orderId
            ? `Total charged: $${activeOrder.total.toFixed(2)}`
            : "This order status is a live route shell. Connect Stripe webhooks and Printful sync for realtime updates."}
        </p>

        <div className="mt-6 space-y-3">
          {STATUSES.map(([title, body], index) => (
            <article key={title} className="rounded-xl border border-white/12 bg-coal-900/70 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full border border-emerald-300/40 bg-emerald-400/10 font-mono text-xs text-emerald-200">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-bold">{title}</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/studio"
            className="rounded-lg bg-ember-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-ember-400"
          >
            Design another
          </Link>
          <Link
            to="/marketplace"
            className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80"
          >
            Explore marketplace
          </Link>
        </div>
      </section>
    </main>
  );
}
