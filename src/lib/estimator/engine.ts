/**
 * Preliminary roof estimate engine (pure; no I/O).
 *
 *   roof area (sq ft) × installed unit rate (material + labor × labor factors)
 *     × complexity factors × geographic factor + tear-off + fixed allowance
 *   → floored at the minimum job charge → widened into a range whose spread
 *     grows with every "I'm not sure" answer.
 */
import type { CommercialInput, EstimateInput, EstimateResult, ResidentialInput } from "./schema";

export type PricingConfig = {
  version: string;
  status: "demonstration" | "approved";
  enabled: boolean;
  disclaimer: string;
  residential: {
    materials: Record<string, { label: string; materialPerSqft: number; laborPerSqft: number }>;
    pitchFactor: Record<string, number>;
    pitchLaborFactor: Record<string, number>;
    storiesFactor: Record<string, number>;
    complexityFactor: Record<string, number>;
    tearOffPerSqft: Record<string, number>;
    overhangFactor: number;
    homeSizeBuckets: Record<string, number>;
    allowance: number;
    minimumJob: number;
  };
  commercial: {
    systems: Record<
      string,
      { label: string; materialPerSqft: number; laborPerSqft: number; requiresSoundSubstrate?: boolean; noTearOff?: boolean }
    >;
    unsureSystems: string[];
    slopeFactor: Record<string, number>;
    accessFactor: Record<string, number>;
    complexityFactor: Record<string, number>;
    tearOffPerSqft: number;
    buildingSizeBuckets: Record<string, number>;
    maxAutoEstimateSqft: number;
    allowance: number;
    minimumJob: number;
  };
  geographic: { default: number; zipPrefixes: Record<string, number> };
  range: { baseSpread: number; perUnknown: number; maxSpread: number; roundTo: number };
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function geoFactor(cfg: PricingConfig, zip: string) {
  const prefixes = Object.keys(cfg.geographic.zipPrefixes).sort((a, b) => b.length - a.length);
  const hit = prefixes.find((p) => zip.startsWith(p));
  return hit ? cfg.geographic.zipPrefixes[hit] : cfg.geographic.default;
}

function finalize(
  cfg: PricingConfig,
  nominalLow: number,
  nominalHigh: number,
  unknowns: number,
  minimumJob: number,
) {
  const spread = Math.min(cfg.range.maxSpread, cfg.range.baseSpread + cfg.range.perUnknown * unknowns);
  const r = cfg.range.roundTo;
  let low = Math.floor((Math.max(nominalLow, minimumJob) * (1 - spread)) / r) * r;
  let high = Math.ceil((Math.max(nominalHigh, minimumJob) * (1 + spread)) / r) * r;
  low = Math.max(low, Math.floor(minimumJob / r) * r);
  high = Math.max(high, low + r);
  return { low, high, spread };
}

function inspection(cfg: PricingConfig, reason: string, assumptions: string[] = []): EstimateResult {
  return { kind: "inspection", reason, assumptions, pricingStatus: cfg.status, pricingVersion: cfg.version };
}

export function estimateResidential(cfg: PricingConfig, i: ResidentialInput): EstimateResult {
  const c = cfg.residential;
  const assumptions: string[] = [];
  const variation: string[] = [];
  let unknowns = 0;

  if (i.scope === "repair") {
    return inspection(cfg, "Repairs depend on what is found at the source of the problem, so they are priced after a free on-site inspection rather than by formula.");
  }

  // Pitch
  let pitch: string = i.pitch;
  if (pitch === "unsure") { pitch = "medium"; unknowns++; assumptions.push("Roof pitch not known — a moderate pitch (about 5/12–7/12) is assumed."); }
  // Stories
  let stories: string = i.stories;
  if (stories === "unsure") { stories = "2"; unknowns++; assumptions.push("Number of stories not known — a two-story home is assumed for access."); }
  // Complexity
  let complexity: string = i.complexity;
  if (complexity === "unsure") { complexity = "moderate"; unknowns++; assumptions.push("Roof shape not known — moderate complexity (some hips, valleys or dormers) is assumed."); }
  // Material
  let material: string = i.material;
  if (material === "unsure") { material = "architectural"; unknowns++; assumptions.push("Material not chosen — priced as architectural asphalt shingle, the most common choice."); }
  const m = c.materials[material];
  // Tear-off
  let tear: string = i.scope === "new" ? "none" : i.tearOff;
  if (tear === "unsure") { tear = "one"; unknowns++; assumptions.push("Existing layers not known — removal of one layer is assumed."); }
  if (i.scope === "new") assumptions.push("New installation — no existing roof removal included.");

  // Area
  let areaLow: number, areaHigh: number;
  const pf = c.pitchFactor[pitch];
  if (i.area.method === "roof") {
    areaLow = areaHigh = i.area.sqft;
    assumptions.push(`Roof surface area of ${fmt(i.area.sqft)} sq ft as entered.`);
  } else {
    const living = i.area.method === "home" ? i.area.sqft : c.homeSizeBuckets[i.area.bucket];
    const storyCount = stories === "3" ? 3 : stories === "2" ? 2 : 1;
    const footprint = living / storyCount;
    const nominal = footprint * c.overhangFactor * pf;
    // Uncertainty about attached garages / porches widens the area band.
    areaLow = nominal * 0.95;
    areaHigh = nominal * (i.area.method === "bucket" ? 1.2 : 1.1);
    if (i.area.method === "bucket") unknowns += 2; else unknowns += 1;
    assumptions.push(
      `Roof area estimated from ${i.area.method === "bucket" ? "the selected home size" : `${fmt(living)} sq ft of living space`}: footprint ÷ stories, plus ${Math.round((c.overhangFactor - 1) * 100)}% for overhangs, × ${pf.toFixed(2)} for pitch.`,
    );
    variation.push("Attached garages, porches and additions add roof area beyond the living space.");
  }

  const laborFactor = c.pitchLaborFactor[pitch] * c.storiesFactor[stories];
  const perSqft = (m.materialPerSqft + m.laborPerSqft * laborFactor) * c.complexityFactor[complexity] + c.tearOffPerSqft[tear];
  const geo = geoFactor(cfg, i.zip);
  const nominalLow = areaLow * perSqft * geo + c.allowance;
  const nominalHigh = areaHigh * perSqft * geo + c.allowance;
  const { low, high } = finalize(cfg, nominalLow, nominalHigh, unknowns, c.minimumJob);

  assumptions.unshift(`${m.label}, installed.`);
  assumptions.push("Includes a standard allowance for disposal and permits.");
  variation.push(
    "Decking replacement — rotted or damaged sheathing is only visible after tear-off.",
    "Flashing, ventilation and chimney or skylight details.",
    "Exact product line and color selection.",
  );

  return {
    kind: "estimate",
    low,
    high,
    roofAreaSqft: { low: Math.round(areaLow), high: Math.round(areaHigh) },
    assumptions,
    variationFactors: variation,
    pricingStatus: cfg.status,
    pricingVersion: cfg.version,
  };
}

export function estimateCommercial(cfg: PricingConfig, i: CommercialInput): EstimateResult {
  const c = cfg.commercial;
  const assumptions: string[] = [];
  const variation: string[] = [];
  let unknowns = 0;

  if (i.scope === "repair") {
    return inspection(cfg, "Commercial repairs are scoped on site — the source of a leak and the condition of the surrounding membrane determine the work.");
  }

  // Area
  let area: number;
  if (i.area.method === "bucket") {
    if (i.area.bucket === "xl") return inspection(cfg, "Roofs over 40,000 sq ft are bid individually after a site survey.");
    area = c.buildingSizeBuckets[i.area.bucket];
    unknowns += 2;
    assumptions.push(`Roof area assumed at about ${fmt(area)} sq ft from the selected building size.`);
  } else {
    area = i.area.sqft;
    assumptions.push(`Roof area of ${fmt(area)} sq ft as entered${i.area.method === "home" ? " (building footprint; flat roofs closely match footprint)" : ""}.`);
  }
  if (area > c.maxAutoEstimateSqft) {
    return inspection(cfg, `Roofs over ${fmt(c.maxAutoEstimateSqft)} sq ft are bid individually after a site survey.`, assumptions);
  }

  // System(s)
  const systemKeys = i.system === "unsure" ? c.unsureSystems : [i.system];
  if (i.system === "unsure") {
    unknowns++;
    assumptions.push(`System not chosen — range spans ${systemKeys.map((k) => c.systems[k].label).join(", ")}.`);
  }
  const sys = systemKeys.map((k) => c.systems[k]);
  const needsSound = sys.some((s) => s.requiresSoundSubstrate);
  if (needsSound && i.condition === "poor") {
    return inspection(
      cfg,
      `${sys[0].label} requires a sound, dry existing roof. With the roof in poor condition, replacement may be needed — an on-site survey with moisture checks will determine the right system.`,
      assumptions,
    );
  }
  if (needsSound && i.condition === "unsure") {
    unknowns++;
    assumptions.push("Assumes the existing roof is sound and dry enough for this system — confirmed at inspection.");
  }

  let slope: string = i.slope;
  if (slope === "unsure") { slope = "flat"; unknowns++; assumptions.push("Slope not known — a flat roof is assumed."); }
  let access: string = i.access;
  if (access === "unsure") { access = "moderate"; unknowns++; assumptions.push("Access not known — moderate access is assumed."); }
  let complexity: string = i.complexity;
  if (complexity === "unsure") { complexity = "moderate"; unknowns++; assumptions.push("Rooftop complexity not known — a moderate number of penetrations and equipment is assumed."); }

  const noTear = sys.every((s) => s.noTearOff) || i.scope === "new";
  let tearLow = 0, tearHigh = 0;
  if (!noTear) {
    if (i.tearOff === "tear-off") { tearLow = tearHigh = c.tearOffPerSqft; assumptions.push("Includes removal of the existing roof."); }
    else if (i.tearOff === "overlay") {
      assumptions.push("Assumes a recover over the existing roof (no tear-off).");
      if (i.condition === "poor") variation.push("A roof in poor condition is often not suitable for overlay; tear-off may be required.");
    } else { tearHigh = c.tearOffPerSqft; unknowns++; assumptions.push("Tear-off vs. overlay not known — the range covers both."); }
  }
  if (i.scope === "new") assumptions.push("New installation — no existing roof removal included.");

  const factor = c.slopeFactor[slope] * c.accessFactor[access] * c.complexityFactor[complexity] * geoFactor(cfg, i.zip);
  const rates = sys.map((s) => s.materialPerSqft + s.laborPerSqft);
  const nominalLow = area * (Math.min(...rates) * factor + tearLow) + c.allowance;
  const nominalHigh = area * (Math.max(...rates) * factor + tearHigh) + c.allowance;
  const { low, high } = finalize(cfg, nominalLow, nominalHigh, unknowns, c.minimumJob);

  if (i.system !== "unsure") assumptions.unshift(`${sys[0].label}, installed.`);
  assumptions.push("Includes a standard allowance for mobilization, disposal and permits.");
  variation.push(
    "Insulation replacement or tapered insulation for drainage.",
    "Edge metal, curbs, drains and rooftop equipment work.",
    "Wet insulation found during moisture survey.",
  );

  return {
    kind: "estimate",
    low,
    high,
    roofAreaSqft: { low: Math.round(area), high: Math.round(area) },
    assumptions,
    variationFactors: variation,
    pricingStatus: cfg.status,
    pricingVersion: cfg.version,
  };
}

export type EstimatorMode = "live" | "demo" | "inspection-only";

export function runEstimate(cfg: PricingConfig, input: EstimateInput, mode: EstimatorMode): EstimateResult {
  if (!cfg.enabled || mode === "inspection-only") {
    return {
      kind: "inspection",
      reason: "Online pricing isn't available right now. Every roof is different — request a free inspection and we’ll provide an estimate based on actual measurements.",
      assumptions: [],
      pricingStatus: cfg.enabled ? cfg.status : "disabled",
      pricingVersion: cfg.version,
    };
  }
  return input.sector === "residential" ? estimateResidential(cfg, input) : estimateCommercial(cfg, input);
}
