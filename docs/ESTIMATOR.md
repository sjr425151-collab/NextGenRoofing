# Roof Estimator

## How a result is produced

All calculation happens **on the server** (`POST /api/estimate` → `src/lib/estimator/engine.ts`). Rates never ship to the browser, and the lead API recalculates the estimate itself rather than trusting numbers sent by the client.

```
roof area (sq ft)
  × installed rate  = material + labor × (pitch labor factor × stories factor)
  × complexity factor
  × geographic factor (by ZIP prefix)
  + tear-off per sq ft (by layers)
  + fixed allowance (disposal / permits / mobilization)
→ floored at the minimum job charge
→ widened to a range: ±(10% + 5% per "I'm not sure" answer), capped at ±30%
→ rounded to the nearest $100
```

### Roof area — not the same as home size

Visitors can give area three ways:

| Input | Conversion |
| --- | --- |
| Roof surface area | Used as entered |
| Home living space (residential) | `living ÷ stories` = footprint → `× 1.10` overhangs → `× pitch factor` (1.06 – 1.42). Band widened −5% / +10% for garages, porches, additions |
| Size range ("not sure") | Bucket midpoint, band −5% / +20%, counts as two unknowns |
| Building footprint (commercial) | Used ~1:1 (flat roofs closely match footprint) |

The UI explains this distinction inline.

### Rules that return "inspection required" instead of a price

- Any **repair** (priced on site, never by formula)
- Commercial roofs **over 40,000 sq ft** (bid individually)
- **Coating or spray foam** over a roof described as **poor** (requires a sound substrate)
- Estimator disabled, or running in **inspection-only** mode (see below)

### Assumptions & variation

Every estimate returns the list of assumptions applied (shown to the visitor and saved with the lead) and the factors that can change the final price.

## Modes and the production safety gate

| Pricing `status` | Environment | Mode | Visitor sees |
| --- | --- | --- | --- |
| `demonstration` | development | `demo` | Range + amber “Demonstration pricing — not NextGen rates” badge |
| `demonstration` | production | `inspection-only` | No price; free-inspection request |
| `demonstration` | production + `ALLOW_DEMO_PRICING=true` | `demo` | Range + demo badge (client review deploys only) |
| `ballpark` | any | `live` | **Current.** Range labelled “Ballpark estimate” with a “Call for exact rates” button |
| `approved` | any | `live` | Range |
| any | `ESTIMATOR_MODE=inspection-only` | `inspection-only` | No price |

**Client decision (Nov 22, 2026):** NextGen has no fixed price list; the estimator shows ballpark ranges only and directs visitors to call for exact rates. `config/pricing.json` is set to `"status": "ballpark"`. Its rates are generic Toledo-area market ballparks chosen during development (e.g. architectural shingle replacement ≈ $5.35/sq ft installed incl. one-layer tear-off; EPDM ≈ $6.50/sq ft + $1.50 tear-off) — recommend Ryan sanity-check a few results and adjust if they run high or low.

## Administration (pricing changes)

No admin login exists yet, so pricing is administered as server-side configuration — never through a public page:

1. Copy `config/pricing.json`, replace the rates with NextGen-approved values, set `"status": "approved"` and bump `"version"`.
2. Provide it to the server by one of:
   - `PRICING_CONFIG_PATH` → a file on a mounted secret/volume, or
   - `PRICING_CONFIG_JSON` → the JSON in a secret environment variable, or
   - committing the updated `config/pricing.json`.
3. Redeploy (or restart). `version` is saved on each lead so you can tell which rates a visitor saw.

Configurable values: material and labor rates per system, pitch / stories / complexity / access factors, tear-off rates, overhang factor, size buckets, allowances, minimum job charges, the large-roof cutoff, ZIP-prefix geographic factors, range spread, rounding, the disclaimer text, and `enabled` to switch online pricing off entirely.

**Next step (recommended):** a password-protected admin screen (e.g., behind the host's SSO or Auth.js) that edits this JSON in a database. The engine already takes the config as an argument, so only the loader in `src/server/pricing.ts` needs to change.

## Tests

`tests/unit/estimator.test.ts` checks hand-calculated figures, the home-size conversion, uncertainty widening, minimums, pitch ordering, the inspection rules and modes. `tests/e2e/flows.spec.ts` drives the full UI through to a stored lead.
