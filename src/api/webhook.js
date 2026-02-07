export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Replace with Stripe signature verification and Printful order routing.
  return res.status(200).json({ received: true });
}
