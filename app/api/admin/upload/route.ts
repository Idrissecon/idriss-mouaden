import { requireOwnerResponse } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const denied = await requireOwnerResponse();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Selecciona un PDF." }, { status: 400 });
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return Response.json({ error: "Solo se admiten archivos PDF." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "El PDF no puede superar los 20 MB." }, { status: 400 });
  }

  const key = `${crypto.randomUUID()}.pdf`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from("documents").upload(key, file, {
    contentType: "application/pdf",
    upsert: false,
  });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ key, name: file.name, url: `/api/files/${key}` }, { status: 201 });
}
