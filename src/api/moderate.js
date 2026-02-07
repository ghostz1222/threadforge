export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Replace with OpenAI moderation or Rekognition checks.
  return res.status(200).json({ safe: true, categories: [] });
}
