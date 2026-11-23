# SEO — NextGen Roofing & Construction (nextgenroofing.work)

Audit and implementation, Nov 23 2026. Measurements were taken on a production build of the deployed
commit (`e2c30f0`) and of this branch, both served with the live-domain configuration
(`npm run build:render` / Render start command). **The live domain itself was not reachable from the
audit environment**, so DNS, TLS, Render-level redirects and real-user (field) Core Web Vitals were not
observed directly — see "Verify after deploy".

## Verified business facts used (nothing else is claimed)

| Fact | Source |
| --- | --- |
| NextGen Roofing & Construction LLC · (440) 228-5933 | Client, Google Business Profile, BBB |
| 4035 Parrakeet Ave, Toledo, OH 43612 · Open 24 hours | Google Business Profile screenshot |
| Services: roof inspection, roof installation, roof repair (GBP); flat roof repairs & maintenance, new flat roofs, self-adhering & torch-down, EPDM & TPO, spray foam, roof coatings, commercial & residential, free inspections & estimates (BBB) | GBP + BBB screenshots |
| Founder Ryan Cole; father Frank, C&S Roofing & Construction, 30+ years | Client; Ryan's Facebook post |
| Service area: Toledo (named); "Serving Ohio homes & businesses" | GBP address; Facebook profile |

Not claimed anywhere: storm-damage/insurance-claim services, emergency service, licenses, certifications,
warranties, financing, years in business, other cities.

## Keyword → page map (intent-first)

Volume data was not available (no paid keyword tool); priorities are by commercial intent. Local SERPs
are dominated by directories (HomeAdvisor, Thumbtack, BBB, This Old House), so the Google Business
Profile (map pack) plus strong service pages are the primary levers.

| Page | Primary theme | Secondary themes |
| --- | --- | --- |
| `/` | roofing contractor Toledo OH | roofers Toledo, residential & commercial roofing Toledo |
| `/residential-roofing` | roof replacement Toledo | new roof cost, residential roofing, shingle roof installation |
| `/commercial-roofing` | commercial roofing contractor Toledo | commercial roof replacement, roof coating, restoration |
| `/roof-repair` | roof repair Toledo | roof leak repair, flashing / chimney leak repair |
| `/flat-roofing` | flat roof repair / replacement Toledo | EPDM, TPO, torch-down, modified bitumen, spray foam roofing |
| `/roof-inspection` (new) | free roof inspection Toledo | roof inspection cost, when to inspect a roof |
| `/estimate` | roof replacement cost estimate | roof cost calculator, how much is a new roof |
| `/projects`, `/projects/*` | roofing projects / portfolio | roof replacement before and after |
| `/about` | second-generation roofer Toledo | family roofing company |
| `/contact` | schedule roof inspection | contact roofing contractor Toledo |

## Page-by-page matrix (final)

