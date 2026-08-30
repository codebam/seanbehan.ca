# Stripe Checkout

The Cloudflare Workers Production Kit uses a server-created Stripe Checkout Session. Stripe
Managed Payments is enabled on every Session so Stripe acts as merchant of record where the
program covers the sale. A paid Session unlocks an immutable archive in private R2; the success
page offers it immediately and a signed webhook sends the same access link by email.

No publishable key or Stripe.js is used. The browser only submits an empty same-origin form. Price,
quantity, product identity, release, and return URLs stay on the Worker.

## 1. Stripe account

1. Finish Stripe account activation, business verification, payout bank details, public business
   details, support email, and statement descriptor.
2. Open **Settings → Managed Payments**, confirm the account is eligible, accept its terms, and
   activate it. Canadian businesses and downloadable software are eligible categories, but Stripe
   makes the final account and product decision.
3. Open Checkout branding settings. Add the codebam logo, brand colour, support contact,
   `https://codebam.ca/legal/privacy`, and `https://codebam.ca/legal/terms-of-sale`.
4. Publish `https://codebam.ca/legal/refund-policy` wherever Stripe asks for the refund policy.
   Stripe/Link can issue a refund under Managed Payments; refunded or disputed charges stop passing
   the download check.

Managed Payments is deliberate. Standard Stripe Checkout makes Sean Behan the merchant of record
and shifts sales-tax, VAT, GST, fraud, dispute, and transaction-support obligations back to him.
Do not silently disable `managed_payments.enabled` if activation fails.

The policy pages live under `/legal`: privacy, terms of sale, the 14-day defect refund policy, and
the product license. Put the privacy and terms URLs in Stripe Checkout settings. The license shown
on the site matches `PRODUCT-LICENSE.md` in the release archive.

## 2. Product and Price

Create this once in a Stripe sandbox, then repeat in live mode. Sandbox and live IDs are different.

- **Name:** Cloudflare Workers Production Kit
- **Description:** Deployment-ready Astro and Cloudflare Workers reference starter with D1, R2,
  authentication, security, deployment, and operations guidance.
- **Pricing:** one-time
- **Amount:** `59.00 CAD`
- **Tax code:** `txcd_10202003` — Downloadable Software, business use
- **Tax behaviour:** exclusive, unless the advertised site price is changed to say tax included

Copy the resulting `price_...` ID. Do not send an amount or Product ID from the browser and do not
replace the Price with inline `price_data`.

Managed Payments uses Adaptive Pricing, so `$59 CAD` is the base catalog price while Checkout can
show a buyer's local currency and applicable tax.

## 3. Private artifact

Create the bucket once:

```bash
npx wrangler r2 bucket create codebam-product-downloads
```

Keep the bucket private: no `r2.dev` URL and no custom public domain. Upload the current immutable
key exactly as named in `src/lib/product.ts`:

```bash
# Local copy used by `npm run dev`
npx wrangler r2 object put \
  codebam-product-downloads/cloudflare-workers-production-kit-v1.0.0.zip \
  --file releases/cloudflare-workers-production-kit-v1.0.0.zip \
  --content-type application/zip \
  --local

# Production copy
npx wrangler r2 object put \
  codebam-product-downloads/cloudflare-workers-production-kit-v1.0.0.zip \
  --file releases/cloudflare-workers-production-kit-v1.0.0.zip \
  --content-type application/zip \
  --remote
```

Verify the local archive before upload:

```bash
sha256sum releases/cloudflare-workers-production-kit-v1.0.0.zip
```

The result must be `d8d55c83662bdb10eb5ba8c7443521ee8735882c4c3505dcb9e7ccdfc790a2f0`.

The Worker also compares the object's size and R2 MD5 with the release manifest before opening
Checkout or serving a download. Once the production upload is verified, protect this immutable key
against overwrite and deletion with a narrow [bucket-lock rule][r2-lock]:

```bash
npx wrangler r2 bucket lock add \
  codebam-product-downloads production-kit-v1.0.0 \
  cloudflare-workers-production-kit-v1.0.0.zip \
  --retention-indefinite
```

Never put paid files in `MEDIA`: that binding belongs to EmDash's public media delivery path.

For a later release, upload a new immutable object, add it to `PRODUCT_RELEASES`, and retain every
old object. `entitledRelease()` grants releases shipped during the buyer's first year while keeping
their originally purchased release available afterward.

## 4. Fulfillment email

Onboard `codebam.ca` under Cloudflare **Email Service** and verify its DNS records. The Worker sends
from `products@codebam.ca`, replies to `codebam@codebam.ca`, and the `ORDER_EMAIL` binding restricts
the sender to that address.

