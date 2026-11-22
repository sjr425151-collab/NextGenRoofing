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

**Chosen lead setup:** `LEAD_SINKS=google-sheet` — a Google Apps Script on the client's “Lead form requests - Website” sheet appends each lead and emails the NextGen Gmail (free; see `integrations/google-sheets/README.md`). Email via Resend and generic webhooks remain available. A lead counts as delivered if at least one succeeds; failures are logged without personal data.

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
- [x] Pricing decision: ballpark ranges + “call for exact rates” (`status: "ballpark"`)
- [ ] Turnstile keys configured
- [ ] Re-verify BBB and Google ratings; update `asOf` dates in `src/content/business.ts`
- [ ] Replace the provisional logo with original artwork
- [ ] Owner/attorney review of `/privacy` and `/terms`
- [ ] Submit `sitemap.xml` in Google Search Console; link the site from the Google Business Profile
- [ ] Remove `NEXT_PUBLIC_NOINDEX` (or set `false`) on the production deployment only

## Preview at livefiberconnect.com/preview/nextgenroofing

The preview runs the same app under a sub-path. Settings live in `.env.preview` (committed; contains no secrets):

```
NEXT_PUBLIC_BASE_PATH=/preview/nextgenroofing
NEXT_PUBLIC_SITE_URL=https://livefiberconnect.com/preview/nextgenroofing
NEXT_PUBLIC_NOINDEX=true        # meta robots + X-Robots-Tag: noindex
```

```bash
npm ci
npm run build:preview           # the base path is read at build AND start —
npm run start:preview -- -p 3000  # always use these paired scripts
npm run check:preview           # crawls every page; fails on any broken request
```

Secrets go in the host's environment, not in `.env.preview`: `LEAD_SINKS=google-sheet`, `LEAD_SHEET_WEBHOOK_URL`, `LEAD_SHEET_TOKEN` (see `integrations/google-sheets/README.md`), plus optional Turnstile keys.
Without a lead sink, preview forms honestly say “Online requests are temporarily unavailable — please call.”

The livefiberconnect.com server must forward `/preview/nextgenroofing` and everything under it to this app **without stripping the prefix** (e.g. nginx `location /preview/nextgenroofing { proxy_pass http://127.0.0.1:3000; }` — note: no trailing slash on `proxy_pass`). On Vercel, deploy this repo as its own project and add a rewrite in the livefiberconnect.com project: `/preview/nextgenroofing/:path*` → `https://<this-project>.vercel.app/preview/nextgenroofing/:path*`.

**Moving to the client's domain later:** remove `NEXT_PUBLIC_BASE_PATH`, set `NEXT_PUBLIC_SITE_URL` to the new domain, unset `NEXT_PUBLIC_NOINDEX` and `ALLOW_DEMO_PRICING`, then `npm run build && npm start`. No code changes are needed.

## Render (livefiberconnect.com is hosted on Render)

### 1 · Create the NextGen service

Render Dashboard → **New → Blueprint** → choose `sjr425151-collab/NextGenRoofing`, branch `claude/nextgen-roofing-website-k8ccjl`. `render.yaml` defines a Node web service `nextgen-roofing-preview`:

| Setting | Value |
| --- | --- |
| Build | `npm ci && npm run build:render` |
| Start | `npm run start:preview -- -p $PORT -H 0.0.0.0` |
| Health check | `/preview/nextgenroofing` |
| Node | 22 (`NODE_VERSION`, `.node-version`) |
| Secrets (dashboard) | `LEAD_SHEET_WEBHOOK_URL`, `LEAD_SHEET_TOKEN` |

Measured in a clean clone: build peak ≈ 440 MB (largest process), runtime ≈ 120 MB. **Plan:** Free works but sleeps after inactivity (first visit after idle is slow); Starter (paid) stays awake. If a build is killed for memory, move the service to a larger plan.

The service then answers at `https://nextgen-roofing-preview.onrender.com/preview/nextgenroofing`.

### 2 · Forward the path from livefiberconnect.com

The prefix must be **kept** when forwarding (the app expects `/preview/nextgenroofing/...`).

- **If livefiberconnect.com is a Render *Static Site*:** Settings → Redirects/Rewrites → add a **Rewrite**
  `Source: /preview/nextgenroofing/*` → `Destination: https://nextgen-roofing-preview.onrender.com/preview/nextgenroofing/*`.
  Also add the exact path `/preview/nextgenroofing` (no slash) the same way. Place these rules above any catch-all rule.
- **If it's a Render *Web Service* built with Next.js:** in its `next.config` add
  ```js
  async rewrites() { return { beforeFiles: [
    { source: "/preview/nextgenroofing", destination: "https://nextgen-roofing-preview.onrender.com/preview/nextgenroofing" },
    { source: "/preview/nextgenroofing/:path*", destination: "https://nextgen-roofing-preview.onrender.com/preview/nextgenroofing/:path*" },
  ] }; }
  ```
- **If it's an Express/Node web service:**
  ```js
  const { createProxyMiddleware } = require("http-proxy-middleware");
  app.use(createProxyMiddleware({ pathFilter: "/preview/nextgenroofing", target: "https://nextgen-roofing-preview.onrender.com", changeOrigin: true }));
  ```
  (register before other routes; `pathFilter` keeps the prefix).

Verify: `https://livefiberconnect.com/preview/nextgenroofing` loads with images and video, and the estimator returns a range.

## Preview / client review deployment (generic)

```
NEXT_PUBLIC_NOINDEX=true
ALLOW_DEMO_PRICING=true     # shows demo-labeled ranges for review
LEAD_SINKS=webhook          # point at a test sheet
```
