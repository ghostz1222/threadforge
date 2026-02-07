import { STYLE_TEMPLATES } from "../data/constants";

const PALETTES = [
  ["#FF6B35", "#004E89", "#F7C59F"],
  ["#E84855", "#2B2D42", "#F7F7F2"],
  ["#6B4D8A", "#3AAFB9", "#F2D7EE"],
  ["#1B998B", "#FF9B71", "#2D3047"],
  ["#E63946", "#457B9D", "#F1FAEE"],
  ["#264653", "#E76F51", "#F4A261"],
];

function hash(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function makePreviewSvg(seed, palette) {
  const variant = seed % 6;
  const s = seed % 1000;
  const shapes = {
    0: `<circle cx="100" cy="75" r="${35 + (s % 18)}" fill="${palette[0]}" opacity=".88" /><circle cx="${88 + (s % 20)}" cy="116" r="${22 + (s % 10)}" fill="${palette[1]}" opacity=".72" /><rect x="55" y="150" width="90" height="4" rx="2" fill="${palette[2]}" opacity=".55"/>`,
    1: `<polygon points="100,${26 + (s % 12)} ${152 + (s % 8)},${138 + (s % 8)} ${48 - (s % 8)},${138 + (s % 8)}" fill="${palette[0]}" /><polygon points="100,${52 + (s % 8)} 132,128 68,128" fill="${palette[1]}" opacity=".75" /><circle cx="100" cy="162" r="8" fill="${palette[2]}"/>`,
    2: new Array(5)
      .fill(0)
      .map(
        (_, i) =>
          `<rect x="${20 + i * 34}" y="${38 + ((s + i * 14) % 44)}" width="25" height="${72 + ((s + i * 15) % 56)}" rx="4" fill="${palette[i % 3]}" opacity="${0.5 + (i % 3) * 0.15}"/>`,
      )
      .join(""),
    3: `<path d="M${28 + (s % 20)},${152 - (s % 30)} Q80,${40 + (s % 24)} 100,${58 + (s % 18)} T${168 - (s % 18)},${48 + (s % 18)}" fill="none" stroke="${palette[0]}" stroke-width="6" stroke-linecap="round"/><path d="M42,${168 - (s % 18)} Q100,${78 + (s % 18)} 158,${98 - (s % 12)}" fill="none" stroke="${palette[1]}" stroke-width="4" stroke-linecap="round" opacity=".65"/><circle cx="${168 - (s % 18)}" cy="${48 + (s % 18)}" r="11" fill="${palette[2]}"/>`,
    4: `<rect x="32" y="32" width="136" height="136" rx="10" fill="none" stroke="${palette[0]}" stroke-width="3"/><rect x="52" y="52" width="96" height="96" rx="6" fill="${palette[1]}" opacity=".2"/><text x="100" y="112" text-anchor="middle" font-size="30" font-family="monospace" fill="${palette[0]}">${String(s % 99).padStart(2, "0")}</text>`,
    5: new Array(6)
      .fill(0)
      .map(
        (_, i) =>
          `<circle cx="${48 + (i % 3) * 52 + ((s + i) % 14)}" cy="${55 + Math.floor(i / 3) * 68 + ((s + i * 7) % 14)}" r="${14 + ((s + i * 11) % 22)}" fill="${palette[i % 3]}" opacity="${0.35 + (i % 3) * 0.2}"/>`,
      )
      .join(""),
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0e0e10"/>${shapes[variant]}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function composeGenerationPrompt(userPrompt, style) {
  const template = STYLE_TEMPLATES[style] || STYLE_TEMPLATES.streetwear;
  return `${userPrompt}, ${template}`;
}

export async function generateExplorationDesigns({ prompt, style, count = 4, sessionId = "anon" }) {
  // Try server-side generation first (production)
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style, tier: "schnell", count, sessionId }),
    });

    if (response.ok) {
      return response.json();
    }

    const err = await response.json().catch(() => ({}));

    // If it's a moderation/rate limit error, throw it (don't fall through)
    if (response.status === 422 || response.status === 429 || response.status === 400) {
      throw new Error(err.error || "Generation blocked");
    }
  } catch (fetchErr) {
    // If the error was from moderation/rate-limit, re-throw
    if (fetchErr.message && fetchErr.message !== "Failed to fetch") {
      throw fetchErr;
    }
    // Otherwise fall through to client-side placeholder generation
  }

  // Fallback: client-side placeholder generation (dev mode / no API keys)
  const fullPrompt = composeGenerationPrompt(prompt, style);
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    tier: "schnell",
    designs: Array.from({ length: count }).map((_, i) => {
      const seed = hash(`${fullPrompt}-${sessionId}-${i}-${Date.now()}`);
      const palette = PALETTES[seed % PALETTES.length];
      return {
        id: `${seed}-${i}`,
        seed,
        prompt: fullPrompt,
        preview: makePreviewSvg(seed, palette),
        palette,
      };
    }),
  };
}

export async function generateFinalDesign({ prompt, style, selectedId }) {
  // Try server-side generation first (production)
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style, tier: "pro", selectedId, count: 1 }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        tier: "pro",
        design: data.designs?.[0] || data.design,
      };
    }
  } catch {
    // Fall through to client-side placeholder
  }

  // Fallback: client-side placeholder generation
  const fullPrompt = composeGenerationPrompt(prompt, style);
  await new Promise((resolve) => setTimeout(resolve, 700));
  const seed = hash(`${fullPrompt}-${selectedId}-final`);
  const palette = PALETTES[(seed + 1) % PALETTES.length];
  return {
    tier: "pro",
    design: {
      id: `${seed}-final`,
      seed,
      prompt: fullPrompt,
      preview: makePreviewSvg(seed, palette),
      palette,
    },
  };
}
