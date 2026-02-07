import { MODERATION_BLOCKLIST } from "../data/constants";

export function checkPromptForBlockedTerms(input) {
  const normalized = input.toLowerCase();
  const hit = MODERATION_BLOCKLIST.find((term) => normalized.includes(term));

  if (!hit) {
    return { allowed: true, reason: null };
  }

  return {
    allowed: false,
    reason:
      "We can't create designs based on trademarked or copyrighted material. Try describing your own original idea.",
  };
}

export async function moderatePromptServer(prompt) {
  try {
    const response = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) return { safe: true };
    return response.json();
  } catch {
    return { safe: true };
  }
}

export async function scanOutputForPolicyViolations(imageUrl) {
  try {
    const response = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    if (!response.ok) return { safe: true, categories: [] };
    return response.json();
  } catch {
    return { safe: true, categories: [] };
  }
}
