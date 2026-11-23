/**
 * Projects are built only from authentic NextGen drone footage supplied by the
 * client. Location and material fields stay `null` until the client confirms
 * them — the UI shows "Pending confirmation" instead of guessing.
 */
export type Project = {
  slug: string;
  title: string;
  /** Optional search title when `title` alone lacks context. */
  seoTitle?: string;
  category: "Residential" | "Commercial" | "Flat Roofing" | "Repair";
  summary: string;
  description: string[];
  location: string | null;
  materials: string | null;
  video?: { base: string; poster: string; duration: string };
  cover: { src: string; alt: string };
  gallery: { src: string; alt: string; caption?: string }[];
  stages?: { label: string; src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    slug: "full-roof-replacement",
    title: "Full Roof Replacement, Tear-Off to Finish",
    category: "Residential",
    summary: "The whole job from the air: removal of the old roof, new decking, installation, and the finished result.",
    description: [
      "This drone film follows a complete residential replacement. The existing roof was removed to the deck, damaged sheathing was replaced with new panels, and the new shingle system was installed.",
      "The final passes show the completed roof from directly overhead, with the site staged for cleanup.",
    ],
    location: null,
    materials: null,
    video: { base: "/media/video/project-full-replacement", poster: "/media/stills/replacement-complete.jpg", duration: "0:20" },
    cover: { src: "/media/stills/replacement-complete.jpg", alt: "Completed brown shingle roof seen from directly above, with the job site around it" },
    stages: [
      { label: "Tear-off", src: "/media/stills/replacement-tearoff-crew.jpg", alt: "Crew removing the old roof down to the wood plank deck" },
      { label: "New decking", src: "/media/stills/replacement-decking.jpg", alt: "New roof sheathing panels installed across every roof plane" },
      { label: "Details", src: "/media/stills/replacement-ridge-detail.jpg", alt: "Close view of finished hip and ridge caps meeting at the chimney flashing" },
      { label: "Complete", src: "/media/stills/replacement-complete.jpg", alt: "The finished roof from overhead" },
    ],
    gallery: [
      { src: "/media/stills/replacement-tearoff-crew.jpg", alt: "Crew removing the old roof down to the wood plank deck", caption: "Tear-off to the deck" },
      { src: "/media/stills/replacement-decking.jpg", alt: "New roof sheathing panels installed across every roof plane", caption: "New sheathing" },
      { src: "/media/stills/replacement-ridge-detail.jpg", alt: "Close view of finished hip and ridge caps meeting at the chimney flashing", caption: "Hip, ridge and chimney flashing" },
      { src: "/media/stills/replacement-complete.jpg", alt: "The finished roof from overhead", caption: "Completed roof" },
    ],
  },
  {
    slug: "hip-roof-shingle-installation",
    title: "Hip Roof Shingle Installation",
    category: "Residential",
    summary: "A multi-plane hip roof finished in a warm brown blend, with ridge lines, vents and chimney flashing detailed cleanly.",
    description: [
      "Hip roofs bring more ridges, hips and valleys than a simple gable — every one of them is a place where alignment and detailing show.",
      "This orbit shows the finished roof in full sun: straight shingle courses across each plane, evenly spaced roof vents, and clean transitions at the hips and around the chimney.",
    ],
    location: null,
    materials: null,
    video: { base: "/media/video/project-hip-roof", poster: "/media/stills/hip-roof-context.jpg", duration: "0:22" },
    cover: { src: "/media/stills/hip-roof-vents.jpg", alt: "Aerial view of a brown shingle hip roof with a row of roof vents and a brick chimney" },
    gallery: [
      { src: "/media/stills/hip-roof-vents.jpg", alt: "Aerial view of a brown shingle hip roof with a row of roof vents and a brick chimney", caption: "Vents and chimney" },
      { src: "/media/stills/hip-roof-ridge-lines.jpg", alt: "Hip and ridge lines converging on a brown shingle roof", caption: "Hip and ridge lines" },
      { src: "/media/stills/hip-roof-context.jpg", alt: "The finished hip roof with the neighborhood around it", caption: "Finished roof in context" },
      { src: "/media/stills/hip-roof-wide.jpg", alt: "Wide aerial view of the completed hip roof", caption: "Full roof" },
    ],
  },
  {
    slug: "farmhouse-re-roof",
    title: "Two-Story Farmhouse Re-Roof",
    category: "Residential",
    summary: "A classic two-story farmhouse with a porch roof and additions, finished in a cool gray blend.",
    description: [
      "Older homes often combine several roof sections at different heights — the main house, a porch, and later additions. Each tie-in has to be flashed and finished so the roof reads as one system.",
      "The film rises from the street to the ridge, showing the ridge cap and ridge vent up close before pulling back to the full roof from above.",
    ],
    location: null,
    materials: null,
    video: { base: "/media/video/project-farmhouse", poster: "/media/stills/farmhouse-orbit.jpg", duration: "0:23" },
    cover: { src: "/media/stills/farmhouse-orbit.jpg", alt: "Aerial view of a white two-story farmhouse with a new gray shingle roof" },
    gallery: [
      { src: "/media/stills/farmhouse-orbit.jpg", alt: "Aerial view of a white two-story farmhouse with a new gray shingle roof", caption: "Finished roof" },
      { src: "/media/stills/farmhouse-ridge-detail.jpg", alt: "Close view of ridge cap shingles", caption: "Ridge cap detail" },
      { src: "/media/stills/farmhouse-ridge-vent.jpg", alt: "Ridge vent running along the peak of the roof", caption: "Ridge ventilation" },
      { src: "/media/stills/farmhouse-top-down.jpg", alt: "Top-down view of the gray shingle roof and porch roof", caption: "From above" },
      { src: "/media/stills/farmhouse-street.jpg", alt: "The farmhouse seen from the street with a NextGen yard sign", caption: "From the street" },
    ],
  },
];

