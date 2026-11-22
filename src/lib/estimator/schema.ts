import { z } from "zod";

const unsure = "unsure" as const;

export const residentialMaterials = ["architectural", "premium", "metal", "low-slope", unsure] as const;
export const commercialSystems = ["epdm", "tpo", "self-adhering", "torch-down", "spf", "coating", unsure] as const;

export const areaInput = z.discriminatedUnion("method", [
  z.object({ method: z.literal("roof"), sqft: z.number().min(100).max(1_000_000) }),
  z.object({ method: z.literal("home"), sqft: z.number().min(300).max(20_000) }),
  z.object({ method: z.literal("bucket"), bucket: z.enum(["s", "m", "l", "xl"]) }),
]);

const base = {
  scope: z.enum(["replacement", "repair", "new"]),
  zip: z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),
  address: z.string().max(200).optional().default(""),
  area: areaInput,
};

export const residentialInput = z.object({
  sector: z.literal("residential"),
  ...base,
  material: z.enum(residentialMaterials),
  pitch: z.enum(["low", "medium", "steep", "very-steep", unsure]),
  stories: z.enum(["1", "2", "3", unsure]),
  complexity: z.enum(["simple", "moderate", "complex", unsure]),
  tearOff: z.enum(["none", "one", "two", unsure]),
});

export const commercialInput = z.object({
  sector: z.literal("commercial"),
  ...base,
  system: z.enum(commercialSystems),
  slope: z.enum(["flat", "low-slope", unsure]),
  condition: z.enum(["good", "fair", "poor", unsure]),
  tearOff: z.enum(["tear-off", "overlay", unsure]),
  access: z.enum(["easy", "moderate", "difficult", unsure]),
  complexity: z.enum(["low", "moderate", "high", unsure]),
});

export const estimateInput = z.discriminatedUnion("sector", [residentialInput, commercialInput]);

export type EstimateInput = z.infer<typeof estimateInput>;
export type ResidentialInput = z.infer<typeof residentialInput>;
export type CommercialInput = z.infer<typeof commercialInput>;

export type EstimateResult =
  | {
      kind: "estimate";
      low: number;
      high: number;
      roofAreaSqft: { low: number; high: number };
      assumptions: string[];
      variationFactors: string[];
      pricingStatus: "demonstration" | "ballpark" | "approved";
      pricingVersion: string;
    }
  | {
      kind: "inspection";
      reason: string;
      assumptions: string[];
      pricingStatus: "demonstration" | "ballpark" | "approved" | "disabled";
      pricingVersion: string;
    };
