/**
 * Single source of truth for NextGen business facts.
 *
 * RULE: nothing here may be invented. Every time-sensitive credential carries
 * its source and the date it was last confirmed. Fields set to `null` are
 * unknown and the UI hides them rather than guessing.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.example.com").replace(/\/$/, "");

export const business = {
  legalName: "NextGen Roofing & Construction LLC",
  shortName: "NextGen Roofing & Construction",
  tagline: "Raising the Standard",
  phone: { display: "(440) 228-5933", e164: "+14402285933" },
  /** Business email for display is not yet supplied. */
  email: null as string | null,
  address: {
    /** Street address not supplied; only city/state are verified. */
    street: null as string | null,
    city: "Toledo",
    region: "OH",
    regionName: "Ohio",
    postalCode: null as string | null,
    country: "US",
  },
  /** Hours not supplied — hidden until confirmed. */
  hours: null as string | null,
  /** Service area beyond Toledo is not verified — do not list towns. */
  serviceAreaNote: "Based in Toledo, Ohio",
  founder: {
    name: "Ryan Cole",
  },
  /** Father-and-son photograph — supplied by client but not yet delivered to this project. */
  familyPhoto: null as { src: string; alt: string } | null,
  family: {
    fatherName: "Frank",
    fatherCompany: "C&S Roofing & Construction",
    fatherYears: "more than 30 years",
  },
  links: {
    facebook: "https://www.facebook.com/share/1T3TWpje8V/?mibextid=wwXIfr",
    /** Exact profile URLs not supplied; search links resolve to the real listings. */
    google: "https://www.google.com/search?q=NextGen+Roofing+%26+Construction+LLC+Toledo+OH",
    bbb: "https://www.bbb.org/search?find_text=NextGen%20Roofing%20%26%20Construction&find_loc=Toledo%2C%20OH",
  },
} as const;

export type Credential = {
  id: string;
  label: string;
  value: string;
  detail: string;
  source: string;
  /** ISO date this was last confirmed against the source. */
  asOf: string;
  href?: string;
};

/**
 * Credentials from client-supplied screenshots (BBB, Google). Re-verify before
 * launch and update `asOf`. Ratings change; never present them without a date.
 */
export const credentials: Credential[] = [
  {
    id: "bbb",
    label: "BBB Accredited",
    value: "A",
    detail: "BBB rating · Accredited since Oct 8, 2025",
    source: "Client-supplied BBB screenshot",
    asOf: "2026-11-22",
    href: business.links.bbb,
  },
  {
    id: "google",
    label: "Google Rating",
    value: "5.0",
    detail: "From 3 Google reviews",
    source: "Client-supplied Google Business Profile screenshot",
    asOf: "2026-11-22",
    href: business.links.google,
  },
];

export const promises = [
  { title: "Free inspections", body: "No-cost roof inspections and estimates." },
  { title: "Residential & commercial", body: "Pitched shingle roofs through flat and low-slope commercial systems." },
  { title: "Second generation", body: "Trained in a family roofing business with more than 30 years in the trade." },
] as const;

export type Review = { author: string; rating: number; text: string; date: string; source: "Google" | "Facebook" | "BBB" };

/**
 * Authentic review text only. The client has not yet supplied review copy, so
 * this list is intentionally empty and the UI shows the verified rating
 * summary with a link to read reviews at the source.
 */
export const reviews: Review[] = [];

export function asOfLabel(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
