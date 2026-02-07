import { Suspense, lazy, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesignGrid from "../components/DesignGrid";
import StylePicker from "../components/StylePicker";
import ShirtMockup from "../components/ShirtMockup";
import ColorPicker from "../components/ColorPicker";
import GenCounter from "../components/GenCounter";
import { useThreadForge } from "../context/ThreadForgeContext";
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
      setError("Enter a valid email to unlock more generations.");
      return;
    }

    setGeneration((prev) => ({ ...prev, emailUnlocked: true }));
    setError("");
  };

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr]">
      <section className="card rounded-2xl p-4 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Design studio</p>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-white/70">Describe your design</label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="A wolf howling at a neon moon with geometric mountains..."
          className="mt-2 h-28 w-full rounded-xl border border-white/15 bg-coal-800 px-3 py-3 text-sm text-white placeholder:text-white/35"
        />

        <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-white/70">Style preset</label>
        <div className="mt-2">
          <StylePicker value={style} onChange={setStyle} />
        </div>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-ember-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating 4 variations..." : "Create designs"}
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !designs.length}
            className="w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Remix 4 more
          </button>
        </div>

        <div className="mt-4">
          <GenCounter
            used={generation.used}
            limit={generation.freeLimit}
            emailUnlocked={generation.emailUnlocked}
          />
        </div>

        {!generation.emailUnlocked && generation.used >= generation.freeLimit && (
          <div className="mt-4 rounded-lg border border-ember-400/40 bg-ember-500/10 p-3">
            <p className="text-xs text-white/80">Save your favorites to keep creating.</p>
            <div className="mt-2 flex gap-2">
              <input
                value={unlockEmail}
                onChange={(event) => setUnlockEmail(event.target.value)}
                placeholder="email@domain.com"
                className="w-full rounded-md border border-white/20 bg-coal-900 px-2 py-2 text-sm"
              />
              <button
                type="button"
                onClick={handleUnlockWithEmail}
                className="rounded-md bg-white px-3 text-xs font-bold text-coal-950"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {!!error && <p className="mt-3 text-sm text-ember-300">{error}</p>}

        <div className="mt-5">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Pick your favorite</p>
          <DesignGrid
            designs={designs}
            selectedId={selectedDesign?.id}
            onSelect={setSelectedDesign}
          />
        </div>
      </section>

      <section className="card rounded-2xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-white/10 bg-coal-900/70 p-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Live mockup</p>
            <ShirtMockup color={product.shirtColor} design={selectedDesign} placement={placement} />
            <div className="mt-4 flex items-center justify-between gap-4">
              <ColorPicker
                value={product.shirtColor}
                onChange={(shirtColor) => setProduct({ ...product, shirtColor })}
              />
              <button
                type="button"
                className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/60"
                disabled
              >
                Front (Back in Phase 2)
              </button>
            </div>
          </div>

          <Suspense
            fallback={<div className="rounded-xl border border-white/10 bg-coal-900 p-3 text-sm text-white/60">Loading placement editor...</div>}
          >
            <PlacementEditor design={selectedDesign} value={placement} onChange={setPlacement} />
          </Suspense>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedDesign || finalizing}
            className="rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold transition hover:border-white/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {finalizing ? "Preparing print-ready design..." : "Continue to customize →"}
          </button>
        </div>
      </section>
    </main>
  );
}
