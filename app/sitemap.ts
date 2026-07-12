import type { MetadataRoute } from "next";
import { listPublishedContent } from "@/lib/content";
import { absoluteUrl, contentPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await listPublishedContent();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/research"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/writing"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/cv"), changeFrequency: "monthly", priority: 0.7 },
  ];
  const publications: MetadataRoute.Sitemap = items.map((item) => ({
    url: absoluteUrl(contentPath(item)),
    lastModified: item.updatedAt,
    changeFrequency: "monthly",
    priority: item.featured ? 0.9 : 0.8,
  }));

  return [...staticPages, ...publications];
}
