import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CV — Idriss Mouaden",
  description: "Academic CV of Idriss Mouaden.",
};

export default function CvPage() {
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#cv">← Home</Link>
        <p className="work-meta">Curriculum vitae</p>
        <h1>CV</h1>
      </header>
    </main>
  );
}
