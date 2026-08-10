import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string; page: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id: rawId, page } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || !/^page-\d{4}\.jpg$/.test(page)) {
    return new Response("Not found", { status: 404 });
  }

  const supabase = await createClient();
  const { data: item } = await supabase
    .from("content_items")
    .select("document_format,report_page_count,report_pages_prefix")
    .eq("id", id)
    .maybeSingle();
  const pageNumber = Number(page.slice(5, 9));
  if (
    item?.document_format !== "paginated-report" ||
    !item.report_pages_prefix ||
    pageNumber < 1 ||
    pageNumber > item.report_page_count
  ) {
    return new Response("Not found", { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("report-pages")
    .download(`${item.report_pages_prefix}/${page}`);
  if (error || !data) return new Response("Not found", { status: 404 });
  return new Response(data, {
    headers: {
      "cache-control": "public, max-age=3600, s-maxage=31536000, immutable",
      "content-type": "image/jpeg",
      "x-robots-tag": "index, follow",
    },
  });
}
