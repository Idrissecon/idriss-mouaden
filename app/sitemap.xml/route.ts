import { listPublishedContent } from "@/lib/content";
import { absoluteUrl, contentPath } from "@/lib/seo";

export const dynamic = "force-dynamic";

const staticPages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/research", changeFrequency: "weekly", priority: 0.9 },
  { path: "/writing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
] as const;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function sitemapEntry({
  url,
  lastModified,
  changeFrequency,
  priority,
}: {
  url: string;
  lastModified?: string;
  changeFrequency: string;
  priority: number;
}) {
  return [
    "  <url>",
    `    <loc>${escapeXml(url)}</loc>`,
    lastModified ? `    <lastmod>${escapeXml(lastModified)}</lastmod>` : null,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

export async function GET() {
  let items: Awaited<ReturnType<typeof listPublishedContent>> = [];
  try {
    items = await listPublishedContent();
  } catch (error) {
    console.error("Could not add published content to the sitemap", error);
  }
  const entries = [
    ...staticPages.map((page) => sitemapEntry({
      url: absoluteUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...items.map((item) => sitemapEntry({
      url: absoluteUrl(contentPath(item)),
      lastModified: new Date(item.updatedAt).toISOString(),
      changeFrequency: "monthly",
      priority: item.featured ? 0.9 : 0.8,
    })),
  ];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
