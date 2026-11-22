/**
 * Projects are built only from authentic NextGen drone footage supplied by the
 * client. Location and material fields stay `null` until the client confirms
 * them — the UI shows "Pending confirmation" instead of guessing.
 */
export type Project = {
  slug: string;
  title: string;
  category: "Residential" | "Commercial" | "Flat Roofing" | "Repair";
  summary: string;
  description: string[];
  location: string | null;
  materials: string | null;
  video: { base: string; poster: string; duration: string };
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

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
