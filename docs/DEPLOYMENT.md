# Deployment

The site is a standard Next.js application: static pages plus two serverless API routes (`/api/estimate`, `/api/leads`). It runs on any Node 20.9+ host. **Nothing has been deployed** — choosing a host, domain and paid services requires owner approval.

## Recommended hosting

| Option | Notes |
| --- | --- |
| **Vercel** (simplest) | Zero-config for Next.js. Free hobby tier is for non-commercial use, so a business site needs Pro. Leads must use `email` and/or `webhook` sinks (the file system is ephemeral). |
| Netlify / Cloudflare | Supported via their Next.js adapters. Same sink requirement. |
| Self-hosted (VPS + Node) | `npm ci && npm run build && npm start` behind a reverse proxy with TLS. Can also use the `file` sink with a persistent `LEAD_FILE_DIR`. |

## Environment variables

See `.env.example` for the full annotated list. Minimum for launch:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes** | Canonical URLs, sitemap, structured data, OG tags |
| `LEAD_SINKS` + sink settings | **Yes** | Where inspection requests go. Without one, forms honestly report “unavailable — please call.” |
| `RESEND_API_KEY`, `LEAD_EMAIL_FROM`, `LEAD_EMAIL_TO` | For email | Resend free tier covers typical contractor volume; requires DNS records on the domain |
| `LEAD_WEBHOOK_URL` (+ `LEAD_WEBHOOK_SECRET`) | For webhook | e.g., Google Apps Script → Google Sheet (free), Zapier/Make → CRM |
| `PRICING_CONFIG_*` | For live pricing | Otherwise production shows inspection-only results |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Recommended | Free Cloudflare bot protection |

**Recommended lead setup:** `LEAD_SINKS=email,webhook` — email notifies the owner immediately, the webhook keeps a durable record in a spreadsheet/CRM. A lead counts as delivered if at least one succeeds; failures are logged without personal data.

## Webhook payload

```json
{ "type": "lead.created", "lead": { "id": "uuid", "createdAt": "ISO", "source": "estimator|contact",
  "contact": { "name", "phone", "email", "address", "preferredContact", "notes" },
  "estimate": { ...estimator inputs }, "estimateResult": { ...server-calculated range + assumptions }, "issues": [] } }
```

With `LEAD_WEBHOOK_SECRET` set, verify `x-nextgen-signature: sha256=HMAC_SHA256(secret, rawBody)`.

## Launch checklist

- [ ] Resolve every item in `OPEN-ITEMS.md` marked **Blocking**
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the final domain; connect DNS and TLS
- [ ] Configure and **test** lead delivery end-to-end on the production URL (submit a real request and confirm it arrives)
- [ ] Approved pricing loaded (`status: "approved"`) — or deliberately launch inspection-only
- [ ] Turnstile keys configured
- [ ] Re-verify BBB and Google ratings; update `asOf` dates in `src/content/business.ts`
- [ ] Replace the provisional logo with original artwork
- [ ] Owner/attorney review of `/privacy` and `/terms`
- [ ] Submit `sitemap.xml` in Google Search Console; link the site from the Google Business Profile
- [ ] Remove `NEXT_PUBLIC_NOINDEX` (or set `false`) on the production deployment only

## Preview / client review deployment

```
NEXT_PUBLIC_NOINDEX=true
ALLOW_DEMO_PRICING=true     # shows demo-labeled ranges for review
LEAD_SINKS=webhook          # point at a test sheet
```
