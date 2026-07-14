import type { Metadata } from "next";
import Link from "next/link";
import { contentDisplayStatus, contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { cvHref, profile } from "@/lib/profile";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const Arrow = () => <span aria-hidden="true">→</span>;

export const dynamic = "force-dynamic";

export default async function Home() {
  const [locale, research, writing] = await Promise.all([
    getLocale(),
    listPublishedContent("research", 3),
    listPublishedContent("writing", 3),
  ]);
  const m = messages(locale);
  const featuredResearch = research[0];
  return (
    <main>
      <section className="academic-hero shell" id="top" aria-labelledby="hero-title">
        <div className="academic-hero-title">
          <p className="work-meta">{m.home.eyebrow}</p>
          <h1 id="hero-title">{m.home.title}</h1>
        </div>

        <div className="academic-hero-summary">
          <p>{m.profile.introduction}</p>
          <div className="hero-actions" aria-label={m.home.primaryPages}>
            <Link className="text-link accent-link" href="/research">
              {m.nav.research} <Arrow />
            </Link>
            <Link className="text-link" href="/writing">
              {m.nav.writing} <Arrow />
            </Link>
            <Link className="text-link" href={cvHref}>
              CV <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <dl className="academic-facts shell">
        <div>
          <dt>{m.home.currentFocus}</dt>
          <dd>{m.home.bankLiquidity}</dd>
        </div>
        <div>
          <dt>{m.home.fields}</dt>
          <dd>{m.home.fieldsValue}</dd>
        </div>
        <div>
          <dt>{m.home.recognition}</dt>
          <dd>{m.home.recognitionValue}</dd>
        </div>
      </dl>

      <section className="portfolio-section home-section shell" id="research" aria-labelledby="research-heading">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <h2 id="research-heading">{m.nav.research}</h2>
            <p className="section-note">{m.home.researchNote}</p>
          </div>
        </div>
        <div className="section-body">
          {featuredResearch ? (
            <article className="featured-work homepage-feature">
              <p className="work-meta">{contentMeta(featuredResearch) || m.common.research}</p>
              <h3>{featuredResearch.title}</h3>
              {featuredResearch.summary && <p>{featuredResearch.summary}</p>}
              <Link className="text-link" href={contentHref(featuredResearch)}>
                {m.home.viewProject} <Arrow />
              </Link>
            </article>
          ) : (
            <article className="featured-work homepage-feature">
              <p className="work-meta">{m.common.current} · {m.common.inProgress}</p>
              <h3>{m.profile.currentResearchTitle}</h3>
              <p>{m.profile.currentResearchDescription}</p>
              <Link className="text-link" href="/research">
                {m.home.researchProfile} <Arrow />
              </Link>
            </article>
          )}
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="writing" aria-labelledby="writing-heading">
        <div className="section-heading">
          <p className="section-number">02</p>
          <div>
            <h2 id="writing-heading">{m.nav.writing}</h2>
            <p className="section-note">{m.home.writingNote}</p>
          </div>
        </div>
        <div className="section-body writing-list homepage-list">
          {writing.length === 0 ? (
            <p className="publication-list-empty">{m.home.noWriting}</p>
          ) : writing.map((item, index) => (
            <article className="writing-item" key={item.id}>
              <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <p className="item-meta">{contentMeta(item) || m.common.essay}</p>
                <h3><Link href={contentHref(item)}>{item.title}</Link></h3>
              </div>
              <p className="writing-note">{contentDisplayStatus(item, locale)}</p>
            </article>
          ))}
          <Link className="text-link section-link" href="/writing">
            {m.home.openWriting} <Arrow />
          </Link>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="about" aria-labelledby="about-heading">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <h2 id="about-heading">{m.nav.about}</h2>
            <p className="section-note">{m.home.experienceNote}</p>
          </div>
        </div>
        <div className="section-body timeline homepage-list">
          <article className="timeline-item">
            <p className="timeline-date">2026 — {m.home.present}</p>
            <div>
              <p className="item-meta">{profile.experience.organisation}</p>
              <h3>{m.profile.experienceRole}</h3>
              <p>{m.profile.experienceDescription}</p>
            </div>
          </article>
          <article className="timeline-item">
            <p className="timeline-date">{m.home.activities}</p>
            <div>
              <p className="item-meta">{m.home.debateMeta}</p>
              <h3>{m.home.publicSpeaking}</h3>
              <p>{m.home.publicSpeakingDescription}</p>
            </div>
          </article>
          <Link className="text-link section-link" href="/about">
            {m.home.readBackground} <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
