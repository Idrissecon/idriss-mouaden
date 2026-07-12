import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { cvDocumentHref, profile } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

const english = messages("en").cv;
export const metadata: Metadata = pageMetadata(
  "CV",
  english.description,
  "/cv",
);

export default async function CvPage() {
  if (cvDocumentHref) redirect(cvDocumentHref);
  const m = messages(await getLocale());

  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#cv">← {m.common.home}</Link>
        <p className="work-meta">Curriculum vitae</p>
        <h1>CV</h1>
        <p>{m.cv.intro}</p>
      </header>
      <section className="detail-content" aria-labelledby="cv-education">
        <p className="detail-label">{m.cv.education}</p>
        <div>
          <h2 id="cv-education">{m.cv.highSchool}</h2>
          <p>{m.cv.expected}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-research">
        <p className="detail-label">{m.cv.research}</p>
        <div>
          <h2 id="cv-research">{m.profile.currentResearchTitle}</h2>
          <p>{m.profile.currentResearchDescription}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-recognition">
        <p className="detail-label">{m.cv.recognition}</p>
        <div>
          <h2 id="cv-recognition">{m.profile.recognitionTitle}</h2>
          <p>
            {profile.recognition.organisation} · {m.cv.economics} · “{profile.recognition.work}”
          </p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-experience">
        <p className="detail-label">{m.cv.experience}</p>
        <div>
          <h2 id="cv-experience">{m.profile.experienceRole}</h2>
          <p>{profile.experience.organisation} · {profile.experience.startYear}–{m.home.present}</p>
          <p>{m.profile.experienceDescription}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-activities">
        <p className="detail-label">{m.cv.activities}</p>
        <div>
          <h2 id="cv-activities">{m.cv.debate}</h2>
          <p>{m.profile.activities.join(" · ")}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="cv-identifiers">
        <p className="detail-label">{m.cv.identifier}</p>
        <div>
          <h2 id="cv-identifiers">ORCID</h2>
          <p><a className="text-link" href={profile.orcid} target="_blank" rel="me noreferrer">0009-0007-7001-022X ↗</a></p>
        </div>
      </section>
    </main>
  );
}
