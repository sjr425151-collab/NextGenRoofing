# NextGen Roofing & Construction — Website

Production website for **NextGen Roofing & Construction LLC** (Toledo, OH): a cinematic, scroll-driven homepage built from the company's own drone footage, a working roof estimator, and a secure lead pipeline.

> **Status:** build complete and tested. **Not yet launch-ready.** Business inputs and a lead-delivery channel still need to be supplied — see [`docs/OPEN-ITEMS.md`](docs/OPEN-ITEMS.md).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 with design tokens in `src/app/globals.css` |
| Motion | GSAP 3 + ScrollTrigger (homepage hero only, lazy-loaded), CSS transitions, IntersectionObserver |
| Validation | Zod (shared client/server schemas) |
| Tests | Vitest (estimator engine), Playwright + axe-core (e2e, accessibility) |
| Fonts | Manrope (display) + Inter (text), self-hosted |

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000 — demo pricing, leads written to ./data/leads.jsonl
npm test               # estimator unit tests
npm run build && npm run test:e2e   # end-to-end + accessibility suite
```

## Project structure

```
config/pricing.json            Estimator rates (DEMONSTRATION values) — server-side only
scripts/media/                 Footage pipeline (FFmpeg) + OG/icon generator
public/media/                  Processed video loops, project films, stills
src/app/                       Routes (pages + /api/estimate + /api/leads)
src/components/home/           Cinematic hero + homepage sections
src/components/estimator/      Multi-step estimator UI
src/components/forms/          Accessible form primitives + lead form
src/content/                   Business facts, services, projects (single source of truth)
src/lib/estimator/             Pure pricing engine + schemas
src/server/                    Pricing loader, lead sinks, abuse guards (server-only)
tests/                         unit/ and e2e/
docs/                          Media, estimator, QA, deployment and open-items docs
```

## Pages

`/` · `/residential-roofing` · `/commercial-roofing` · `/roof-repair` · `/flat-roofing` · `/projects` · `/projects/[slug]` · `/about` · `/contact` · `/estimate` · `/privacy` · `/terms` · `/hero-concepts` (internal, noindex — compare hero A/B)

## Editing content

- **Business facts, credentials, reviews:** `src/content/business.ts`. Every credential has a source and `asOf` date; update both when re-verifying. Add authentic reviews to `reviews` and they appear automatically.
- **Services copy:** `src/content/services.ts`
- **Projects:** `src/content/projects.ts`. `location` / `materials` show "Pending confirmation" until filled in.
- **Family photo:** set `business.familyPhoto` once the photograph is supplied.
- **Logo:** `src/components/brand/Logo.tsx` holds a *provisional* reconstruction. Replace with the original artwork when received.

## Documentation

- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — environment variables, hosting, launch checklist
- [`docs/ESTIMATOR.md`](docs/ESTIMATOR.md) — calculation, configuration, administration
- [`docs/MEDIA.md`](docs/MEDIA.md) — footage audit and enhancement pipeline
- [`docs/QA-REPORT.md`](docs/QA-REPORT.md) — test and Lighthouse results
- [`docs/OPEN-ITEMS.md`](docs/OPEN-ITEMS.md) — business inputs and integrations still required
