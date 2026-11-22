# Open Items — Business Inputs & Integrations

Everything below is either missing from the supplied assets or requires an owner decision. The site handles each gap honestly in the meantime (hidden, labeled “Pending confirmation,” or routed to an inspection request) — nothing has been invented to fill them.

## Blocking for launch

| # | Item | Why it matters | Current handling |
| --- | --- | --- | --- |
| 1 | **Deploy the Apps Script** on “Lead form requests - Website” (NextGen Gmail) and provide its URL + token — decided, setup steps in `integrations/google-sheets/README.md` | Until then requests cannot reach the business | Forms show “Online requests are temporarily unavailable — please call” |
| 2 | **Domain** and **hosting** choice (paid) | Required to publish | Not purchased or deployed |
| 3 | ✅ Official logo in use (extracted from the logo sheet as transparent PNGs; brand red #BF2A39 sampled from it). Optional: supply SVG/AI vector files for sharper large-format use | — | `public/brand/` |
| 4 | **Homeowner permission** for the three filmed projects | They're customers' homes | Confirm before launch |
| 5 | Credentials confirmed from supplied screenshots (BBB A, accredited 10/8/2025; Google 5.0 / 3 reviews, Nov 22, 2026). **Re-check at launch** — ratings change | — | Displayed with “as of Nov 2026” and a “Verify” link |
| 6 | Privacy Policy / Terms **review** by owner or attorney | Legal accuracy | Drafted to match actual site behavior |

## Needed to complete content

| # | Item | Where it goes |
| --- | --- | --- |
| 7 | ✅ Decided: ballpark ranges + call for exact rates. Optional: Ryan sanity-checks sample results | `config/pricing.json` |
| 8 | ✅ Father-and-son photo in use (hero heritage scene, homepage story, About) with Ryan's quote from his Facebook post | — |
| 9 | ✅ 13 job photos added: 4 new photo projects + 2 field photos. Photos were grouped only where they clearly show the same property | `src/content/projects.ts` |
| 10 | **Project details**: city/neighborhood and shingle product/color for each project (7 total) | `location` / `materials` fields (currently “Pending confirmation”) |
| 11 | **Authentic review text** (with reviewer permission or as publicly posted) | `reviews` in `src/content/business.ts` — section appears automatically |
| 12 | ✅ Founder: Ryan Cole | Shown on homepage, About, and in structured data |
| 13 | ✅ Address (4035 Parrakeet Ave, Toledo, OH 43612) and hours (Open 24 hours) from the Google listing. Still open: a public business **email** (optional) | `business` object |
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
