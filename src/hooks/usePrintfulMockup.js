import { useEffect, useMemo, useState } from "react";

const CACHE = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;
const MIN_REQUEST_GAP_MS = 2500;
let lastRequestAt = 0;
let rateLimitUntil = 0;

function getCachedValue(key) {
  const hit = CACHE.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > CACHE_TTL_MS) {
    CACHE.delete(key);
    return null;
  }
  return hit.url;
}

function parseRetrySeconds(message) {
  const m = String(message || "").match(/after\\s+(\\d+)\\s+seconds/i);
  return m ? Number(m[1]) : null;
}

export default function usePrintfulMockup({
  enabled,
  designUrl,
  printfulProductId,
  variantId,
  placement,
}) {
  const [state, setState] = useState({ mockupUrl: null, loading: false, error: null, key: null });

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
      setState({ mockupUrl: null, loading: false, error: null, key: null });
      return;
    }

    if (designUrl.startsWith("data:")) {
      setState({ mockupUrl: null, loading: false, error: "Local data URL is not usable for Printful mockups", key: cacheKey });
      return;
    }

    const cached = getCachedValue(cacheKey);
    if (cached) {
      setState({ mockupUrl: cached, loading: false, error: null, key: cacheKey });
      return;
    }

    setState((prev) => ({
      mockupUrl: prev.key === cacheKey ? prev.mockupUrl : null,
      loading: true,
      error: null,
      key: cacheKey,
    }));

    let cancelled = false;
    const timer = setTimeout(async () => {
      if (Date.now() < rateLimitUntil) {
        const waitSeconds = Math.ceil((rateLimitUntil - Date.now()) / 1000);
        setState({
          mockupUrl: null,
          loading: false,
          error: `Mockup API cooling down, retrying in ~${waitSeconds}s`,
          key: cacheKey,
        });
        return;
      }

      const gap = Date.now() - lastRequestAt;
      if (gap < MIN_REQUEST_GAP_MS) {
        await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_GAP_MS - gap));
      }

      if (cancelled) return;
      lastRequestAt = Date.now();

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

        CACHE.set(cacheKey, { url: mockupUrl, ts: Date.now() });
        if (!cancelled) {
          setState({ mockupUrl, loading: false, error: null, key: cacheKey });
        }
      } catch (err) {
        const retrySeconds = parseRetrySeconds(err?.message);
        if (retrySeconds) {
          rateLimitUntil = Date.now() + retrySeconds * 1000;
        }

        if (!cancelled) {
          setState((prev) => ({
            mockupUrl: prev.key === cacheKey ? prev.mockupUrl : null,
            loading: false,
            error: err.message || "Mockup request failed",
            key: cacheKey,
          }));
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
