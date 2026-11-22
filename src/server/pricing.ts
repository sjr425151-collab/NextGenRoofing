import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import defaultConfig from "../../config/pricing.json";
import type { EstimatorMode, PricingConfig } from "@/lib/estimator/engine";

/**
 * Pricing is configured server-side only and never shipped to the browser.
 *
 * Sources, in priority order:
 *   1. PRICING_CONFIG_PATH — path to a JSON file (e.g. a mounted secret/volume)
 *   2. PRICING_CONFIG_JSON — the JSON itself in an environment variable
 *   3. config/pricing.json — bundled demonstration values
 */
export async function loadPricing(): Promise<PricingConfig> {
  try {
    if (process.env.PRICING_CONFIG_PATH) {
      const raw = await readFile(path.resolve(process.env.PRICING_CONFIG_PATH), "utf8");
      return JSON.parse(raw) as PricingConfig;
    }
    if (process.env.PRICING_CONFIG_JSON) return JSON.parse(process.env.PRICING_CONFIG_JSON) as PricingConfig;
  } catch (err) {
    console.error("[pricing] Failed to load configured pricing; falling back to inspection-only.", (err as Error).message);
    return { ...(defaultConfig as unknown as PricingConfig), enabled: false };
  }
  return defaultConfig as unknown as PricingConfig;
}

/**
 * Production safety gate: unapproved (demonstration) rates are never shown in
 * production unless ALLOW_DEMO_PRICING=true is set explicitly for a review
 * deployment — and even then the UI labels them as demonstration values.
 */
export function resolveMode(cfg: PricingConfig): EstimatorMode {
  const requested = process.env.ESTIMATOR_MODE as EstimatorMode | undefined;
  const isProd = process.env.NODE_ENV === "production";
  const allowDemo = !isProd || process.env.ALLOW_DEMO_PRICING === "true";

  if (requested === "inspection-only") return "inspection-only";
  if (cfg.status === "approved" || cfg.status === "ballpark") return "live";
  return allowDemo ? "demo" : "inspection-only";
}
