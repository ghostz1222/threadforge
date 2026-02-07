import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const stripe = new Stripe(STRIPE_SECRET);

  const { email, product, productName, productSubtitle, basePrice, shippingPrice, designId, designPreviewUrl } = req.body || {};

  if (!email || !product) {
    return res.status(400).json({ error: "Email and product details are required" });
  }

  // Use dynamic pricing from Printful catalog, with sensible fallbacks
  const unitAmountProduct = Math.round((basePrice || 24.50) * 100);
  const unitAmountShipping = Math.round((shippingPrice || 4.50) * 100);
  const productLabel = productName || product.shirtType || "Custom Tee";
  const colorLabel = product.shirtColorName || "Black";

  const origin = req.headers.origin || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_creation: "always",
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "AU", "DE", "FR", "ES", "IT", "NL", "SE",
          "DK", "NO", "FI", "IE", "AT", "BE", "CH", "PT", "PL", "CZ",
        ],
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${productLabel} — Custom Design`,
              description: `${productSubtitle || "Tee"} | Size: ${product.size || "L"} | Color: ${colorLabel}`,
              images: designPreviewUrl ? [designPreviewUrl] : [],
            },
            unit_amount: unitAmountProduct,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Standard Shipping (5-8 days)",
            },
            unit_amount: unitAmountShipping,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/order-status/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/customize`,
      metadata: {
        designId: designId || "",
        designPreviewUrl: designPreviewUrl || "",
        printfulProduct: product.printfulProduct || "bella-canvas-3001",
        shirtType: product.shirtType || "Bella+Canvas 3001",
        shirtColor: product.shirtColor || "#0C0C0C",
        shirtColorName: colorLabel,
        size: product.size || "L",
      },
    });

    return res.status(200).json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err.message);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
