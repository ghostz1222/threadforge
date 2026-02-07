const STYLE_TEMPLATES = {
  minimal:
    "minimalist t-shirt graphic illustration, single clear subject, clean geometry, bold contrast, crisp edges, no surrounding scenery, print-focused composition",
  vintage:
    "vintage t-shirt illustration, retro palette, distressed detail, balanced composition, clear silhouette, designed for garment print",
  streetwear:
    "streetwear t-shirt graphic, bold linework, high contrast, punchy color blocks, strong central composition, print-ready edge clarity",
  watercolor:
    "watercolor t-shirt artwork, painterly color blending, soft texture with defined subject silhouette, clean subject isolation for print",
  illustrated:
    "detailed illustrated t-shirt art, hand-drawn line quality, layered shading, strong subject readability, clean print-ready edges",
  photographic:
    "photographic-style t-shirt graphic, dramatic subject lighting, high subject separation, print-optimized contrast and readability",
};

const NEGATIVE_PROMPT =
  "plain background, solid background, black background, white background, backdrop, frame, border, poster layout, mockup, t-shirt photo, watermark, logo, text block, UI elements";

const BLOCKED_TERMS = [
  "nike", "adidas", "supreme", "gucci", "chanel", "louis vuitton", "prada",
  "balenciaga", "versace", "dior", "hermes", "burberry", "fendi", "yeezy",
  "jordan", "new balance", "puma", "reebok", "under armour", "coca cola",
  "pepsi", "mcdonald", "starbucks", "apple logo", "google logo", "amazon logo",
  "disney", "mickey mouse", "minnie mouse", "donald duck", "goofy",
  "marvel", "spider-man", "spiderman", "batman", "superman", "wonder woman",
  "avengers", "iron man", "captain america", "thor marvel", "hulk marvel",
  "pokemon", "pikachu", "charizard", "naruto", "goku", "dragon ball",
  "one piece", "mario", "luigi", "zelda", "sonic the hedgehog",
  "star wars", "harry potter", "lord of the rings", "game of thrones",
  "taylor swift", "beyonce", "drake", "kanye", "travis scott",
  "elon musk", "trump", "biden", "obama",
  "porn", "nude", "nsfw", "naked", "xxx", "hentai", "sex",
  "hate", "nazi", "swastika", "kkk",
];

function checkBlocklist(prompt) {
  const normalized = prompt.toLowerCase();
  const hit = BLOCKED_TERMS.find((term) => normalized.includes(term));
  if (hit) {
    return {
      allowed: false,
      reason:
        "We can't create designs based on trademarked or copyrighted material. Try describing your own original idea!",
    };
  }
  return { allowed: true };
}

async function rateLimitCheck(ip, redisUrl, redisToken) {
  if (!redisUrl || !redisToken) return { allowed: true };

  try {
    const key = `ratelimit:${ip}`;
    const res = await fetch(`${redisUrl}/get/${key}`, {
      headers: { Authorization: `Bearer ${redisToken}` },
    });
    const data = await res.json();
    const lastTime = parseInt(data.result || "0", 10);
    const now = Date.now();

    if (lastTime && now - lastTime < 5000) {
      return { allowed: false, reason: "Slow down a bit. You can create a new set every 5 seconds." };
    }

    await fetch(`${redisUrl}/set/${key}/${now}/ex/10`, {
      headers: { Authorization: `Bearer ${redisToken}` },
    });

    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

function extractFalImageUrl(payload) {
  return (
    payload?.image?.url ||
    payload?.image_url ||
    payload?.images?.[0]?.url ||
    payload?.result?.image?.url ||
    payload?.result?.images?.[0]?.url ||
    null
  );
}

async function pollFalQueue(model, requestId, falKey) {
  for (let i = 0; i < 70; i += 1) {
    await new Promise((r) => setTimeout(r, 1800));

    const statusRes = await fetch(`https://queue.fal.run/${model}/requests/${requestId}/status`, {
      headers: { Authorization: `Key ${falKey}` },
    });
    const statusPayload = await statusRes.json().catch(() => ({}));

    if (statusPayload.status === "COMPLETED") {
      const resultRes = await fetch(`https://queue.fal.run/${model}/requests/${requestId}`, {
        headers: { Authorization: `Key ${falKey}` },
      });
      const resultPayload = await resultRes.json().catch(() => ({}));
      return extractFalImageUrl(resultPayload);
    }

    if (statusPayload.status === "FAILED") {
      throw new Error(`Fal queue job failed for model: ${model}`);
    }
  }

  throw new Error(`Fal queue timeout for model: ${model}`);
}

async function callFalModel(model, input, falKey) {
  const syncRes = await fetch(`https://fal.run/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${falKey}`,
    },
    body: JSON.stringify(input),
  });

  if (syncRes.ok) {
    const syncPayload = await syncRes.json().catch(() => ({}));
    const directUrl = extractFalImageUrl(syncPayload);
    if (directUrl) return directUrl;
    if (syncPayload.request_id) {
      return pollFalQueue(model, syncPayload.request_id, falKey);
    }
  }

  const queueRes = await fetch(`https://queue.fal.run/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${falKey}`,
    },
    body: JSON.stringify(input),
  });

  if (!queueRes.ok) {
    const errText = await queueRes.text();
    throw new Error(`Fal request failed: ${errText}`);
  }

  const queuePayload = await queueRes.json().catch(() => ({}));
  if (!queuePayload.request_id) {
    const directUrl = extractFalImageUrl(queuePayload);
    if (directUrl) return directUrl;
    throw new Error("Fal response missing request_id and image URL");
  }

  return pollFalQueue(model, queuePayload.request_id, falKey);
}

