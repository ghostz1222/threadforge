import { toPrintfulPosition } from "../lib/mockupPlacement";

const PRINTFUL_BASE = "https://api.printful.com";

function extractMockupUrl(payload) {
  if (!payload?.result) return null;

  const mockups = payload.result.mockups;
  if (Array.isArray(mockups) && mockups.length > 0) {
    const first = mockups[0];
    if (first.mockup_url) return first.mockup_url;
    if (first.image_url) return first.image_url;
    if (Array.isArray(first.extra) && first.extra[0]?.url) return first.extra[0].url;
    if (Array.isArray(first.mockup_url_variants) && first.mockup_url_variants[0]?.url) {
      return first.mockup_url_variants[0].url;
    }
  }

  return payload.result.mockup_url || null;
}

function variantIdFromNode(node) {
  const raw = node?.id ?? node?.variant_id ?? node?.catalog_variant_id ?? node?.sync_variant_id;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

async function printfulRequest(path, options = {}) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_KEY is not configured");
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const storeId = process.env.PRINTFUL_STORE_ID;
  if (storeId) {
    headers["X-PF-Store-Id"] = storeId;
  }

  const response = await fetch(`${PRINTFUL_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = payload?.error?.message || payload?.result || payload?.error || "Printful request failed";
    const err = new Error(typeof msg === "string" ? msg : "Printful request failed");
    err.statusCode = response.status;
    throw err;
  }

  return payload;
}

async function resolveVariantId(printfulProductId, requestedVariantId) {
  const requested = Number(requestedVariantId);
  const safeRequested = Number.isFinite(requested) ? requested : null;

  try {
    const payload = await printfulRequest(`/products/${printfulProductId}`);
    const variants = payload?.result?.variants || [];
    const variantIds = variants.map(variantIdFromNode).filter((id) => Number.isFinite(id));

    if (!safeRequested) return null;
    if (variantIds.length === 0) return safeRequested;
    return variantIds.includes(safeRequested) ? safeRequested : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { printfulProductId, variantId, designUrl, placement } = req.body || {};

  if (!printfulProductId || !variantId || !designUrl) {
    return res.status(400).json({ error: "printfulProductId, variantId, and designUrl are required" });
  }

  if (typeof designUrl !== "string" || designUrl.startsWith("data:")) {
    return res.status(400).json({ error: "designUrl must be a public image URL" });
  }

  try {
    const position = toPrintfulPosition(placement);
    const resolvedVariantId = await resolveVariantId(printfulProductId, variantId);
    if (!resolvedVariantId) {
      return res.status(422).json({ error: "No valid variant ID available for this product" });
    }

    const taskResponse = await printfulRequest(`/mockup-generator/create-task/${printfulProductId}`, {
      method: "POST",
      body: JSON.stringify({
        variant_ids: [resolvedVariantId],
        format: "jpg",
        files: [
          {
            placement: "front",
            image_url: designUrl,
            position,
          },
        ],
      }),
    });

    const taskKey = taskResponse?.result?.task_key;
    if (!taskKey) {
      return res.status(502).json({ error: "Printful did not return a task key" });
    }

    let mockupUrl = null;
    for (let i = 0; i < 18; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const statusPayload = await printfulRequest(`/mockup-generator/task?task_key=${encodeURIComponent(taskKey)}`);

      const status = statusPayload?.result?.status;
      if (status === "completed") {
        mockupUrl = extractMockupUrl(statusPayload);
        break;
      }

      if (status === "failed") {
        const reason = statusPayload?.result?.error || "Printful mockup task failed";
        return res.status(502).json({ error: reason, taskKey });
      }
    }

    if (!mockupUrl) {
      return res.status(504).json({ error: "Mockup generation timed out", taskKey });
    }

    return res.status(200).json({ mockupUrl, taskKey, variantId: resolvedVariantId });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
      error: err.message || "Failed to generate mockup",
    });
  }
}
