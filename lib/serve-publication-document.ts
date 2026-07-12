import { getPublishedContentBySlug } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

export async function servePublicationDocument(
  request: Request,
  category: "research" | "writing",
  slug: string,
) {
  const item = await getPublishedContentBySlug(category, slug);
  if (!item?.documentKey) return new Response("Not found", { status: 404 });

  if (item.documentKey.startsWith("static/")) {
    const filename = item.documentKey.slice("static/".length);
    const source = await fetch(
      new URL(`/documents/${encodeURIComponent(filename)}`, request.url),
      { cache: "force-cache" },
    );
    if (!source.ok || !source.body) return new Response("Not found", { status: 404 });
    return new Response(source.body, {
      headers: documentHeaders(item.documentName ?? filename),
    });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("documents").download(item.documentKey);
  if (error || !data) return new Response("Not found", { status: 404 });
  return new Response(data, {
    headers: documentHeaders(item.documentName ?? "paper.pdf"),
  });
}

function documentHeaders(filename: string) {
  return {
    "cache-control": "public, max-age=3600, s-maxage=86400",
    "content-disposition": `inline; filename="${safeFilename(filename)}"`,
    "content-type": "application/pdf",
    "x-robots-tag": "index, follow",
  };
}

function safeFilename(value: string) {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 180) || "paper.pdf";
}
