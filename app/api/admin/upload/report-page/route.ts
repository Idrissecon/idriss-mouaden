import { requireOwnerResponse } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const MAX_PAGE_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireOwnerResponse();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  const documentKey = String(formData.get("documentKey") ?? "");
  const page = Number(formData.get("page"));
  if (!(file instanceof File) || file.type !== "image/jpeg" || file.size > MAX_PAGE_SIZE) {
    return Response.json({ error: "Página de informe no válida." }, { status: 400 });
  }
  if (!/^[a-f0-9-]+\.pdf$/i.test(documentKey) || !Number.isInteger(page) || page < 1 || page > 500) {
    return Response.json({ error: "Referencia de informe no válida." }, { status: 400 });
  }

  const prefix = documentKey.slice(0, -4);
  const key = `${prefix}/page-${String(page).padStart(4, "0")}.jpg`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("report-pages").upload(key, file, {
    cacheControl: "31536000",
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ prefix });
}