| URL | Title (≤60) | H1 | Schema | Changes |
| --- | --- | --- | --- | --- |
| `/` | Toledo Roofing Contractor \| NextGen Roofing & Construction | Toledo, Ohio · Residential & Commercial Roofing — Raising the Standard. | RoofingContractor + WebSite | Title/description rewritten (description was 185 chars); descriptive line moved into H1 (visual unchanged); site-wide graph |
| `/residential-roofing` | Residential Roof Replacement in Toledo, OH \| NextGen Roofing | Residential Roofing in Toledo, OH — A roof built for the house you live in. | Service, FAQPage, BreadcrumbList | Title was 66 chars; keyword H1 line; link to inspection page |
| `/commercial-roofing` | Commercial Roofing Contractor, Toledo OH \| NextGen Roofing | Commercial Roofing in Toledo, OH — … | Service, FAQPage, BreadcrumbList | Same pattern |
| `/roof-repair` | Roof Repair & Leak Repair in Toledo, OH \| NextGen Roofing | Roof Repair in Toledo, OH — … | Service, FAQPage, BreadcrumbList | Same pattern |
| `/flat-roofing` | Flat Roof Repair & Installation, Toledo OH \| NextGen Roofing | Flat Roofing Systems in Toledo, OH — … | Service, FAQPage, BreadcrumbList | Title was 82 chars |
| `/roof-inspection` | Free Roof Inspection in Toledo, OH \| NextGen Roofing | Free Roof Inspection in Toledo, OH — Know exactly where your roof stands. | Service, FAQPage, BreadcrumbList | **New page** (verified service: GBP "Roof inspection", BBB "Free Inspections") |
| `/estimate` | Roof Cost Estimator — Ballpark Pricing \| NextGen Roofing | Roof Cost Estimator — What will my roof cost? | BreadcrumbList | Title/description; breadcrumb |
| `/projects` | Roofing Projects & Drone Footage \| NextGen Roofing | Roofing Projects — Work you can see from every angle. | BreadcrumbList | Title/description |
| `/projects/*` (7) | e.g. Gray Hip Roof Shingle Project \| NextGen Roofing | Residential Roofing Project — {title} | CreativeWork, BreadcrumbList | Search titles for thin names; fuller descriptions; "Planning something similar?" links to service, inspection, estimate |
| `/about` | About NextGen — Second-Generation Roofers \| NextGen Roofing | About NextGen Roofing & Construction — … | BreadcrumbList | Title was 84 chars |
| `/contact` | Contact & Free Roof Inspection, Toledo OH \| NextGen Roofing | Contact NextGen Roofing · Toledo, OH — Schedule your free inspection. | BreadcrumbList | Link to inspection page |
| `/privacy`, `/terms` | Privacy Policy / Terms & Website Disclaimers | unchanged | — | Privacy text now switches automatically when GA4 is enabled |

Every page: self-referencing canonical on `https://nextgenroofing.work`, Open Graph/Twitter cards,
`og:locale`, one H1, no skipped heading levels, alt text on every content image (decorative images use `alt=""`).

## Structured data

Site-wide `@graph`: **RoofingContractor** (`/#business`: name, phone, full address, hours as listed on
GBP, founder, contact point, areaServed Toledo + Ohio, real photos, logo, OfferCatalog of the 5
services, Facebook `sameAs`) and **WebSite** (`/#website`). Per page: **Service** (with `@id`s matching
the catalog), **BreadcrumbList**, **FAQPage** (valid, but Google shows FAQ rich results only for
government/health sites — kept for semantics), **CreativeWork** for projects.

No `aggregateRating`/`review` markup (self-serving local-business review markup is not eligible and
is deliberately excluded). Validation: all 47 JSON-LD blocks type-check against the schema.org
vocabulary (`schema-dts`), plus Google's required properties for LocalBusiness and BreadcrumbList.
**Run Google's Rich Results Test on the live URLs after deploy** (not reachable from the audit environment).

## Host & crawl hygiene

- `www.nextgenroofing.work` → `https://nextgenroofing.work` (308, path and query preserved).
- `*.onrender.com` responses carry `X-Robots-Tag: noindex, nofollow` (duplicate-host protection).
- `/hero-concepts` is `noindex` and no longer blocked in robots.txt (so crawlers can see the noindex).
- Sitemap: 19 URLs with 38 image entries; robots.txt points to it.

## Measurement (code ready; needs IDs)

| Event | When | Parameters (no personal data) |
| --- | --- | --- |
| `generate_lead` | A request is **confirmed** by the server (estimator or contact form) | `form_source`, `preferred_contact` |
| `estimate_complete` | The estimator returns a result | `sector`, `scope`, `result` |
| `click_to_call` | Any `tel:` link is clicked | `link_location`, `page_path` |

