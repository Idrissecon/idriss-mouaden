import { getOwnerEmail } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const origin = new URL(request.url).origin;
    const ownerEmail = getOwnerEmail();
    if (!ownerEmail) throw new Error("SITE_OWNER_EMAIL is not configured.");
    const { error } = await supabase.auth.signInWithOtp({
      email: ownerEmail,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Could not send admin login link", error);
    return Response.json(
      { error: "The secure link could not be sent. Try again shortly." },
      { status: 500 },
    );
  }
}
