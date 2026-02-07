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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-coal-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6">
        <Link to="/" className="group inline-flex items-center">
          <img
            src="/logo-white.png"
            alt="ThreadForge"
            className="h-8 transition-opacity group-hover:opacity-80"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {STEP_PATHS.map((step, i) => {
            const active = location.pathname.startsWith(step.path);
            return (
              <Link
                key={step.path}
                to={step.path}
                className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                <span className="mr-1.5 font-mono text-[11px] text-white/30">0{i + 1}</span>
                {step.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/marketplace"
          className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
        >
          Browse Designs
        </Link>
      </div>
    </header>
  );
}

function LoadingFallback() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
      <div className="flex items-center gap-3 text-sm text-white/40">
        <svg className="h-5 w-5 animate-spin-slow" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Loading...
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-coal-950 text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(230,57,70,0.1),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(38,70,83,0.18),_transparent_50%)]" />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
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
