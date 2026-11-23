export type ServiceSlug = "residential-roofing" | "commercial-roofing" | "roof-repair" | "flat-roofing" | "roof-inspection";

export type System = { name: string; summary: string; bestFor: string };

export type Service = {
  slug: ServiceSlug;
  nav: string;
  title: string;
  eyebrow: string;
  /** Descriptive label rendered as the first line of the page's H1 (e.g. "Residential Roofing in Toledo, OH"). */
  h1Label: string;
  /** Core services appear in the homepage/About service grids; others only in menus and links. */
  core: boolean;
  /** Optional primary hero CTA (defaults to the on-page estimator). */
  primaryCta?: { label: string; href: string };
  headline: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  image: string;
  imageAlt: string;
  /** CSS object-position for crops (default center). */
  imagePosition?: string;
  /** When true, the page shows only its own image (no project thumbnails; CTA uses the same image). */
  singleImage?: boolean;
  offerings: { title: string; body: string }[];
  systems?: System[];
  process: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  estimatorPreset: { sector: "residential" | "commercial"; scope: "replacement" | "repair" };
};

const commonProcess = [
  { title: "Free inspection", body: "We look at the roof surface, flashing, penetrations, ventilation and drainage, and talk through what we find." },
  { title: "Clear estimate", body: "You receive an estimate that lays out the recommended scope and materials, so you know exactly what you’re comparing." },
  { title: "Installation", body: "Your roof is installed to the standard learned in a family roofing business — the details done right, not just the visible surface." },
  { title: "Final walkthrough", body: "We review the completed work with you and answer any questions before the job is closed out." },
];

export const flatSystems: System[] = [
  { name: "EPDM", summary: "A synthetic rubber membrane, fully adhered or mechanically fastened, with a long track record on low-slope roofs.", bestFor: "Garages, additions, and commercial roofs where proven durability matters most." },
  { name: "TPO", summary: "A heat-welded thermoplastic membrane with a bright, reflective surface that helps reduce solar heat gain.", bestFor: "Larger commercial roofs and buildings that benefit from a reflective surface." },
  { name: "Self-adhering systems", summary: "Modified-bitumen sheets with a factory adhesive backing — installed without open flame.", bestFor: "Occupied buildings and detail areas where torch work is not ideal." },
  { name: "Torch-down", summary: "Modified-bitumen membrane heat-fused in overlapping layers for a dense, multi-ply roof.", bestFor: "Low-slope roofs that see foot traffic or need a heavy, multi-ply membrane." },
  { name: "Spray polyurethane foam", summary: "Foam sprayed in place to form a seamless, insulating layer that can be shaped to improve drainage.", bestFor: "Irregular roofs, many penetrations, or buildings that need added insulation." },
  { name: "Roof coatings", summary: "Fluid-applied coatings that restore and protect a sound existing roof surface.", bestFor: "Extending the life of a roof that is aged but still structurally sound." },
];

