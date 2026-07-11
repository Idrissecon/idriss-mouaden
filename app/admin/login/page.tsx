import { redirect } from "next/navigation";
import { getOwner } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Editor sign in — Idriss Mouaden",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getOwner()) redirect("/admin");
  return (
    <main className="admin-shell auth-shell shell">
      <p className="work-meta">Private editor</p>
      <h1>Sign in.</h1>
      <p>Access is restricted to the owner of this website.</p>
      <LoginForm />
    </main>
  );
}
