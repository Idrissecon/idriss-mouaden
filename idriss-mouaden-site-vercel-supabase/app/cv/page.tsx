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
        <p>Education, distinctions, experience, and activities.</p>
      </header>
      <section className="detail-content" aria-labelledby="cv-review">
        <p className="detail-label">Record</p>
        <div>
          <h2 id="cv-review">Factual review in progress</h2>
          <p>
            Entries will be added only after their wording, dates, roles, and
            distinctions have been checked.
          </p>
        </div>
      </section>
    </main>
  );
}
