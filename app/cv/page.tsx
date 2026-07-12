import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cvDocumentHref, profile } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "CV",
  "Academic CV of Idriss Mouaden: education, independent research, investment analysis, recognition, debate, and public speaking.",
  "/cv",
);

export default function CvPage() {
  if (cvDocumentHref) redirect(cvDocumentHref);

  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#cv">← Home</Link>
        <p className="work-meta">Curriculum vitae</p>
        <h1>CV</h1>
        <p>Education, research, recognition, experience, and activities.</p>
      </header>
      <section className="detail-content" aria-labelledby="cv-education">
        <p className="detail-label">Education</p>
        <div>
          <h2 id="cv-education">{profile.education.programme}</h2>
          <p>High school, Spain · Expected graduation {profile.education.expected}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-research">
        <p className="detail-label">Research</p>
        <div>
          <h2 id="cv-research">{profile.currentResearch.title}</h2>
          <p>{profile.currentResearch.description}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-recognition">
        <p className="detail-label">Recognition</p>
        <div>
          <h2 id="cv-recognition">{profile.recognition.title}</h2>
          <p>
            {profile.recognition.organisation} · Economics · “{profile.recognition.work}”
          </p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-experience">
        <p className="detail-label">Experience</p>
        <div>
          <h2 id="cv-experience">{profile.experience.role}</h2>
          <p>{profile.experience.organisation} · {profile.experience.startYear}–present</p>
          <p>{profile.experience.description}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-activities">
        <p className="detail-label">Activities</p>
        <div>
          <h2 id="cv-activities">Debate and public speaking</h2>
          <p>{profile.activities.join(" · ")}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-identifiers">
        <p className="detail-label">Identifier</p>
        <div>
          <h2 id="cv-identifiers">ORCID</h2>
          <p><a className="text-link" href={profile.orcid} target="_blank" rel="me noreferrer">0009-0007-7001-022X ↗</a></p>
        </div>
      </section>
    </main>
  );
}
