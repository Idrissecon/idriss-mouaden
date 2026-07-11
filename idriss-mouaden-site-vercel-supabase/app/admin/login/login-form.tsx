"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const OWNER_EMAIL = "mouadenidriss574@gmail.com";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendLink() {
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: OWNER_EMAIL,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });
    setMessage(error ? error.message : "Check your email. The secure link will return you to the editor.");
    setLoading(false);
  }

  return (
    <div className="auth-card">
      <p>A one-time secure link will be sent to <strong>{OWNER_EMAIL}</strong>.</p>
      <button className="admin-button primary" disabled={loading} onClick={sendLink} type="button">
        {loading ? "Sending…" : "Email me a sign-in link"}
      </button>
      {message && <p className="admin-notice">{message}</p>}
    </div>
  );
}
