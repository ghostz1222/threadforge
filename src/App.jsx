import { Suspense, lazy } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";

const Studio = lazy(() => import("./pages/Studio"));
const Customize = lazy(() => import("./pages/Customize"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderStatus = lazy(() => import("./pages/OrderStatus"));
const Marketplace = lazy(() => import("./pages/Marketplace"));

const STEP_PATHS = [
  { label: "Create", path: "/studio" },
  { label: "Customize", path: "/customize" },
  { label: "Order", path: "/checkout" },
];

function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-coal-950/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-ember-500 to-brass font-bold text-coal-950">⬢</span>
          <span className="text-base font-extrabold tracking-tight">ThreadForge</span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs text-white/60 md:flex">
          {STEP_PATHS.map((step, i) => {
            const active = location.pathname.startsWith(step.path);
            return (
              <Link key={step.path} to={step.path} className={active ? "text-white" : "hover:text-white/90"}>
                <span className="font-mono">0{i + 1}</span> {step.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/marketplace"
          className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        >
          Browse Designs
        </Link>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-coal-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.18),_transparent_45%),radial-gradient(ellipse_at_bottom_left,_rgba(38,70,83,0.35),_transparent_48%)]" />
      <Header />
      <ErrorBoundary>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-10 text-sm text-white/60">Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/customize" element={<Customize />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </div>
  );
}
