# Open Items — Business Inputs & Integrations

Everything below is either missing from the supplied assets or requires an owner decision. The site handles each gap honestly in the meantime (hidden, labeled “Pending confirmation,” or routed to an inspection request) — nothing has been invented to fill them.

## Blocking for launch

| # | Item | Why it matters | Current handling |
| --- | --- | --- | --- |
| 1 | **Lead delivery channel** — email address to receive leads and/or a Google Sheet/CRM webhook | Without it, online requests cannot reach the business | Production forms show “Online requests are temporarily unavailable — please call” |
| 2 | **Domain** and **hosting** choice (paid) | Required to publish | Not purchased or deployed |
| 3 | **Original logo files** (light + dark, ideally SVG/AI/EPS or large PNG) | The current mark is a provisional reconstruction traced from the yard sign in the drone footage | `src/components/brand/Logo.tsx`; brand red `#C92E42` is also provisional until sampled from the original |
| 4 | **Homeowner permission** for the three filmed projects | They're customers' homes | Confirm before launch |
| 5 | **Re-verify credentials** (BBB rating/accreditation, Google 5.0 / 3 reviews) | Ratings change; the BBB profile rating couldn't be read publicly from the build environment (a Toledo BBB listing, ID 211019585, does exist) | Displayed with “as of Nov 2026” and a “Verify” link to each source |
| 6 | Privacy Policy / Terms **review** by owner or attorney | Legal accuracy | Drafted to match actual site behavior |

## Needed to complete content

| # | Item | Where it goes |
| --- | --- | --- |
| 7 | **Approved pricing** (material/labor rates, minimums, any geographic adjustments) — or a decision to launch inspection-only | `config/pricing.json` → `"status": "approved"` (see `ESTIMATOR.md`) |
| 8 | **Father-and-son photograph** (mentioned in the brief, not in the Drive folder) | `business.familyPhoto` — About page renders it automatically |
| 9 | **Project photography** (mentioned in the brief, not in the Drive folder) | `src/content/projects.ts` galleries |
| 10 | **Project details**: city/neighborhood and shingle product/color for each of the 3 filmed jobs | `location` / `materials` fields (currently “Pending confirmation”) |
| 11 | **Authentic review text** (with reviewer permission or as publicly posted) | `reviews` in `src/content/business.ts` — section appears automatically |
| 12 | **Founder's name** (and whether to name him on the site) | `business.founder.name` — copy currently says “NextGen's founder” |
| 13 | Business **email**, **street address** (or confirm service-area-only), **hours** | `business` object, footer, JSON-LD |
| 14 | **Service area** — which cities/counties to list | Currently only “Toledo, Ohio”; no towns listed to avoid unverified claims |
| 15 | Confirm the **process copy** on service pages (inspection → estimate → installation → walkthrough) and the “Why NextGen” statements reflect how NextGen actually works | `src/content/services.ts`, `src/components/home/Sections.tsx` |
| 16 | Licensing / insurance / warranty / financing details — only if NextGen wants them shown | Not displayed anywhere today |
| 17 | Facebook page link — the supplied share link works but a canonical page URL is preferable | `business.links.facebook` |
| 18 | Direct Google Business Profile and BBB profile URLs | `business.links` (search links used now) |

## Optional integrations (owner approval required)

- **Cloudflare Turnstile** (free) — bot protection on forms. Code is in place; add keys.
- **Resend** (free tier) — lead email delivery. Code is in place; add key + verified domain.
- **Analytics** — none installed. If added, update the Privacy Policy first and avoid sending form fields.
- **Admin pricing screen** — not built; pricing is managed as server-side config (see `ESTIMATOR.md`).
