export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    width: 4500,
    height: 5400,
    dpi: 300,
    warning: null,
  });
}
