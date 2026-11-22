# QA Report — 22 Nov 2026

All results below were **measured** against a production build (`next build && next start`) in the cloud build container. Nothing here is estimated.

## Automated tests

| Suite | Result |
| --- | --- |
| Vitest — estimator engine (`npm test`) | **15 / 15 passed** |
| Playwright e2e + axe (`npm run test:e2e`), Desktop Chrome + Pixel 7 | **65 passed, 0 failed** (2 mobile-only tests skipped on the desktop project, by design) |

Coverage of the Playwright suite:

- All 14 public routes: HTTP 200, exactly one `h1`, title, meta description, canonical, **zero console errors**
- **No horizontal overflow** on every route at 320, 375, 390, 430, 768, 1024 and 1440 px
- **axe-core WCAG 2.0/2.1/2.2 A + AA: zero violations** on every route
- Every internal link on every page resolves (200); unknown routes return 404
- `sitemap.xml`, `robots.txt`, and `RoofingContractor` JSON-LD present and correct
- Estimator: residential flow end-to-end → range + demo badge + disclaimer → inspection request → **lead verified in storage with inputs, server-recalculated estimate and assumptions**
- Estimator validation messages; repair → inspection (no price); commercial coating over poor roof → inspection
- **Backend failure (HTTP 502) never shows a success message**
- Server rejects too-fast submissions, filled honeypot, and invalid email
- Contact form success path
- Mobile menu: opens as modal dialog, Escape closes, navigation closes it
- Sticky mobile call bar with working `tel:` link
- Hero: video source selected after first paint, plays, pause control works; scroll sequence reaches the heritage scene and releases normally; **reduced motion** removes the pinned sequence and never loads video; Concept B renders without video

## Lighthouse 13.6 (Chromium, simulated throttling)

Mobile = Lighthouse default (Moto G Power, slow 4G, 4× CPU). Desktop = `--preset=desktop`.

| Form | Page | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mobile | `/` (3 runs) | 89 / 93 / 99 | 100 | 100 | 100 | 0.9–3.1 s | 0 | 120–450 ms |
| mobile | `/residential-roofing` | 95 | 100 | 100 | 100 | 2.2 s | 0 | 200 ms |
| mobile | `/commercial-roofing` | 95 | 100 | 100 | 100 | 2.8 s | 0 | 70 ms |
| mobile | `/roof-repair` | 95 | 100 | 100 | 100 | 2.8 s | 0 | 80 ms |
| mobile | `/flat-roofing` | 98 | 100 | 100 | 100 | 2.2 s | 0 | 100 ms |
| mobile | `/projects` | 93–94 | 100 | 100 | 100 | 3.0–3.1 s | 0 | 60–90 ms |
| mobile | `/projects/full-roof-replacement` | 92–93 | 100 | 100 | 100 | 3.2–3.3 s | 0 | 60–80 ms |
| mobile | `/about` | 95 | 100 | 100 | 100 | 2.7 s | 0 | 150 ms |
| mobile | `/contact` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 120 ms |
| mobile | `/estimate` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 100 ms |
| mobile | `/privacy` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 140 ms |
| desktop | `/` | 100 | 100 | 100 | 100 | 0.3 s | 0 | 0 ms |
| desktop | `/residential-roofing` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| desktop | `/projects` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| desktop | `/estimate` | 100 | 100 | 100 | 100 | 0.2 s | 0 | 0 ms |

**Against targets:** Performance ≥ 90 met on every page except one of three homepage mobile runs (89). Accessibility ≥ 95 and SEO ≥ 95: met everywhere (100). CLS ≤ 0.1: 0 everywhere. INP cannot be measured in a lab; TBT (its lab proxy) stays low. **Mobile LCP ≤ 2.5 s is not met** on pages that open with a full-bleed photo (simulated 2.2–3.3 s); the observed (unthrottled) LCP for those images is ~0.5 s. The cost is one ~20 KB AVIF image competing with fonts and CSS under simulated slow 4G. Text-first pages and the homepage (whose LCP element is the headline) load in 0.8–0.9 s.

Variance note: the homepage runs swing between 89 and 99 because Lighthouse's simulation sometimes picks the hero poster image instead of the headline as the LCP element. Home also measured 68 in one run while a video encode was saturating the machine's CPU; that run is excluded as unrepresentative.

## Fixes made during QA

- Scene 1 copy didn't exit on scroll (CSS `animation-fill-mode: both` overrode GSAP) → `backwards`
- Headline entrance used opacity, delaying LCP by ~1.4 s → transform-only entrance for headlines (homepage LCP 4.0 s → 0.9 s)
- Above-the-fold images fetched at Low priority under Next 16 → explicit `fetchPriority="high"`
- Body font preload competed with hero image → only the display font is preloaded
- WCAG 2.5.3 label-in-name on logo link, film play buttons and gallery buttons → names now contain visible text
- Brand red on charcoal failed contrast for small text → `--color-red-bright` (5.5:1) for small text on dark
- Estimator step headings skipped a level on `/estimate` → configurable heading level
- Heritage scene clipped on 375×667 phones; header crowded at 320 px → tightened mobile layout
- Stills labelled “installation” were actually crossfade/decking frames → re-selected and relabelled

## Not tested — needs manual verification before launch

- **Safari (macOS + iOS) and Firefox.** Only Chromium is available in the build environment. Features used are supported in current Safari 17+/Firefox 121+ (`:has()`, `<dialog>`, `svh/dvh`, AV1 with H.264 fallback, CSS `clip-path` animation), but they have not been exercised there. Pay particular attention to: hero scroll scrubbing on iOS Safari, autoplay of the muted hero loop, and the mobile menu dialog.
- **Real devices** (touch scrolling feel, low-end Android performance).
- **Production lead delivery** — the email and webhook sinks are implemented but untested because no credentials/endpoints exist yet. The file sink was verified end to end.
- **Cloudflare Turnstile** — implemented, not exercised (no keys).
