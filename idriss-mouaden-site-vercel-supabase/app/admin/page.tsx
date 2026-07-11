import Link from "next/link";
import { redirect } from "next/navigation";
import { getOwner } from "@/lib/admin-auth";
import { AdminClient } from "./admin-client";

export const metadata = {
  title: "Content editor — Idriss Mouaden",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getOwner())) redirect("/admin/login");

  return (
    <main className="admin-shell shell">
      <header className="admin-heading">
        <div>
          <p className="work-meta">Private editor</p>
          <h1>Content</h1>
        </div>
        <div className="admin-intro">
          <p>Create research records and essays, save drafts, attach PDFs, and publish when ready.</p>
          <Link className="text-link" href="/">View site →</Link>
          <form action="/auth/signout" method="post">
            <button className="admin-signout" type="submit">Sign out</button>
          </form>
        </div>
      </header>
      <AdminClient />
    </main>
  );
}
