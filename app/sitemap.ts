import type { MetadataRoute } from "next";
import { research } from "@/data/research";
import { projects } from "@/data/projects";

const SITE_URL = "https://hardikahlawat.me";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  ];

  const researchRoutes: MetadataRoute.Sitemap = research.map((r) => ({
    url: `${SITE_URL}/research/${r.slug}/`,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}/`,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...researchRoutes, ...projectRoutes];
}
