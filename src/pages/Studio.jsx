import { Suspense, lazy, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesignGrid from "../components/DesignGrid";
import StylePicker from "../components/StylePicker";
import ShirtMockup from "../components/ShirtMockup";
import ColorPicker from "../components/ColorPicker";
import GenCounter from "../components/GenCounter";
import { useThreadForge } from "../context/ThreadForgeContext";
import usePrintfulMockup from "../hooks/usePrintfulMockup";
import { PRINTFUL_PRODUCTS, getVariantForColor } from "../data/printfulProducts";
import { canGenerate } from "../lib/generationGate";
import { checkPromptForBlockedTerms, scanOutputForPolicyViolations } from "../lib/moderation";
import { generateExplorationDesigns, generateFinalDesign } from "../lib/generateDesign";
import { upscaleForPrint } from "../lib/upscale";

const PlacementEditor = lazy(() => import("../components/PlacementEditor"));

export default function Studio() {
  const {
    prompt,
    setPrompt,
    style,
    setStyle,
    designs,
    setDesigns,
    selectedDesign,
    setSelectedDesign,
    placement,
    setPlacement,
    generation,
    setGeneration,
    product,
    setProduct,
  } = useThreadForge();

  const navigate = useNavigate();
  const sessionId = useMemo(() => Math.random().toString(36).slice(2, 10), []);

  const [loading, setLoading] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState("");
  const [unlockEmail, setUnlockEmail] = useState("");
  const selectedProduct = PRINTFUL_PRODUCTS.find((p) => p.id === product.printfulProduct) || PRINTFUL_PRODUCTS[0];
  const selectedVariant = getVariantForColor(selectedProduct, product.shirtColor);
  const { mockupUrl, loading: loadingMockup, error: mockupError } = usePrintfulMockup({
    enabled: Boolean(selectedDesign?.preview && selectedVariant?.variantId),
    designUrl: selectedDesign?.preview,
    printfulProductId: selectedProduct.printfulProductId,
    variantId: selectedVariant?.variantId,
    placement,
  });

  const handleGenerate = async () => {
    const normalized = prompt.trim();
    if (!normalized) {
      setError("Describe your design first.");
      return;
    }

    const gate = canGenerate(generation);
    if (!gate.allowed) {
      setError(gate.reason);
      return;
    }

    const moderation = checkPromptForBlockedTerms(normalized);
    if (!moderation.allowed) {
      setError(moderation.reason);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await generateExplorationDesigns({
        prompt: normalized,
        style,
        count: 4,
        sessionId,
      });

      setDesigns(result.designs);
      setSelectedDesign(result.designs[0]);
      setGeneration((prev) => ({
        ...prev,
        used: prev.used + 1,
        lastAt: Date.now(),
      }));
    } catch (genError) {
      setError(genError.message || "Could not create designs. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedDesign) {
      setError("Pick a design variation first.");
      return;
    }

    setFinalizing(true);
    setError("");

    try {
      const finalResult = await generateFinalDesign({
        prompt,
        style,
        selectedId: selectedDesign.id,
      });

      const moderation = await scanOutputForPolicyViolations(finalResult.design.preview);
      if (!moderation.safe) {
        throw new Error("This design needs revision before ordering.");
      }

      const printSpec = await upscaleForPrint(finalResult.design);
      setSelectedDesign({ ...finalResult.design, printSpec });
      navigate("/customize");
    } catch (finalError) {
      setError(finalError.message || "Unable to prepare print-ready design.");
    } finally {
      setFinalizing(false);
    }
  };

  const handleUnlockWithEmail = () => {
    if (!unlockEmail.includes("@")) {
      setError("Enter a valid email to unlock more designs.");
      return;
    }
    setGeneration((prev) => ({ ...prev, emailUnlocked: true }));
    setError("");
  };

  const handleSelectColor = (color) => {
    if (!color?.hex) return;
    setProduct({
      ...product,
      shirtColor: color.hex,
      shirtColorName: color.name || product.shirtColorName,
      variantId: color.variantId || selectedVariant?.variantId || product.variantId,
    });
  };

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-8 sm:px-6 lg:grid-cols-[400px_1fr]">
      {/* Left Panel */}
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Design Studio</p>
        </div>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-white/60">
          Describe your design
        </label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="A wolf howling at a neon moon with geometric mountains..."
          className="mt-2 h-28 w-full resize-none rounded-xl border border-white/[0.08] bg-coal-900/60 px-4 py-3 text-sm text-white placeholder:text-white/25 transition focus:border-white/20 focus:bg-coal-900"
        />

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-white/60">
          Style preset
        </label>
        <div className="mt-2">
          <StylePicker value={style} onChange={setStyle} />
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-ember-500/20 transition-all hover:shadow-ember-500/35 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Creating 4 variations...
              </span>
            ) : (
              "Create designs"
            )}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !designs.length}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-white/15 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
          >
            Remix 4 more
          </button>
        </div>

        <div className="mt-5">
          <GenCounter used={generation.used} limit={generation.freeLimit} emailUnlocked={generation.emailUnlocked} />
        </div>

        {!generation.emailUnlocked && generation.used >= generation.freeLimit && (
          <div className="mt-4 rounded-xl border border-ember-400/20 bg-ember-500/[0.06] p-4">
            <p className="text-xs text-white/70">Save your favorites to keep creating.</p>
            <div className="mt-2.5 flex gap-2">
              <input
                value={unlockEmail}
                onChange={(event) => setUnlockEmail(event.target.value)}
                placeholder="email@domain.com"
                className="w-full rounded-lg border border-white/[0.08] bg-coal-900 px-3 py-2 text-sm transition focus:border-white/20"
              />
              <button
                type="button"
                onClick={handleUnlockWithEmail}
                className="shrink-0 rounded-lg bg-white px-4 text-xs font-bold text-coal-950 transition hover:bg-white/90"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {!!error && (
          <div className="mt-4 rounded-xl border border-ember-500/20 bg-ember-500/[0.06] px-4 py-3">
            <p className="text-sm text-ember-300">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">Pick your favorite</p>
          <DesignGrid designs={designs} selectedId={selectedDesign?.id} onSelect={setSelectedDesign} loading={loading} />
        </div>
      </section>

      {/* Right Panel */}
      <section className="space-y-5">
        <div className="card rounded-2xl p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="rounded-xl border border-white/[0.06] bg-coal-900/50 p-5">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Live mockup</p>
              <ShirtMockup
                color={product.shirtColor}
                design={selectedDesign}
                placement={placement}
                product={selectedProduct}
                realMockupUrl={mockupUrl}
                loadingRealMockup={loadingMockup}
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <ColorPicker
                  value={product.shirtColor}
                  colors={selectedProduct.colors}
                  onChange={handleSelectColor}
                />
                <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] font-medium text-white/30">Front only</span>
              </div>
              {!mockupUrl && mockupError && (
                <p className="mt-3 text-center text-[11px] text-amber-300/80">
                  Live Printful mockup unavailable: using composited preview.
                </p>
              )}
            </div>
            <Suspense fallback={<div className="skeleton h-[340px] rounded-xl" />}>
              <PlacementEditor design={selectedDesign} value={placement} onChange={setPlacement} />
            </Suspense>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedDesign || finalizing}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-6 py-3.5 text-sm font-semibold transition-all hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {finalizing ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Preparing print-ready design...
              </span>
            ) : (
              <>
                Continue to customize
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