Enable by setting `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Render (requires a rebuild). Verified with a
test build: one script request, each event fires exactly once, no personal data sent.

## Google setup checklist (owner access required)

**Search Console**
1. Add a **Domain property** for `nextgenroofing.work` and verify via the DNS TXT record at the registrar (no code change). HTML-tag verification is also supported via `NEXT_PUBLIC_GSC_VERIFICATION`.
2. Submit `https://nextgenroofing.work/sitemap.xml`.
3. Use URL Inspection → Request indexing for `/`, the five service pages and `/roof-inspection`.
4. Watch Pages (indexing) and Core Web Vitals (field data appears only after enough Chrome traffic).

**Google Analytics 4**
1. Create a GA4 property and web stream for `https://nextgenroofing.work`; keep Enhanced Measurement on.
2. Put the `G-…` ID in Render as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and redeploy.
3. Mark `generate_lead` (and optionally `click_to_call`) as **key events**.
4. Optional: link GA4 to Search Console.

**Google Business Profile** (do not change without the owner's approval)
1. Website field → `https://nextgenroofing.work` (no tracking parameters needed; UTM optional: `?utm_source=google&utm_medium=organic&utm_campaign=gbp`).
2. Name exactly "NextGen Roofing & Construction" (no keywords added), phone (440) 228-5933 — matches the site.
3. Primary category **Roofing contractor**; consider secondary categories that match real services (e.g. "Commercial roofing contractor") — only ones NextGen actually performs.
4. Services list: mirror the site's services (inspection, replacement, repair, residential, commercial, flat roofing systems).
5. Address/service area: the site shows the street address. If the address is a home office and customers are not served there, Google's guidelines call for a **service-area business** with the address hidden — then remove the street address from the website and schema too (single change in `src/content/business.ts`). Confirm with the owner.
6. "Open 24 hours" is shown on the site because it is on the profile — confirm it is accurate; change both together if not.
7. Upload the real project photos and the father-and-son photo; post projects periodically.
8. Ask satisfied customers for Google reviews (no incentives); reply to reviews.

## Content opportunities

**Implementation-ready (done in this branch):** `/roof-inspection`.

**Need client information before publishing (do not publish speculative versions):**

| Opportunity | Intent | What's needed |
| --- | --- | --- |
| Project case studies (location, product, scope, timeline) | high | City/neighborhood, shingle/membrane product and color, homeowner permission |
| Commercial project page(s) | high | A real commercial job (e.g. the roof in the father-and-son photo) with details and permission |
| Storm / wind / hail damage page | high | Confirmation NextGen performs storm repairs and whether it works with insurance claims |
| Emergency / tarping page | high | Confirmation of emergency service (GBP says "Open 24 hours") |
| Service-area pages (e.g. specific suburbs) | medium | Confirmed list of areas actually served + genuinely local content per area — avoid duplicate city pages |
| Reviews/testimonials section | medium | Real review text with permission |
| Maintenance / education articles (flat-roof maintenance, coating vs. replacement) | medium | Owner review for accuracy; publish only with real expertise input |

## 30 / 60 / 90 days (by lead impact)

**0–30:** deploy this branch → Search Console domain property + sitemap → GA4 ID + key events → GBP
website/categories/services/photos aligned → confirm address vs service-area status and 24-hour hours →
connect the lead sheet → start asking for reviews → Rich Results Test on live pages.

**31–60:** publish 2–3 detailed case studies (with locations/products) → storm-damage and/or emergency
page if confirmed → review Search Console queries and adjust titles/descriptions for pages with
impressions but low CTR → add genuine reviews to the site.

**61–90:** commercial case study and commercial landing improvements based on GSC queries → service-area
content only where there is real local work to show → a few owner-reviewed educational articles →
evaluate field Core Web Vitals in Search Console.

## Verify after deploy

- `curl -I https://www.nextgenroofing.work/` → 308 to the apex; `curl -I https://nextgenroofing.work/` → 200, no `X-Robots-Tag`.
- `curl -I https://<service>.onrender.com/` → `X-Robots-Tag: noindex, nofollow`.
- Rich Results Test (Breadcrumb, LocalBusiness detection) on `/`, a service page and a project page.
- Search Console URL Inspection: "URL is on Google" only after Google indexes it — indexable ≠ indexed.
