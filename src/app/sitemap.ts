import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/business";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

/** Date the indexable content last changed meaningfully (update when pages change). */
const UPDATED = new Date("2026-11-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (p: string) => `${SITE_URL}${p}`;
  const page = (path: string, priority: number, images: string[] = [], changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: abs(path),
    lastModified: UPDATED,
    changeFrequency,
    priority,
    ...(images.length ? { images: images.map(abs) } : {}),
  });
  return [
    page("", 1, ["/media/stills/hero-arrival-v2-poster.jpg", "/media/photos/family-ryan-and-frank.jpg"], "weekly"),
    ...services.map((s) => page(`/${s.slug}`, 0.9, [s.image])),
    page("/estimate", 0.8),
    page("/projects", 0.8, projects.map((p) => p.cover.src), "weekly"),
    ...projects.map((p) => page(`/projects/${p.slug}`, 0.6, [...new Set([p.cover.src, ...p.gallery.map((g) => g.src)])])),
    page("/about", 0.7, ["/media/photos/family-ryan-and-frank.jpg"]),
    page("/contact", 0.8),
    page("/privacy", 0.2, [], "yearly"),
    page("/terms", 0.2, [], "yearly"),
  ];
}
