import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envResult = dotenv.config({ path: resolve(projectRoot, ".env") });

const app = express();
const port = Number(process.env.API_PORT) || 4242;
const siteUrl = (process.env.SITE_URL || "http://localhost:5173").replace(
  /\/$/,
  "",
);
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY?.trim() ||
  envResult.parsed?.STRIPE_SECRET_KEY?.trim();
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const defaultShippingCountries = [
  "US",
  "CA",
  "GB",
  "IE",
  "FR",
  "DE",
  "BE",
  "NL",
  "LU",
  "CH",
  "AT",
  "DK",
  "SE",
  "NO",
  "FI",
  "ES",
  "PT",
  "IT",
  "PL",
  "CZ",
  "GR",
  "RO",
  "HU",
  "AU",
  "NZ",
  "JP",
  "SG",
  "KR",
  "AE",
  "ZA",
  "KE",
  "UG",
  "TZ",
  "RW",
  "BI",
];
const shippingCountries = process.env.SHIPPING_COUNTRIES
  ? process.env.SHIPPING_COUNTRIES.split(",")
      .map((country) => country.trim().toUpperCase())
      .filter((country) => /^[A-Z]{2}$/.test(country))
  : defaultShippingCountries;

const catalog = {
  "kayanza-250": {
    name: "Kayanza Sunrise",
    description: "Kayanza · Washed · 250g",
    unitAmount: 2200,
  },
  "kirundo-250": {
    name: "Kirundo Bloom",
    description: "Kirundo · Natural · 250g",
    unitAmount: 2400,
  },
  "burundi-trio": {
    name: "The Burundi Trio",
    description: "Three origins · 3 × 250g",
    unitAmount: 6200,
  },
  "ngozi-honey-250": {
    name: "Ngozi Honey Gold",
    description: "Ngozi · Honey · 250g whole-bean bag",
    unitAmount: 2300,
  },
  "muyinga-250": {
    name: "Muyinga Moonlight",
    description: "Muyinga · Washed · 250g whole-bean bag",
    unitAmount: 2100,
  },
  "gitega-natural-250": {
    name: "Gitega Berry Patch",
    description: "Gitega · Natural · 250g whole-bean bag",
    unitAmount: 2500,
  },
  "bubanza-250": {
    name: "Bubanza Highlands",
    description: "Bubanza · Washed · 250g whole-bean bag",
    unitAmount: 2200,
  },
  "kayanza-decaf-250": {
    name: "Kayanza Afterglow Decaf",
    description: "Kayanza · Sugarcane decaf · 250g whole-bean bag",
    unitAmount: 2600,
  },
  "burundi-house-1kg": {
    name: "Muco House Coffee",
    description: "Burundi house blend · 1kg whole-bean bag",
    unitAmount: 6800,
  },
};

app.use(express.json({ limit: "16kb" }));

app.get("/api/health", (_request, response) =>
  response.json({ ok: true, checkoutConfigured: Boolean(stripe) }),
);

app.get("/api/checkout-session/:sessionId", async (request, response) => {
  if (!stripe) {
    return response.status(503).json({ error: "Checkout is not configured." });
  }
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(request.params.sessionId)) {
    return response.status(400).json({ error: "Invalid checkout session." });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(
      request.params.sessionId,
    );
    return response.json({
      status: session.status,
      paymentStatus: session.payment_status,
    });
  } catch (error) {
    console.error("Unable to verify Stripe Checkout Session:", error.message);
    return response.status(502).json({
      error: "We could not verify the payment yet. Please contact us.",
    });
  }
});

app.post("/api/create-checkout-session", async (request, response) => {
  if (!stripe) {
    return response.status(503).json({
      error:
        "Checkout is not configured yet. Add STRIPE_SECRET_KEY to the server environment.",
    });
  }

  const { items } = request.body ?? {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    return response.status(400).json({
      error: "Add at least one item to your bag before checking out.",
    });
  }

  const lineItems = [];
  let subtotal = 0;
  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !Object.hasOwn(catalog, item.id)
    ) {
      return response
        .status(400)
        .json({ error: "One or more products are not available." });
    }
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 10
    ) {
      return response
        .status(400)
        .json({ error: "Each item quantity must be between 1 and 10." });
    }
    const product = catalog[item.id];
    subtotal += product.unitAmount * item.quantity;
    lineItems.push({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: product.unitAmount,
        product_data: { name: product.name, description: product.description },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?checkout=cancel`,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: shippingCountries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1200,
              currency: "usd",
            },
            display_name: "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      allow_promotion_codes: true,
    });
    return response.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session:", error.message);
    return response.status(502).json({
      error: "Secure checkout is temporarily unavailable. Please try again.",
    });
  }
});

const server = app.listen(port, () => {
  console.log(`Muco Coffee API listening on http://localhost:${port}`);
  console.log(`Stripe secret key loaded: ${Boolean(stripe)}`);
});
server.ref();