The Stripe webhook sends a download link, not the archive. The link contains a high-entropy Checkout
Session ID and the Worker rechecks payment, product, Price, refund/dispute state, and release before
every R2 read. Treat it as a bearer credential. Commerce pages send `Referrer-Policy: no-referrer`
and never enter the shared edge cache.

## 5. Database migration

The site migration is separate from EmDash's own migration table. Apply it locally before testing:

```bash
npm run migrate:local
```

Apply it once to the shared production D1 database before deploying either Worker:

```bash
npm run migrate:prod
```

The deploy workflow performs that production step once before its two-origin matrix. Its Cloudflare
token therefore needs **D1 Edit** in addition to Worker deployment permissions.

`site_stripe_fulfillments` makes webhook email delivery idempotent. A crash between external email
delivery and the final D1 update can still produce one duplicate email on Stripe retry; both links
are identical and harmless.

## 6. Local secrets and webhook test

Copy `.dev.vars.example` to `.dev.vars` and use sandbox values:

```dotenv
EMDASH_ENCRYPTION_KEY=emdash_enc_v1_...
STRIPE_SECRET_KEY=rk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Prefer a restricted Stripe key. Start with **Checkout Sessions: Write** and **Payment Intents: Read**;
the latter covers the expanded payment and Charge used to reject refunds and disputes. Do not grant
Price or Product access unless Stripe's sandbox request log reports that it is required. Confirm the
complete purchase and download test passes before creating the equivalent live key.

Get a local webhook secret with the Stripe CLI:

```bash
stripe login
stripe listen \
  --events=checkout.session.completed,checkout.session.async_payment_succeeded \
  --forward-to=http://localhost:4321/api/stripe/webhook
```

The listener prints its `whsec_...` value. Put it in `.dev.vars`, then run the codebam variant:

```bash
npm run dev:codebam
```

Open the product page, buy with Stripe test card `4242 4242 4242 4242`, any future expiry,
and any CVC. Verify all of these:

- Checkout shows the expected product and `$59.00 CAD` base price.
- A Canadian and a foreign billing address produce expected tax/local-currency treatment.
- Stripe redirects to `/checkout/success?session_id=...`.
- The download is the uploaded archive and its SHA-256 matches.
- Stripe CLI reports a `200` for `checkout.session.completed`.
- Miniflare logs the fulfillment message and the exact saved file paths.
- Re-sending the same event does not send a second email.
- A bad Session ID, unpaid Session, wrong Price, refunded payment, and direct R2 URL cannot download.

## 7. Production secrets

The product belongs only to the named `codebam` Worker environment:

```bash
npx wrangler secret put STRIPE_SECRET_KEY --env codebam
npx wrangler secret put STRIPE_PRICE_ID --env codebam
```

Use live values: `rk_live_...` (or `sk_live_...`) and the live `price_...`. Never commit either.

In Stripe Workbench, create a **snapshot webhook endpoint**:

- **URL:** `https://codebam.ca/api/stripe/webhook`
- **Events:** `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- **Scope:** this Stripe account, not an organization destination
- **API version:** current account version (`2025-03-31.basil` or later is required)

Use the apex URL exactly. `www.codebam.ca` returns a redirect, and Stripe treats webhook redirects as
failed deliveries. Reveal that endpoint's live signing secret, then set it:

```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET --env codebam
```

Webhook signing secrets differ between Stripe CLI, sandbox endpoint, and live endpoint.

## 8. Launch

1. Back up D1.
2. Confirm legal pages and archive license are published.
3. Activate live Managed Payments and create the live Product/Price.
4. Upload and checksum the artifact.
5. Onboard the email sender.
6. Apply the D1 migration.
7. Set all three live Worker secrets.
8. Register and test the live webhook.
9. Deploy codebam.ca and purge its edge cache.
10. Make one real purchase and refund it. Confirm download works before refund and is denied after.
11. Disable the Lemon Squeezy checkout only after the Stripe purchase, email, download, and refund
    path all pass.

Add Cloudflare WAF rate-limit rules before launch. A reasonable starting point is 10 requests per IP
per minute for `POST /checkout/cloudflare-workers-production-kit`, plus 30 requests per IP per minute
across `GET /checkout/success` and `GET /checkout/download`. Exempt verified bots only from the
public product page, not the checkout routes. The POST also requires a same-origin browser request
and ignores all client product data.

[r2-lock]: https://developers.cloudflare.com/r2/buckets/bucket-locks/
