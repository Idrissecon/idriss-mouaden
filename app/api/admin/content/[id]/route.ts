import { requireOwnerResponse } from "@/lib/admin-auth";
import { contentInputToRow, parseContentInput } from "@/lib/content-input";
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
      .select("document_key")
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
    .select("document_key")
    .eq("id", id)
    .maybeSingle();
  const { error, count } = await supabase
    .from("content_items")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return apiError(error.message);
  if (!count) return Response.json({ error: "Entrada no encontrada." }, { status: 404 });
  if (item?.document_key) await supabase.storage.from("documents").remove([item.document_key]);
  return Response.json({ ok: true });
}

function apiError(message: string) {
  const conflict = message.includes("duplicate key") || message.includes("content_items_slug_key");
  const validation = message.includes("obligatorio") || message.includes("enlace externo");
  return Response.json(
    { error: conflict ? "Ya existe una entrada con esa URL. Cambia el slug." : message },
    { status: conflict ? 409 : validation ? 400 : 500 },
  );
}
