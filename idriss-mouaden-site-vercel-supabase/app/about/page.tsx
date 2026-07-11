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
        <p>Background, academic interests, and selected activities.</p>
      </header>
      <section className="detail-content" aria-labelledby="about-review">
        <p className="detail-label">Biography</p>
        <div>
          <h2 id="about-review">Full biography under review</h2>
          <p>
            The final biography will be written from verified education,
            research, investment work, and public-speaking experience.
          </p>
        </div>
      </section>
    </main>
  );
}
