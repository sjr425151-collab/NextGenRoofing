import type { Metadata } from "next";
import { SITE_URL, business } from "@/content/business";
import { services } from "@/content/services";

/** Brand suffix kept short so titles stay within ~60 characters in search results. */
export const TITLE_SUFFIX = "NextGen Roofing";

const DEFAULT_OG = { url: "/og.jpg", width: 1200, height: 630 };

/**
 * Per-page metadata. `title` is the page-specific part; the layout template appends
 * " | NextGen Roofing". Open Graph dimensions are only declared for the default share
 * image (whose real size is known); page photos are passed without dimensions.
 */
export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const url = `${SITE_URL}${path}`;
  const ogImage = image ? { url: `${SITE_URL}${image}` } : { ...DEFAULT_OG, url: `${SITE_URL}${DEFAULT_OG.url}` };
  const full = `${title} | ${TITLE_SUFFIX}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: full, description, url, type: "website", siteName: business.shortName, locale: "en_US", images: [ogImage] },
    twitter: { card: "summary_large_image", title: full, description, images: [ogImage.url] },
  };
}

const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Toledo is the only verified named location; "Ohio" comes from the company's own public statement ("Serving Ohio homes & businesses"). */
export const AREA_SERVED = [
  { "@type": "City", name: "Toledo", containedInPlace: { "@type": "State", name: "Ohio" } },
  { "@type": "State", name: "Ohio" },
];

/** Site-wide graph: the business (RoofingContractor) and the WebSite it publishes. */
export function siteJsonLd() {
  const address = {
    "@type": "PostalAddress",
    ...(business.address.street ? { streetAddress: business.address.street } : {}),
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    ...(business.address.postalCode ? { postalCode: business.address.postalCode } : {}),
    addressCountry: business.address.country,
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RoofingContractor",
        "@id": BUSINESS_ID,
        name: business.legalName,
        alternateName: business.shortName,
        slogan: business.tagline,
        description:
          "Second-generation residential and commercial roofing contractor in Toledo, Ohio: roof replacement, roof repair, roof inspections and flat roofing systems (EPDM, TPO, modified bitumen, spray foam, coatings).",
        url: SITE_URL,
        telephone: business.phone.e164,
        logo: `${SITE_URL}/brand/logo-stacked-on-light.png`,
        image: [
          `${SITE_URL}/og.jpg`,
          `${SITE_URL}/media/photos/family-ryan-and-frank.jpg`,
          `${SITE_URL}/media/photos/gable-finished-ridge.jpg`,
          `${SITE_URL}/media/stills/replacement-complete.jpg`,
        ],
        address,
        areaServed: AREA_SERVED,
        founder: { "@type": "Person", name: business.founder.name },
        contactPoint: { "@type": "ContactPoint", telephone: business.phone.e164, contactType: "customer service", areaServed: "US-OH", availableLanguage: "English" },
        ...(business.hours === "Open 24 hours"
          ? { openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "00:00", closes: "23:59" }] }
          : {}),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Roofing services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", "@id": `${SITE_URL}/${s.slug}#service`, name: s.title, url: `${SITE_URL}/${s.slug}` },
          })),
        },
        sameAs: [business.links.facebook],
        knowsAbout: ["Roof replacement", "Roof repair", "Roof inspection", "Residential roofing", "Commercial roofing", "Flat roofing", "EPDM", "TPO", "Modified bitumen", "Spray polyurethane foam roofing", "Roof coatings"],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: business.shortName,
        inLanguage: "en-US",
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

/** BreadcrumbList for any page below the homepage. `trail` excludes Home. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

export const businessRef = { "@id": BUSINESS_ID };
