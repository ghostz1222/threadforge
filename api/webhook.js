import Stripe from "stripe";

// Printful product mapping
const PRINTFUL_PRODUCTS = {
  "Crew Neck": { variant_id: 4018, product_id: 71 },
  "V-Neck": { variant_id: 4562, product_id: 183 },
  "Oversized": { variant_id: 4018, product_id: 71 },
};

const SIZE_MAP = {
  XS: "S", S: "S", M: "M", L: "L", XL: "XL", "2XL": "2XL",
};

async function upscaleImage(imageUrl) {
  const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!REPLICATE_TOKEN) {
    console.warn("REPLICATE_API_TOKEN not set, skipping upscale");
    return imageUrl;
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
      },
      body: JSON.stringify({
        version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: false,
        },
      }),
    });

    const prediction = await response.json();
    let result = prediction;

    // Poll for completion
    let attempts = 0;
    while (result.status !== "succeeded" && result.status !== "failed" && attempts < 120) {
      await new Promise((r) => setTimeout(r, 2000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
      });
      result = await pollRes.json();
      attempts++;
    }

    if (result.status === "succeeded" && result.output) {
      return typeof result.output === "string" ? result.output : result.output[0];
    }

    console.warn("Upscale did not succeed, using original image");
    return imageUrl;
  } catch (err) {
    console.error("Upscale error:", err.message);
    return imageUrl;
  }
}

async function createPrintfulOrder(metadata, shippingAddress, upscaledImageUrl) {
  const PRINTFUL_KEY = process.env.PRINTFUL_API_KEY;
  if (!PRINTFUL_KEY) {
    console.warn("PRINTFUL_API_KEY not set, skipping Printful order");
    return { id: "mock_printful", status: "skipped" };
  }

  const productConfig = PRINTFUL_PRODUCTS[metadata.shirtType] || PRINTFUL_PRODUCTS["Crew Neck"];

  try {
    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRINTFUL_KEY}`,
      },
      body: JSON.stringify({
        recipient: {
          name: shippingAddress.name,
          address1: shippingAddress.line1,
          address2: shippingAddress.line2 || "",
          city: shippingAddress.city,
          state_code: shippingAddress.state,
          country_code: shippingAddress.country,
          zip: shippingAddress.postal_code,
        },
        items: [
          {
            variant_id: productConfig.variant_id,
            quantity: 1,
            name: `Custom Design Tee — ${metadata.shirtType}`,
            files: [
              {
                type: "default",
                url: upscaledImageUrl,
              },
            ],
            options: [
              { id: "size", value: SIZE_MAP[metadata.size] || "L" },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    return data.result || data;
  } catch (err) {
    console.error("Printful order error:", err.message);
    return { id: "error", status: "failed", error: err.message };
  }
}

async function sendConfirmationEmail(email, orderId, metadata) {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "orders@threadforge.com";
  if (!RESEND_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "Your ThreadForge order is confirmed!",
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; color: #333;">
            <h1 style="font-size: 24px; color: #111;">Your shirt is in motion</h1>
            <p>Order ID: <strong>${orderId}</strong></p>
            <p>We're preparing your custom design tee for print.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;">Style</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${metadata.shirtType}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;">Size</td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${metadata.size}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Total</td><td style="padding: 8px 0; font-weight: bold; text-align: right;">$38.50</td></tr>
            </table>
            <p style="color: #888; font-size: 13px;">Printed and shipped in 3-5 business days. You'll receive a tracking email once your shirt ships.</p>
            <p style="margin-top: 32px; font-size: 12px; color: #aaa;">ThreadForge — Describe it. Wear it.</p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("Email send error:", err.message);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET) {
    return res.status(500).json({ error: "Stripe not configured" });
  }

  const stripe = new Stripe(STRIPE_SECRET);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const rawBody = await getRawBody(req);

    if (WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
    } else {
      event = JSON.parse(rawBody.toString());
      console.warn("Webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET)");
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadata = session.metadata || {};
    const customerEmail = session.customer_details?.email || session.customer_email;

    console.log(`Payment received for order: ${session.id}`);

    // 1. Upscale the design image for print
    let printReadyUrl = metadata.designPreviewUrl;
    if (printReadyUrl) {
      printReadyUrl = await upscaleImage(printReadyUrl);
    }

    // 2. Create Printful order
    const shippingAddress = session.shipping_details?.address || {};
    const printfulOrder = await createPrintfulOrder(metadata, {
      name: session.shipping_details?.name || "",
      ...shippingAddress,
    }, printReadyUrl);

    console.log("Printful order created:", printfulOrder.id || "N/A");

    // 3. Send confirmation email
    if (customerEmail) {
      await sendConfirmationEmail(customerEmail, session.id, metadata);
    }

    // 4. Store order in Supabase (if configured)
    // This would use the Supabase service role key to insert the order
    // into the orders table. Omitted here as it requires the service key
    // which should be set up separately.

    return res.status(200).json({
      received: true,
      orderId: session.id,
      printfulOrderId: printfulOrder.id,
    });
  }

  return res.status(200).json({ received: true });
}