export const services: Service[] = [
  {
    slug: "residential-roofing",
    nav: "Residential",
    title: "Residential Roofing",
    eyebrow: "Homes",
    h1Label: "Residential Roofing in Toledo, OH",
    core: true,
    headline: "A roof built for the house you live in.",
    lede: "Complete roof installation and replacement for Toledo-area homes — from tear-off and decking to ridge cap and final cleanup.",
    metaTitle: "Residential Roof Replacement in Toledo, OH",
    metaDescription: "Residential roof replacement and new roof installation in Toledo, OH from a second-generation roofer. Free inspections and estimates — (440) 228-5933.",
    image: "/media/stills/hip-roof-wide.jpg",
    imageAlt: "Aerial view of a completed brown architectural shingle hip roof on a brick home",
    offerings: [
      { title: "Full roof replacement", body: "Removal of the existing roof down to the deck, deck inspection and replacement where needed, then a complete new roof system." },
      { title: "New roof installation", body: "Roofing for additions and new construction, coordinated with your builder's schedule." },
      { title: "Shingle roofing", body: "Architectural asphalt shingles installed with proper underlayment, ventilation and flashing details." },
      { title: "Low-slope sections", body: "Porches, additions and flat areas on homes handled with the right membrane rather than shingles." },
    ],
    process: commonProcess,
    faqs: [
      { q: "How do I know if I need a new roof or a repair?", a: "Widespread granule loss, curling or missing shingles, soft decking, or repeated leaks in different places usually point to replacement. A single damaged area often does not. A free inspection is the fastest way to know." },
      { q: "Is my home's square footage the same as my roof area?", a: "No. Roof area includes overhangs and is increased by the roof's pitch, so it is usually larger than the home's footprint. Our estimator accounts for this, and an inspection gives a measured figure." },
      { q: "Do you remove the old roof?", a: "For a replacement we normally tear off to the deck so we can inspect and repair the decking before installing the new system." },
    ],
    estimatorPreset: { sector: "residential", scope: "replacement" },
  },
  {
    slug: "commercial-roofing",
    nav: "Commercial",
    title: "Commercial Roofing",
    eyebrow: "Buildings",
    h1Label: "Commercial Roofing in Toledo, OH",
    core: true,
    headline: "Commercial roofs, planned around your operation.",
    lede: "Installation, replacement, restoration and maintenance of flat and low-slope commercial roof systems.",
    metaTitle: "Commercial Roofing Contractor, Toledo OH",
    metaDescription: "Commercial flat and low-slope roofing in Toledo, OH: EPDM, TPO, modified bitumen, spray foam and roof coatings. Free roof inspections — (440) 228-5933.",
    image: "/media/photos/commercial-roof.jpg",
    imageAlt: "Roofing crew in safety harnesses walking across a white membrane roof on a commercial building",
    imagePosition: "50% 40%",
    singleImage: true,
    offerings: [
      { title: "New commercial roofs", body: "Membrane and foam systems specified to the building's slope, drainage, insulation needs and budget." },
      { title: "Replacement & overlay", body: "Full tear-off where the existing roof is failing, or a recover over a sound substrate where it makes sense." },
      { title: "Restoration coatings", body: "Coating programs that extend the service life of an aging but sound roof surface." },
      { title: "Maintenance & repairs", body: "Seam, flashing and penetration repairs, plus scheduled inspections that catch problems early." },
    ],
    systems: flatSystems,
    process: [
      { title: "Roof assessment", body: "Condition review of membrane, seams, flashings, drainage and penetrations." },
      { title: "System recommendation", body: "Options compared side-by-side: replacement, recover, or restoration — with the tradeoffs explained." },
      { title: "Scheduled installation", body: "Work sequenced to keep your building operating and the site safe." },
      { title: "Closeout", body: "Final inspection of the completed work with you or your facilities team." },
    ],
    faqs: [
      { q: "Can my existing roof be coated instead of replaced?", a: "Coatings work when the existing roof and insulation are dry and structurally sound. Saturated insulation or widespread membrane failure usually means replacement. An inspection determines which applies." },
      { q: "Which membrane is right for my building?", a: "It depends on slope, foot traffic, rooftop equipment, reflectivity goals and budget. We explain EPDM, TPO, modified bitumen and spray foam options for your specific roof." },
    ],
    estimatorPreset: { sector: "commercial", scope: "replacement" },
  },
  {
    slug: "roof-repair",
    nav: "Repair",
    title: "Roof Repair",
    eyebrow: "Repairs",
    h1Label: "Roof Repair in Toledo, OH",
    core: true,
    headline: "Find the cause. Fix it properly.",
    lede: "Leak tracing and roof repairs for homes and commercial buildings — shingles, flashing, membranes, and penetrations.",
    metaTitle: "Roof Repair & Leak Repair in Toledo, OH",
    metaDescription: "Roof leak tracing and repair for shingle and flat roofs in Toledo, OH — shingles, flashing, membranes and penetrations. Free inspection: (440) 228-5933.",
    image: "/media/stills/farmhouse-ridge-vent.jpg",
    imageAlt: "Close aerial view of ridge cap shingles and a ridge vent on a gray shingle roof",
    offerings: [
      { title: "Leak investigation", body: "Water often enters far from where it shows inside. We trace it back to the source before repairing." },
      { title: "Shingle repairs", body: "Replacement of missing, cracked or wind-lifted shingles, matched as closely as available materials allow." },
      { title: "Flashing & penetrations", body: "Chimney, wall, vent and skylight flashing repaired or replaced — the most common leak points." },
      { title: "Flat roof repairs", body: "Seam, blister and puncture repairs on EPDM, TPO and modified-bitumen roofs." },
    ],
    process: commonProcess,
    faqs: [
      { q: "Can you give a repair price online?", a: "Repairs depend on what is found at the source of the problem, so they are priced after a free inspection rather than by formula." },
      { q: "When is repair no longer worth it?", a: "When damage is widespread or the roof is near the end of its life, repeated repairs can cost more than replacement. We will tell you plainly which side of that line your roof is on." },
    ],
    estimatorPreset: { sector: "residential", scope: "repair" },
  },
  {
    slug: "flat-roofing",
    nav: "Flat Roofing",
    title: "Flat Roofing Systems",
    eyebrow: "Low-slope",
    h1Label: "Flat Roofing Systems in Toledo, OH",
    core: true,
    headline: "Six systems. One right answer for your roof.",
    lede: "New installation, repair and maintenance of flat and low-slope roofs using EPDM, TPO, self-adhering, torch-down, spray foam and coating systems.",
    metaTitle: "Flat Roof Repair & Installation, Toledo OH",
    metaDescription: "Flat and low-slope roofs in Toledo, OH: EPDM, TPO, self-adhering and torch-down modified bitumen, spray foam and coatings. Repairs and new installs.",
    image: "/media/stills/replacement-decking.jpg",
    imageAlt: "Aerial view of new roof sheathing installed during a roof replacement",
    offerings: [
      { title: "New flat roof installation", body: "Complete low-slope systems including insulation, tapered drainage where needed, and edge metal." },
      { title: "Repairs & maintenance", body: "Seams, punctures, ponding areas, and flashing repairs, plus periodic inspections." },
      { title: "Restoration", body: "Coatings and foam that extend the service life of a sound existing roof." },
    ],
    systems: flatSystems,
    process: commonProcess,
    faqs: [
      { q: "Is ponding water a problem?", a: "Water that remains more than about two days after rain accelerates wear and can indicate drainage or structural issues. It should be evaluated." },
      { q: "Torch-down or self-adhering?", a: "Both are modified-bitumen systems. Self-adhering sheets avoid open flame near sensitive areas; torch-applied sheets are fused with heat. We recommend based on the building and conditions." },
    ],
    estimatorPreset: { sector: "commercial", scope: "replacement" },
  },
];

