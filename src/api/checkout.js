export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Replace with real Stripe session creation.
  return res.status(200).json({
    sessionId: `cs_live_placeholder_${Date.now()}`,
    orderId: `ord_${Date.now()}`,
  });
}
