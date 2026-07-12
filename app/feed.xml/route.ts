import { listPublishedContent } from "@/lib/content";
import { absoluteUrl, contentPath, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const items = await listPublishedContent();
  const entries = items.map((item) => {
    const url = absoluteUrl(contentPath(item));
    const date = new Date(item.publicationDate ?? item.updatedAt).toUTCString();
    return `
      <item>
        <title>${escapeXml(item.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${date}</pubDate>
        <category>${item.category === "research" ? "Research" : "Writing"}</category>
        <description>${escapeXml(item.summary)}</description>
      </item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(siteConfig.name)} — Research and writing</title>
        <link>${siteConfig.url}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${entries}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
