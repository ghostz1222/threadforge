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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, imageUrl } = req.body || {};

  // Prompt-based moderation (text check)
  if (prompt) {
    const normalized = prompt.toLowerCase();
    const hit = BLOCKED_TERMS.find((term) => normalized.includes(term));

    if (hit) {
      return res.status(200).json({
        safe: false,
        reason: "We can't create designs based on trademarked or copyrighted material. Try describing your own original idea!",
        type: "blocklist",
      });
    }

    // OpenAI text moderation
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
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
          const flaggedCategories = Object.entries(result.categories)
            .filter(([, v]) => v)
            .map(([k]) => k);

          return res.status(200).json({
            safe: false,
            reason: "This prompt contains content that doesn't meet our guidelines. Try a different description.",
            type: "openai_moderation",
            categories: flaggedCategories,
          });
        }
      } catch (err) {
        console.error("OpenAI moderation error:", err.message);
      }
    }
  }

  // Image-based moderation (post-generation check)
  if (imageUrl) {
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (OPENAI_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/moderations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "omni-moderation-latest",
            input: [{ type: "image_url", image_url: { url: imageUrl } }],
          }),
        });

        const data = await response.json();
        const result = data.results?.[0];

        if (result?.flagged) {
          return res.status(200).json({
            safe: false,
            reason: "This design didn't pass our content check. Try adjusting your prompt.",
            type: "image_moderation",
            categories: Object.entries(result.categories)
              .filter(([, v]) => v)
              .map(([k]) => k),
          });
        }
      } catch (err) {
        console.error("Image moderation error:", err.message);
      }
    }
  }

  return res.status(200).json({ safe: true, categories: [] });
}
