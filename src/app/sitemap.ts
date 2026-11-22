import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/business";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-22");
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("", 1, "weekly"),
    ...services.map((s) => page(`/${s.slug}`, 0.9)),
    page("/estimate", 0.8),
    page("/projects", 0.8, "weekly"),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.6)),
    page("/about", 0.7),
    page("/contact", 0.8),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
