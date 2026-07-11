import { createClient } from "@/lib/supabase/server";

export function getOwnerEmail() {
  return process.env.SITE_OWNER_EMAIL?.trim().toLowerCase() || null;
}

export async function getOwner() {
  const ownerEmail = getOwnerEmail();
  if (!ownerEmail) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || data.user?.email?.toLowerCase() !== ownerEmail) return null;
  return data.user;
}

export async function isOwner() {
  return Boolean(await getOwner());
}

export async function requireOwnerResponse() {
  if (await isOwner()) return null;
  return Response.json({ error: "Not authorized" }, { status: 403 });
}
