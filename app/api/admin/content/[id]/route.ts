import { requireOwnerResponse } from "@/lib/admin-auth";
import { contentApiError as apiError, contentInputToRow, parseContentInput } from "@/lib/content-input";
import { toContentItem, type ContentRow } from "@/lib/content-types";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const denied = await requireOwnerResponse();
  if (denied) return denied;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return Response.json({ error: "ID inválido." }, { status: 400 });

  try {
    const supabase = await createClient();
    const { data: previous } = await supabase
      .from("content_items")
      .select("document_key,report_pages_prefix")
      .eq("id", id)
      .maybeSingle();
    const input = {
      ...contentInputToRow(parseContentInput(await request.json())),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("content_items")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();
    if (error) return apiError(error.message);
    const item = toContentItem(data as ContentRow);
    if (previous?.document_key && previous.document_key !== item.documentKey) {
      await supabase.storage.from("documents").remove([previous.document_key]);
    }
    if (
      previous?.report_pages_prefix &&
      previous.report_pages_prefix !== item.reportPagesPrefix
    ) {
      await removeReportPages(supabase, previous.report_pages_prefix);
    }
    return Response.json({ item });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "No se pudo modificar el contenido.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireOwnerResponse();
  if (denied) return denied;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return Response.json({ error: "ID inválido." }, { status: 400 });

  const supabase = await createClient();
  const { data: item } = await supabase
    .from("content_items")
    .select("document_key,report_pages_prefix")
    .eq("id", id)
    .maybeSingle();
  const { error, count } = await supabase
    .from("content_items")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return apiError(error.message);
  if (!count) return Response.json({ error: "Entrada no encontrada." }, { status: 404 });
  if (item?.document_key) await supabase.storage.from("documents").remove([item.document_key]);
  if (item?.report_pages_prefix) await removeReportPages(supabase, item.report_pages_prefix);
  return Response.json({ ok: true });
}

async function removeReportPages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  prefix: string,
) {
  const { data } = await supabase.storage.from("report-pages").list(prefix, { limit: 500 });
  if (data?.length) {
    await supabase.storage.from("report-pages").remove(data.map((file) => `${prefix}/${file.name}`));
  }
}
