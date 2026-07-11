import { createClient } from "@/lib/supabase/server";

export const OWNER_EMAIL = "mouadenidriss574@gmail.com";

export async function getOwner() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || data.user?.email?.toLowerCase() !== OWNER_EMAIL) return null;
  return data.user;
}

export async function isOwner() {
  return Boolean(await getOwner());
}

export async function requireOwnerResponse() {
  if (await isOwner()) return null;
  return Response.json({ error: "Not authorized" }, { status: 403 });
}
