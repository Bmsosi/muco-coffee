# Muco Coffee

Responsive React storefront for specialty coffee from Burundi. The product grid, product cards, site chrome, and cart drawer are reusable components. Stripe Checkout Sessions are created by the Express API so product prices and the Stripe secret stay on the server.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `STRIPE_SECRET_KEY` to a Stripe test secret key (`sk_test_...`). Keep this key server-side; do not use a `VITE_` prefix.
3. Run `npm run dev`. Vite serves the site at `http://localhost:5173` and proxies `/api` requests to the Express API at port `4242`.
4. Add a product to the bag and continue to checkout. Use a Stripe test card such as `4242 4242 4242 4242` with any future expiry and CVC.

`SITE_URL` controls the Checkout success and cancel URLs. The API accepts only the product IDs and quantities; all price data is looked up in the server catalog.

Checkout return pages show cancellation feedback or verify the Stripe session server-side before confirming payment. Shipping currently supports the country codes listed by `SHIPPING_COUNTRIES` in `.env.example` and uses a flat $12 USD standard shipping rate. Set `SHIPPING_COUNTRIES` in `.env` to a comma-separated list of ISO 3166-1 alpha-2 country codes supported by your fulfillment setup, then restart the API.

## Checks

Run `npm run build` for a production client build and `npm run lint` for Oxlint.
