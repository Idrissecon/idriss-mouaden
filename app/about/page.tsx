import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Idriss Mouaden",
  description: "About Idriss Mouaden.",
};

export default function AboutPage() {
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#experience">← Home</Link>
        <p className="work-meta">About</p>
        <h1>About</h1>
      </header>
    </main>
  );
}
