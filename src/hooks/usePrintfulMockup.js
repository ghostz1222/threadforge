import { useEffect, useMemo, useState } from "react";

const CACHE = new Map();

export default function usePrintfulMockup({
  enabled,
  designUrl,
  printfulProductId,
  variantId,
  placement,
}) {
  const [state, setState] = useState({ mockupUrl: null, loading: false, error: null });

  const cacheKey = useMemo(() => {
    if (!enabled || !designUrl || !printfulProductId || !variantId) return null;
    return [
      printfulProductId,
      variantId,
      designUrl,
      Math.round(placement?.scale ?? 20),
      Math.round(placement?.y ?? 0),
    ].join("|");
  }, [enabled, designUrl, printfulProductId, variantId, placement?.scale, placement?.y]);

  useEffect(() => {
    if (!cacheKey) {
      setState({ mockupUrl: null, loading: false, error: null });
      return;
    }

    if (designUrl.startsWith("data:")) {
      setState({ mockupUrl: null, loading: false, error: "Local data URL is not usable for Printful mockups" });
      return;
    }

    if (CACHE.has(cacheKey)) {
      setState({ mockupUrl: CACHE.get(cacheKey), loading: false, error: null });
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch("/api/mockup-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            printfulProductId,
            variantId,
            designUrl,
            placement: {
              scale: Math.round(placement?.scale ?? 20),
              y: Math.round(placement?.y ?? 0),
            },
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error || "Could not generate product mockup");
        }

        const payload = await response.json();
        const mockupUrl = payload.mockupUrl || null;
        if (!mockupUrl) {
          throw new Error("Mockup API returned no image");
        }

        CACHE.set(cacheKey, mockupUrl);
        if (!cancelled) {
          setState({ mockupUrl, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ mockupUrl: null, loading: false, error: err.message || "Mockup request failed" });
        }
      }
    }, 650);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cacheKey, designUrl, enabled, printfulProductId, variantId, placement?.scale, placement?.y]);

  return state;
}
