export const STYLE_PRESETS = [
  { id: "minimal", label: "Minimal", icon: "◯" },
  { id: "vintage", label: "Vintage", icon: "✦" },
  { id: "streetwear", label: "Streetwear", icon: "◆" },
  { id: "watercolor", label: "Watercolor", icon: "◐" },
  { id: "illustrated", label: "Illustrated", icon: "✎" },
  { id: "photographic", label: "Photographic", icon: "◉" },
];

export const STYLE_TEMPLATES = {
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

export const SHIRT_COLORS = [
  { hex: "#F5F5F0", label: "White" },
  { hex: "#1C1C1E", label: "Black" },
  { hex: "#1B2A4A", label: "Navy" },
  { hex: "#2D4A2B", label: "Forest" },
  { hex: "#C8B89A", label: "Sand" },
  { hex: "#6B2D3E", label: "Burgundy" },
  { hex: "#6B7B8D", label: "Slate" },
  { hex: "#8B4726", label: "Rust" },
];

export const SHIRT_TYPES = ["Crew Neck", "V-Neck", "Oversized"];

export const SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

export const PRICE_TABLE = {
  base: 34,
  shipping: 4.5,
};

export const MODERATION_BLOCKLIST = [
  // Brands & trademarks
  "nike", "adidas", "supreme", "gucci", "chanel", "louis vuitton", "prada",
  "balenciaga", "versace", "dior", "hermes", "burberry", "fendi", "yeezy",
  "jordan", "new balance", "puma", "reebok", "under armour",
  // Consumer brands
  "coca cola", "pepsi", "mcdonald", "starbucks", "apple logo", "google logo",
  "amazon logo",
  // Disney & characters
  "disney", "mickey mouse", "minnie mouse", "donald duck", "goofy",
  // Comics & superheroes
  "marvel", "spider-man", "spiderman", "batman", "superman", "wonder woman",
  "avengers", "iron man", "captain america", "thor marvel", "hulk marvel",
  // Anime & gaming
  "pokemon", "pikachu", "charizard", "naruto", "goku", "dragon ball",
  "one piece", "mario", "luigi", "zelda", "sonic the hedgehog",
  // Entertainment franchises
  "star wars", "harry potter", "lord of the rings", "game of thrones",
  // Public figures
  "taylor swift", "beyonce", "drake", "kanye", "travis scott",
  "elon musk", "trump", "biden", "obama",
  // NSFW
  "porn", "nude", "nsfw", "naked", "xxx", "hentai",
  // Hate symbols
  "nazi", "swastika", "kkk",
];
