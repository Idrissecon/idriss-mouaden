import { NextResponse } from "next/server";
import { OWNER_EMAIL } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = url.origin;
  if (!code) return NextResponse.redirect(`${origin}/admin/login?error=missing_code`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${origin}/admin/login?error=invalid_link`);

  const { data } = await supabase.auth.getUser();
  if (data.user?.email?.toLowerCase() !== OWNER_EMAIL) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=not_authorized`);
  }
  return NextResponse.redirect(`${origin}/admin`);
}
