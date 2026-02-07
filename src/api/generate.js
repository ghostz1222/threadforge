import { checkPromptForBlockedTerms } from "../lib/moderation";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, tier = "schnell", count = 4 } = req.body || {};
  const moderation = checkPromptForBlockedTerms(prompt || "");

  if (!moderation.allowed) {
    return res.status(400).json({ error: moderation.reason });
  }

  // Replace with Fal.ai or Replicate Flux 2 API calls in production.
  return res.status(200).json({
    tier,
    message: "Connect Flux API in src/api/generate.js",
    designs: new Array(count).fill(0).map((_, i) => ({ id: `remote-${Date.now()}-${i}` })),
  });
}
