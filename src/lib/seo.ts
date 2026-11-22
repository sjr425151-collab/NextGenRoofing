import type { Metadata } from "next";
import { SITE_URL, business } from "@/content/business";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const url = `${SITE_URL}${path}`;
  const og = `${SITE_URL}${image ?? "/og.jpg"}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | ${business.shortName}`, description, url, type: "website", siteName: business.legalName, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: `${title} | ${business.shortName}`, description, images: [og] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${SITE_URL}/#business`,
    name: business.legalName,
    alternateName: business.shortName,
    slogan: business.tagline,
    url: SITE_URL,
    telephone: business.phone.e164,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      ...(business.address.street ? { streetAddress: business.address.street } : {}),
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      ...(business.address.postalCode ? { postalCode: business.address.postalCode } : {}),
      addressCountry: business.address.country,
    },
    sameAs: [business.links.facebook],
    knowsAbout: ["Residential roofing", "Commercial roofing", "Flat roofing", "EPDM", "TPO", "Modified bitumen", "Spray polyurethane foam roofing", "Roof coatings", "Roof repair"],
  };
}