async function removeBackgroundWithFal(imageUrl, falKey) {
  const bgRemovalModel = process.env.FAL_BG_REMOVAL_MODEL || "fal-ai/bria/background/remove";

  try {
    const cutoutUrl = await callFalModel(
      bgRemovalModel,
      {
        image_url: imageUrl,
        output_format: "png",
      },
      falKey,
    );

    return cutoutUrl || imageUrl;
  } catch {
    return imageUrl;
  }
}

function sanitizePrompt(prompt) {
  return prompt.replace(/[\n\r\t]+/g, " ").replace(/\s+/g, " ").trim();
}

async function generateWithFal(prompt, style, tier, count) {
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    throw new Error("FAL_KEY not configured");
  }

  const model = tier === "pro" ? "fal-ai/flux-pro/v1.1" : "fal-ai/flux/schnell";
  const styleTemplate = STYLE_TEMPLATES[style] || STYLE_TEMPLATES.streetwear;
  const fullPrompt = `${prompt}, ${styleTemplate}, isolated subject, transparent background aesthetic, no surrounding backdrop, avoid: ${NEGATIVE_PROMPT}`;

  const imageCount = tier === "pro" ? 1 : Math.min(Math.max(count, 1), 4);
  const applyCutout = process.env.FAL_BG_REMOVAL !== "false";

  const urls = [];
  for (let i = 0; i < imageCount; i += 1) {
    const generatedUrl = await callFalModel(
      model,
      {
        prompt: fullPrompt,
        image_size: "square_hd",
        num_inference_steps: tier === "pro" ? 28 : 6,
        num_images: 1,
        enable_safety_checker: true,
      },
      falKey,
    );

    const finalUrl = applyCutout ? await removeBackgroundWithFal(generatedUrl, falKey) : generatedUrl;
    urls.push(finalUrl);
  }

  return {
    fullPrompt,
    urls,
  };
}

async function moderateWithOpenAI(prompt) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return { flagged: false };

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({ input: prompt }),
    });

    const data = await response.json().catch(() => ({}));
    const result = data.results?.[0];

    if (result?.flagged) {
      return {
        flagged: true,
        categories: Object.entries(result.categories || {})
          .filter(([, value]) => value)
          .map(([key]) => key),
      };
    }

    return { flagged: false };
  } catch {
    return { flagged: false };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, style = "streetwear", tier = "schnell", count = 4 } = req.body || {};
  const cleanedPrompt = sanitizePrompt(String(prompt || ""));

  if (!cleanedPrompt || cleanedPrompt.length < 3) {
    return res.status(400).json({ error: "Prompt is required (minimum 3 characters)" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const rateCheck = await rateLimitCheck(
    ip,
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN,
  );

  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason });
  }

  const blockCheck = checkBlocklist(cleanedPrompt);
  if (!blockCheck.allowed) {
    return res.status(422).json({ error: blockCheck.reason });
  }

  const moderationCheck = await moderateWithOpenAI(cleanedPrompt);
  if (moderationCheck.flagged) {
    return res.status(422).json({
      error: "This prompt contains content that doesn't meet our guidelines. Try a different description.",
      categories: moderationCheck.categories,
    });
  }

  try {
    const { fullPrompt, urls } = await generateWithFal(cleanedPrompt, style, tier, count);

    return res.status(200).json({
      tier,
      images: urls,
      designs: urls.map((url, i) => ({
        id: `${tier}-${Date.now()}-${i}`,
        preview: url,
        prompt: fullPrompt,
      })),
    });
  } catch (err) {
    return res.status(500).json({
      error: `Image generation failed: ${err.message || "Unknown error"}`,
    });
  }
}
