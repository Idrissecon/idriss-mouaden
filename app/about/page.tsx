import type { Metadata } from "next";
import Link from "next/link";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { profile } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const a = messages(await getLocale()).about;
  return pageMetadata(a.title, a.description, "/about");
}

export default async function AboutPage() {
  const m = messages(await getLocale());
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#about">← {m.common.home}</Link>
        <p className="work-meta">{m.about.title}</p>
        <h1>{m.about.title}</h1>
        <p>{m.profile.role} · {m.profile.location}</p>
      </header>
      <section className="detail-content" aria-labelledby="about-profile">
        <p className="detail-label">{m.about.profile}</p>
        <div>
          <h2 id="about-profile">{m.about.profileHeading}</h2>
          <p>{m.profile.introduction}</p>
          <Link className="text-link section-link" href="/experience">{m.about.experienceLink}</Link>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-research">
        <p className="detail-label">{m.about.currentResearch}</p>
        <div>
          <h2 id="about-research">{m.profile.currentResearchTitle}</h2>
          <p>{m.profile.currentResearchDescription}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-interests">
        <p className="detail-label">{m.about.intellectualInterests}</p>
        <div>
          <h2 id="about-interests">{m.about.intellectualInterests}</h2>
          <p>{m.about.interests}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-recognition">
        <p className="detail-label">{m.home.recognition}</p>
        <div>
          <h2 id="about-recognition">{m.profile.recognitionTitle}</h2>
          <p>{profile.recognition.organisation} · Economics</p>
          <Link className="text-link section-link" href="/writing/cashlessness-and-monetary-discretion">{profile.recognition.work}</Link>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-activities">
        <p className="detail-label">{m.home.activities}</p>
        <div>
          <h2 id="about-activities">{m.about.activities}</h2>
          <p>{m.about.activitiesDescription}</p>
        </div>
      </section>
      <div id="about-links" />
    </main>
  );
}