services.push({
  slug: "roof-inspection",
  nav: "Inspection",
  title: "Free Roof Inspection",
  eyebrow: "Inspections",
  h1Label: "Free Roof Inspection in Toledo, OH",
  core: false,
  primaryCta: { label: "Schedule your free inspection", href: "/contact" },
  headline: "Know exactly where your roof stands.",
  lede: "Free, no-obligation roof inspections for homes and commercial buildings — so repair or replacement decisions are based on what’s actually on your roof.",
  metaTitle: "Free Roof Inspection in Toledo, OH",
  metaDescription: "Free, no-obligation roof inspections for homes and commercial buildings in Toledo, OH. Find out what your roof needs — call (440) 228-5933.",
  image: "/media/stills/farmhouse-ridge-detail.jpg",
  imageAlt: "Close aerial view of ridge cap shingles on a recently completed roof",
  offerings: [
    { title: "Roof surface", body: "Shingles checked for granule loss, cracking, curling and wind damage; flat-roof membranes for splits, blisters and open seams." },
    { title: "Flashing & penetrations", body: "Chimneys, walls, vents, pipe boots and skylights — the places most leaks actually start." },
    { title: "Ventilation & drainage", body: "Ridge and soffit ventilation, gutters and downspouts, and ponding water on low-slope roofs." },
    { title: "Signs of hidden damage", body: "Soft or uneven decking, stains and other clues that water is getting past the surface." },
  ],
  process: [
    { title: "Request", body: "Call or send a request online. Tell us what you’ve noticed — a leak, missing shingles, or just an older roof." },
    { title: "Inspection", body: "We look at the roof surface, flashing, penetrations, ventilation and drainage." },
    { title: "Findings", body: "We walk you through what we found and whether the roof needs a repair, a replacement, or nothing at all." },
    { title: "Estimate", body: "If work is needed, you receive an estimate with the recommended scope and materials. No obligation." },
  ],
  faqs: [
    { q: "Is the roof inspection really free?", a: "Yes. NextGen Roofing & Construction offers free roof inspections and estimates, with no obligation to hire us." },
    { q: "When should I have my roof inspected?", a: "Good times are after severe weather, when you notice a leak, stains or missing shingles, before buying or selling a home, or when a roof is getting near the end of its expected life." },
    { q: "Do you inspect commercial roofs?", a: "Yes. We inspect both residential roofs and commercial flat and low-slope roofs, including EPDM, TPO, modified bitumen, spray foam and coated roofs." },
  ],
  estimatorPreset: { sector: "residential", scope: "replacement" },
});

export const getService = (slug: ServiceSlug) => services.find((s) => s.slug === slug)!;
