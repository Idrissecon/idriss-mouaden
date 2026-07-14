import { safePdfFilename } from "@/lib/serve-publication-document";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ key: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const key = (await context.params).key;
  if (!/^[a-f0-9-]+\.pdf$/i.test(key)) return new Response("Not found", { status: 404 });

  const supabase = await createClient();
  const { data: record } = await supabase
    .from("content_items")
    .select("document_name")
    .eq("document_key", key)
    .maybeSingle();
  if (!record) return new Response("Not found", { status: 404 });

  const { data, error } = await supabase.storage.from("documents").download(key);
  if (error || !data) return new Response("Not found", { status: 404 });
  const filename = safePdfFilename(record.document_name ?? "document.pdf", "document.pdf");
  return new Response(data, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="${filename}"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
