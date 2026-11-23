import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/business";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") return { rules: [{ userAgent: "*", disallow: "/" }] };
  // /hero-concepts is crawlable on purpose so search engines can read its `noindex` tag.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
