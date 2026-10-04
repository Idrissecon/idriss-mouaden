import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceList } from "@/app/components/experience-list";
import { contentDisplayStatus, contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { academicCvHref, profile } from "@/lib/profile";
import { pageMetadata, siteConfig } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = messages(locale);
  const title = locale === "en" ? siteConfig.title : `Idriss Mouaden — ${m.about.profileHeading}`;
  const metadata = pageMetadata("Idriss Mouaden", m.home.heroDescription, "/");
  return {
    ...metadata,
    title: { absolute: title },
    openGraph: { ...metadata.openGraph, title },
    twitter: { ...metadata.twitter, title },
  };
}

const Arrow = () => <span aria-hidden="true">→</span>;

export const dynamic = "force-dynamic";

export default async function Home() {
  const [locale, research, writing] = await Promise.all([
    getLocale(),
    listPublishedContent("research", 3),
    listPublishedContent("writing", 2),
  ]);
  const m = messages(locale);
  return (
    <main>
      <section className="academic-hero shell" id="top" aria-labelledby="hero-title">
        <div className="academic-hero-title">
          <p className="work-meta">{m.home.eyebrow}</p>
          <h1 id="hero-title">{m.home.title}</h1>
        </div>
        <div className="academic-hero-summary">
          <p>{m.home.heroDescription}</p>
          <div className="hero-actions" aria-label={m.home.primaryPages}>
            <Link className="text-link accent-link" href="/research">{m.nav.research} <Arrow /></Link>
            <Link className="text-link" href="/experience">{m.nav.experience} <Arrow /></Link>
            <Link className="text-link" href={academicCvHref(locale)}>{m.nav.cv} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="research" aria-labelledby="research-heading">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <h2 id="research-heading">{m.home.selectedWork}</h2>
            <p className="section-note">{m.home.researchNote}</p>
          </div>
        </div>
        <div className="section-body selected-work-list">
          {research.length === 0 ? <p>{m.researchPage.empty}</p> : research.map((item) => (
            <article className="featured-work homepage-feature" key={item.id}>
              <p className="work-meta">{contentMeta(item) || m.common.research}</p>
              <h3><Link href={contentHref(item)}>{item.title}</Link></h3>
              {item.summary && <p>{item.summary}</p>}
              <Link className="text-link" href={contentHref(item)}>{m.home.viewProject} <Arrow /></Link>
            </article>
          ))}
          <Link className="text-link section-link" href="/research">{m.home.viewResearch} <Arrow /></Link>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="experience" aria-labelledby="experience-heading">
        <div className="section-heading">
          <p className="section-number">02</p>
          <div>
            <h2 id="experience-heading">{m.nav.experience}</h2>
            <p className="section-note">{m.home.experienceNote}</p>
          </div>
        </div>
        <div className="section-body homepage-list">
          <ExperienceList locale={locale} />
          <Link className="text-link section-link" href="/experience">{m.about.experienceLink}</Link>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="current-research" aria-labelledby="current-research-heading">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <h2 id="current-research-heading">{m.home.currentResearch}</h2>
            <p className="section-note">{m.home.currentResearchNote}</p>
          </div>
        </div>
        <div className="section-body">
          <article className="featured-work homepage-feature">
            <p className="work-meta">{m.common.inProgress}</p>
            <h3>{m.profile.currentResearchTitle}</h3>
            <p>{m.profile.currentResearchDescription}</p>
            <Link className="text-link" href="/research#current-research">{m.home.researchProfile} <Arrow /></Link>
          </article>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="writing" aria-labelledby="writing-heading">
        <div className="section-heading">
          <p className="section-number">04</p>
          <div>
            <h2 id="writing-heading">{m.nav.writing}</h2>
            <p className="section-note">{m.home.writingNote}</p>
          </div>
        </div>
        <div className="section-body writing-list homepage-list">
          {writing.length === 0 ? <p className="publication-list-empty">{m.home.noWriting}</p> : writing.map((item, index) => (
            <article className="writing-item" key={item.id}>
              <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <p className="item-meta">{contentMeta(item) || m.common.essay}</p>
                <h3><Link href={contentHref(item)}>{item.title}</Link></h3>
              </div>
              <p className="writing-note">{contentDisplayStatus(item, locale)}</p>
            </article>
          ))}
          <p className="recognition-note">{m.home.recognition}: {profile.recognition.organisation} · {m.profile.recognitionTitle}</p>
          <Link className="text-link section-link" href="/writing">{m.home.openWriting} <Arrow /></Link>
        </div>
      </section>
      {/* Preserve existing inbound Home anchors while their content lives on dedicated pages. */}
      <div className="shell profile-page-links" id="about">
        <Link className="text-link" href="/about">{m.nav.about} <Arrow /></Link>
        <Link className="text-link" href="/resume" id="cv">{m.experiencePage.resume}</Link>
      </div>
    </main>
  );
}