/* Photo projects from client-supplied job photos (Drive, Nov 22, 2026). Grouped only where
   the photos clearly show the same property (matching chimney, neighbors, vehicles). */
projects.push(
  {
    slug: "gable-roof-replacement-step-by-step",
    title: "Gable Roof Replacement, Step by Step",
    category: "Residential",
    summary: "Three photos from one job: the old roof stripped to the original plank boards, new sheathing going down, and the finished ridge.",
    description: [
      "Older homes are often roofed over wide plank boards with gaps between them. On this replacement the old roofing was removed down to those planks, then the roof was sheathed with new panels to create a solid nailing surface.",
      "The final photo shows the finished gray shingle roof along the ridge, with the chimney flashed in.",
    ],
    location: null,
    materials: null,
    cover: { src: "/media/photos/gable-finished-ridge.jpg", alt: "Finished gray shingle roof seen along the ridge toward the chimney" },
    stages: [
      { label: "Tear-off", src: "/media/photos/gable-tearoff-deck.jpg", alt: "Old roof removed down to the original spaced plank boards around a brick chimney" },
      { label: "New decking", src: "/media/photos/gable-new-decking.jpg", alt: "New roof sheathing installed along the ridge with a framing nailer resting on it" },
      { label: "Finished", src: "/media/photos/gable-finished-ridge.jpg", alt: "Finished gray shingle roof seen along the ridge toward the chimney" },
    ],
    gallery: [
      { src: "/media/photos/gable-tearoff-deck.jpg", alt: "Old roof removed down to the original spaced plank boards around a brick chimney", caption: "Stripped to the original planks" },
      { src: "/media/photos/gable-new-decking.jpg", alt: "New roof sheathing installed along the ridge with a framing nailer resting on it", caption: "New sheathing" },
      { src: "/media/photos/gable-finished-ridge.jpg", alt: "Finished gray shingle roof seen along the ridge toward the chimney", caption: "Finished roof" },
    ],
  },
  {
    slug: "gray-hip-roof",
    seoTitle: "Gray Hip Roof Shingle Project",
    title: "Gray Hip Roof",
    category: "Residential",
    summary: "A hip roof finished in gray shingles, photographed from directly above and at an angle.",
    description: ["A multi-plane hip roof with a chimney and adjoining low-slope sections, shown from directly overhead and from an angle."],
    location: null,
    materials: null,
    cover: { src: "/media/photos/gray-hip-angle.jpg", alt: "Aerial view of a gray shingle hip roof with a chimney" },
    gallery: [
      { src: "/media/photos/gray-hip-angle.jpg", alt: "Aerial view of a gray shingle hip roof with a chimney", caption: "Angled view" },
      { src: "/media/photos/gray-hip-top-down.jpg", alt: "Top-down view of the gray hip roof and its low-slope sections", caption: "From above" },
    ],
  },
  {
    slug: "brown-shingle-ranch",
    seoTitle: "Brown Shingle Ranch Roof Project",
    title: "Brown Shingle Ranch Roof",
    category: "Residential",
    summary: "A sprawling ranch roof with several hips and wings, finished in a warm brown shingle.",
    description: ["Ranch homes with additions combine several roof sections. Each hip and valley here meets cleanly, with vents in a straight line along the main roof."],
    location: null,
    materials: null,
    cover: { src: "/media/photos/brown-ranch-overview.jpg", alt: "Aerial view of a brown shingle ranch roof with several hips" },
    gallery: [
      { src: "/media/photos/brown-ranch-overview.jpg", alt: "Aerial view of a brown shingle ranch roof with several hips", caption: "Overview" },
      { src: "/media/photos/brown-ranch-rear.jpg", alt: "Rear view of the brown shingle roof showing the chimney and connecting wing", caption: "Rear wing" },
    ],
  },
  {
    slug: "charcoal-shingle-roof",
    seoTitle: "Charcoal Shingle Roof Project",
    title: "Charcoal Shingle Roof",
    category: "Residential",
    summary: "A complex roof with multiple gables and valleys, finished in a dark charcoal shingle.",
    description: ["Multiple gables, valleys and roof vents across a large two-level home, photographed from three angles after completion."],
    location: null,
    materials: null,
    cover: { src: "/media/photos/pergola-home-side.jpg", alt: "Aerial view of a charcoal shingle roof with several gables beside a pergola" },
    gallery: [
      { src: "/media/photos/pergola-home-side.jpg", alt: "Aerial view of a charcoal shingle roof with several gables beside a pergola", caption: "Side view" },
      { src: "/media/photos/pergola-home-front.jpg", alt: "Front aerial view of the charcoal roof showing its gables and roof vents", caption: "Front" },
      { src: "/media/photos/pergola-home-top-down.jpg", alt: "Top-down view of the charcoal shingle roof", caption: "From above" },
    ],
  },
);

/** Single photos from other jobs (not grouped because they can't be matched to one property). */
export const fieldPhotos = [
  { src: "/media/photos/tearoff-underway.jpg", alt: "Crew tearing off an old roof, with a dumpster in the driveway", caption: "Tear-off underway" },
  { src: "/media/photos/brick-two-story.jpg", alt: "Two-story brick home with a newly finished dark shingle roof", caption: "Two-story brick home" },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
