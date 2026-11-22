import { describe, expect, it } from "vitest";
import cfgJson from "../../config/pricing.json";
import { runEstimate, type PricingConfig } from "@/lib/estimator/engine";
import { estimateInput, type EstimateInput } from "@/lib/estimator/schema";

const cfg = cfgJson as unknown as PricingConfig;
const res = (o: Partial<Extract<EstimateInput, { sector: "residential" }>> = {}): EstimateInput =>
  estimateInput.parse({
    sector: "residential", scope: "replacement", zip: "43604",
    area: { method: "roof", sqft: 2000 }, material: "architectural",
    pitch: "medium", stories: "1", complexity: "simple", tearOff: "one", ...o,
  });
const com = (o: Record<string, unknown> = {}): EstimateInput =>
  estimateInput.parse({
    sector: "commercial", scope: "replacement", zip: "43604",
    area: { method: "roof", sqft: 10000 }, system: "epdm", slope: "flat",
    condition: "fair", tearOff: "tear-off", access: "easy", complexity: "low", ...o,
  });

describe("residential", () => {
  it("computes area × rate + tear-off + allowance, ±base spread", () => {
    const r = runEstimate(cfg, res(), "demo");
    expect(r.kind).toBe("estimate");
    if (r.kind !== "estimate") return;
    // (2.1 + 2.4) * 1 + 0.85 = 5.35/sqft × 2000 + 650 = 11,350 → ±10%
    expect(r.low).toBe(10200);
    expect(r.high).toBe(12500);
    expect(r.pricingStatus).toBe("demonstration");
  });

  it("does not treat home living area as roof area", () => {
    const r = runEstimate(cfg, res({ area: { method: "home", sqft: 2000 }, stories: "2" }), "demo");
    if (r.kind !== "estimate") throw new Error();
    // footprint 1000 × 1.10 overhang × 1.12 pitch = 1232 nominal
    expect(r.roofAreaSqft.low).toBe(Math.round(1232 * 0.95));
    expect(r.roofAreaSqft.high).toBe(Math.round(1232 * 1.1));
    expect(r.assumptions.join(" ")).toMatch(/overhangs/);
  });

  it("widens the range for each unsure answer", () => {
    const sure = runEstimate(cfg, res(), "demo");
    const unsure = runEstimate(cfg, res({ pitch: "unsure", complexity: "unsure", tearOff: "unsure" }), "demo");
    if (sure.kind !== "estimate" || unsure.kind !== "estimate") throw new Error();
    expect((unsure.high - unsure.low) / unsure.high).toBeGreaterThan((sure.high - sure.low) / sure.high);
  });

  it("steeper roofs cost more", () => {
    const a = runEstimate(cfg, res({ pitch: "low" }), "demo");
    const b = runEstimate(cfg, res({ pitch: "very-steep" }), "demo");
    if (a.kind !== "estimate" || b.kind !== "estimate") throw new Error();
    expect(b.low).toBeGreaterThan(a.low);
  });

  it("enforces the minimum job charge", () => {
    const r = runEstimate(cfg, res({ area: { method: "roof", sqft: 150 } }), "demo");
    if (r.kind !== "estimate") throw new Error();
    expect(r.low).toBeGreaterThanOrEqual(cfg.residential.minimumJob);
  });

  it("routes repairs to inspection", () => {
    expect(runEstimate(cfg, res({ scope: "repair" }), "demo").kind).toBe("inspection");
  });

  it("new construction excludes tear-off", () => {
    const a = runEstimate(cfg, res({ scope: "new", tearOff: "two" }), "demo");
    const b = runEstimate(cfg, res({ tearOff: "none" }), "demo");
    if (a.kind !== "estimate" || b.kind !== "estimate") throw new Error();
    expect(a.low).toBe(b.low);
  });
});

describe("commercial", () => {
  it("estimates a sized EPDM tear-off", () => {
    const r = runEstimate(cfg, com(), "demo");
    if (r.kind !== "estimate") throw new Error();
    // (3.5+3.0)*1 + 1.5 = 8.0 × 10000 + 1500 = 81,500 → ±10%
    expect(r.low).toBe(73300);
    expect(r.high).toBe(89700);
  });

  it("coating over a poor roof requires inspection", () => {
    expect(runEstimate(cfg, com({ system: "coating", condition: "poor" }), "demo").kind).toBe("inspection");
  });

  it("coatings never include tear-off", () => {
    const a = runEstimate(cfg, com({ system: "coating", tearOff: "tear-off" }), "demo");
    const b = runEstimate(cfg, com({ system: "coating", tearOff: "overlay" }), "demo");
    if (a.kind !== "estimate" || b.kind !== "estimate") throw new Error();
    expect(a.low).toBe(b.low);
  });

  it("very large roofs require a site survey", () => {
    expect(runEstimate(cfg, com({ area: { method: "roof", sqft: 60000 } }), "demo").kind).toBe("inspection");
    expect(runEstimate(cfg, com({ area: { method: "bucket", bucket: "xl" } }), "demo").kind).toBe("inspection");
  });

  it("unsure system spans multiple systems", () => {
    const r = runEstimate(cfg, com({ system: "unsure" }), "demo");
    if (r.kind !== "estimate") throw new Error();
    expect(r.assumptions.join(" ")).toMatch(/EPDM.*TPO/);
  });
});

describe("modes", () => {
  it("inspection-only mode never returns prices", () => {
    expect(runEstimate(cfg, res(), "inspection-only").kind).toBe("inspection");
  });
  it("disabled config returns inspection", () => {
    expect(runEstimate({ ...cfg, enabled: false }, res(), "demo").kind).toBe("inspection");
  });
  it("rejects invalid ZIPs", () => {
    expect(() => res({ zip: "4360" })).toThrow();
  });
});
