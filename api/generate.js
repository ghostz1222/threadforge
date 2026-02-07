const STYLE_TEMPLATES = {
  minimal:
    "minimalist t-shirt graphic, clean geometry, bold contrast, centered composition, isolated on transparent background, print-ready edges",
  vintage:
    "vintage-inspired t-shirt illustration, worn texture effect, retro palette, distressed but legible details, transparent background",
  streetwear:
    "streetwear t-shirt graphic, bold line work, high contrast, edgy composition, clean printable edges, transparent background",
  watercolor:
    "watercolor t-shirt artwork, painterly gradients, soft blended tones with clear subject silhouette, transparent background",
  illustrated:
    "illustrated t-shirt graphic, hand-drawn vibe, crisp outlines, layered shading, transparent background",
  photographic:
    "photographic-style t-shirt art, dramatic lighting, strong subject focus, optimized for screen print contrast, transparent background",
};

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
      reason: "We can't create designs based on trademarked or copyrighted material. Try describing your own original idea!",
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

async function generateWithFal(prompt, tier, count) {
  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) {
    throw new Error("FAL_KEY not configured");
  }

  const model = tier === "pro"
    ? "fal-ai/flux-pro/v1.1"
    : "fal-ai/flux/schnell";

  const images = [];

  for (let i = 0; i < count; i++) {
    const response = await fetch(`https://queue.fal.run/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${FAL_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        image_size: "square_hd",
        num_inference_steps: tier === "pro" ? 28 : 4,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Fal.ai error: ${err}`);
    }

    const result = await response.json();

    if (result.request_id) {
      let attempts = 0;
      while (attempts < 60) {
        await new Promise((r) => setTimeout(r, 1000));
        const statusRes = await fetch(
          `https://queue.fal.run/${model}/requests/${result.request_id}/status`,
          { headers: { Authorization: `Key ${FAL_KEY}` } }
        );
        const status = await statusRes.json();

        if (status.status === "COMPLETED") {
          const resultRes = await fetch(
            `https://queue.fal.run/${model}/requests/${result.request_id}`,
            { headers: { Authorization: `Key ${FAL_KEY}` } }
          );
          const finalResult = await resultRes.json();
          if (finalResult.images?.[0]?.url) {
            images.push(finalResult.images[0].url);
          }
          break;
        }
        if (status.status === "FAILED") {
          throw new Error("Image generation failed");
        }
        attempts++;
      }
    } else if (result.images?.[0]?.url) {
      images.push(result.images[0].url);
    }
  }

  return images;
}

async function moderateWithOpenAI(prompt) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_KEY) return { flagged: false };

  try {
    const response = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({ input: prompt }),
    });

    const data = await response.json();
    const result = data.results?.[0];

    if (result?.flagged) {
      return {
        flagged: true,
        categories: Object.entries(result.categories)
          .filter(([, v]) => v)
          .map(([k]) => k),
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

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return res.status(400).json({ error: "Prompt is required (minimum 3 characters)" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  const rateCheck = await rateLimitCheck(
    ip,
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
  if (!rateCheck.allowed) {
    return res.status(429).json({ error: rateCheck.reason });
  }

  // Blocklist moderation
  const blockCheck = checkBlocklist(prompt);
  if (!blockCheck.allowed) {
    return res.status(422).json({ error: blockCheck.reason });
  }

  // OpenAI moderation
  const openaiCheck = await moderateWithOpenAI(prompt);
  if (openaiCheck.flagged) {
    return res.status(422).json({
      error: "This prompt contains content that doesn't meet our guidelines. Try a different description.",
      categories: openaiCheck.categories,
    });
  }

  // Compose full prompt with style template
  const template = STYLE_TEMPLATES[style] || STYLE_TEMPLATES.streetwear;
  const fullPrompt = `${prompt.trim()}, ${template}`;

  try {
    const imageCount = tier === "pro" ? 1 : Math.min(count, 4);
    const images = await generateWithFal(fullPrompt, tier, imageCount);

    return res.status(200).json({
      tier,
      images,
      designs: images.map((url, i) => ({
        id: `${tier}-${Date.now()}-${i}`,
        preview: url,
        prompt: fullPrompt,
      })),
    });
  } catch (err) {
    console.error("Generation error:", err.message);
    return res.status(500).json({ error: "Image generation failed. Please try again." });
  }
}
