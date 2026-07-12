import type { Metadata } from "next";
import Link from "next/link";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { profile } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

const spanish = messages("es").about;
export const metadata: Metadata = pageMetadata(
  spanish.title,
  spanish.description,
  "/about",
);

export default async function AboutPage() {
  const m = messages(await getLocale());
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#experience">← {m.common.home}</Link>
        <p className="work-meta">{m.about.title}</p>
        <h1>{m.about.title}</h1>
        <p>{m.profile.role} · {m.profile.location}</p>
      </header>
      <section className="detail-content" aria-labelledby="about-profile">
        <p className="detail-label">{m.about.profile}</p>
        <div>
          <h2 id="about-profile">{m.about.profileHeading}</h2>
          <p>{m.profile.introduction}</p>
          <p>{m.about.interests}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-research">
        <p className="detail-label">{m.about.currentResearch}</p>
        <div>
          <h2 id="about-research">{m.profile.currentResearchTitle}</h2>
          <p>{m.profile.currentResearchDescription}</p>
        </div>
      </section>
      <section className="detail-content" aria-labelledby="about-links">
        <p className="detail-label">{m.about.contact}</p>
        <div>
          <h2 id="about-links">{m.about.contactHeading}</h2>
          <p>
            <a className="text-link" href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
          </p>
          <p>
            <a className="text-link" href={profile.contactPhone.href}>{profile.contactPhone.display}</a>
          </p>
          <p>
            <a className="text-link" href={profile.orcid} target="_blank" rel="me noreferrer">ORCID ↗</a>
          </p>
        </div>
      </section>
    </main>
  );
}
