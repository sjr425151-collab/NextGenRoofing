import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/business";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "true") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/hero-concepts"] }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
