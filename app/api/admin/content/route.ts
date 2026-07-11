import { requireOwnerResponse } from "@/lib/admin-auth";
import { contentInputToRow, parseContentInput } from "@/lib/content-input";
import { toContentItem, type ContentRow } from "@/lib/content-types";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const denied = await requireOwnerResponse();
  if (denied) return denied;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false });
  if (error) return apiError(error.message);
  return Response.json({ items: ((data ?? []) as ContentRow[]).map(toContentItem) });
}

export async function POST(request: Request) {
  const denied = await requireOwnerResponse();
  if (denied) return denied;

  try {
    const input = contentInputToRow(parseContentInput(await request.json()));
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("content_items")
      .insert(input)
      .select("*")
      .single();
    if (error) return apiError(error.message);
    return Response.json({ item: toContentItem(data as ContentRow) }, { status: 201 });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : "No se pudo guardar el contenido.");
  }
}

function apiError(message: string) {
  const conflict = message.includes("duplicate key") || message.includes("content_items_slug_key");
  const validation = message.includes("obligatorio") || message.includes("enlace externo");
  return Response.json(
    { error: conflict ? "Ya existe una entrada con esa URL. Cambia el slug." : message },
    { status: conflict ? 409 : validation ? 400 : 500 },
  );
}
