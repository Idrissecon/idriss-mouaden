"use client";

import { useState } from "react";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function sendLink() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    const result = await response.json() as { error?: string };
    setMessage(
      response.ok
        ? "Check your inbox. The secure link will return you to the editor."
        : result.error || "The link could not be sent.",
    );
    setLoading(false);
  }

  return (
    <div className="auth-card">
      <p>A one-time secure sign-in link will be sent to the owner account.</p>
      <button className="admin-button primary" disabled={loading} onClick={sendLink} type="button">
        {loading ? "Sending…" : "Email me a sign-in link"}
      </button>
      {message && <p className="admin-notice">{message}</p>}
    </div>
  );
}
