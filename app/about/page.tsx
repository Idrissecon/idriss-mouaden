import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "About",
  "About Idriss Mouaden, an economics student and independent researcher focused on banking, financial systems, and monetary institutions.",
  "/about",
);

export default function AboutPage() {
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#experience">← Home</Link>
        <p className="work-meta">About</p>
        <h1>About</h1>
        <p>{profile.role} based in {profile.location}.</p>
      </header>
      <section className="detail-content" aria-labelledby="about-profile">
        <p className="detail-label">Profile</p>
        <div>
          <h2 id="about-profile">Economics and financial institutions</h2>
          <p>{profile.introduction}</p>
          <p>
            His interests span economics, banking and finance, political
            economy, and mathematics. His approach is informed in part by the
            Austrian tradition in economics, particularly its attention to
            institutions, knowledge, and monetary order.
          </p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-research">
        <p className="detail-label">Current research</p>
        <div>
          <h2 id="about-research">{profile.currentResearch.title}</h2>
          <p>{profile.currentResearch.description}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-links">
        <p className="detail-label">Links</p>
        <div>
          <h2 id="about-links">Contact and identifiers</h2>
          <p>
            <a className="text-link" href={`mailto:${profile.contactEmail}`}>Email</a>
            {" · "}
            <a className="text-link" href={profile.orcid} target="_blank" rel="me noreferrer">ORCID ↗</a>
          </p>
        </div>
      </section>
    </main>
  );
}
