import type { Metadata } from "next";
import Link from "next/link";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { profile } from "@/lib/profile";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const Arrow = () => <span aria-hidden="true">→</span>;

export const dynamic = "force-dynamic";

export default async function Home() {
  const [research, writing] = await Promise.all([
    listPublishedContent("research", 3),
    listPublishedContent("writing", 3),
  ]);
  const featuredResearch = research[0];
  return (
    <main>
      <section className="academic-hero shell" id="top" aria-labelledby="hero-title">
        <div className="academic-hero-title">
          <p className="work-meta">High school student · Spain</p>
          <h1 id="hero-title">Banking and financial institutions.</h1>
        </div>

        <div className="academic-hero-summary">
          <p>{profile.introduction}</p>
          <div className="hero-actions" aria-label="Primary pages">
            <Link className="text-link accent-link" href="/writing">
              Writing <Arrow />
            </Link>
            <Link className="text-link" href="/research">
              Research <Arrow />
            </Link>
            <Link className="text-link" href="/cv">
              CV <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <dl className="academic-facts shell">
        <div>
          <dt>Current focus</dt>
          <dd>Bank liquidity</dd>
        </div>
        <div>
          <dt>Fields</dt>
          <dd>Economics · Banking & finance · Political economy</dd>
        </div>
        <div>
          <dt>Recognition</dt>
          <dd>John Locke Institute · 2026 shortlist</dd>
        </div>
      </dl>

      <section className="portfolio-section home-section shell" id="writing" aria-labelledby="writing-heading">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <h2 id="writing-heading">Writing</h2>
            <p className="section-note">Essays and public commentary.</p>
          </div>
        </div>
        <div className="section-body writing-list homepage-list">
          {writing.length === 0 ? (
            <p className="publication-list-empty">No writing entries have been published yet.</p>
          ) : writing.map((item, index) => (
            <article className="writing-item" key={item.id}>
              <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <p className="item-meta">{contentMeta(item) || "Essay"}</p>
                <h3><Link href={contentHref(item)}>{item.title}</Link></h3>
              </div>
              <p className="writing-note">{item.status}</p>
            </article>
          ))}
          <Link className="text-link section-link" href="/writing">
            Open writing archive <Arrow />
          </Link>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="research" aria-labelledby="research-heading">
        <div className="section-heading">
          <p className="section-number">02</p>
          <div>
            <h2 id="research-heading">Research</h2>
            <p className="section-note">Research projects.</p>
          </div>
        </div>
        <div className="section-body">
          {featuredResearch ? (
            <article className="featured-work homepage-feature">
              <p className="work-meta">{contentMeta(featuredResearch) || "Research"}</p>
              <h3>{featuredResearch.title}</h3>
              {featuredResearch.summary && <p>{featuredResearch.summary}</p>}
              <Link className="text-link" href={contentHref(featuredResearch)}>
                View project <Arrow />
              </Link>
            </article>
          ) : (
            <article className="featured-work homepage-feature">
              <p className="work-meta">Current research · In progress</p>
              <h3>{profile.currentResearch.title}</h3>
              <p>{profile.currentResearch.description}</p>
              <Link className="text-link" href="/research">
                Research profile <Arrow />
              </Link>
            </article>
          )}
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="experience" aria-labelledby="experience-heading">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <h2 id="experience-heading">Experience</h2>
            <p className="section-note">Investment analysis and public speaking.</p>
          </div>
        </div>
        <div className="section-body timeline homepage-list">
          <article className="timeline-item">
            <p className="timeline-date">2026 — present</p>
            <div>
              <p className="item-meta">{profile.experience.organisation}</p>
              <h3>{profile.experience.role}</h3>
              <p>{profile.experience.description}</p>
            </div>
          </article>
          <article className="timeline-item">
            <p className="timeline-date">Activities</p>
            <div>
              <p className="item-meta">Debate and civic simulation</p>
              <h3>Public speaking</h3>
              <p>Two provincial school debate competitions and a European Parliament simulation.</p>
            </div>
          </article>
          <Link className="text-link section-link" href="/about">
            Read background <Arrow />
          </Link>
        </div>
      </section>

      <section className="portfolio-section home-section cv-section shell" id="cv" aria-labelledby="cv-heading">
        <div className="section-heading">
          <p className="section-number">04</p>
          <div>
            <h2 id="cv-heading">CV</h2>
            <p className="section-note">Curriculum vitae.</p>
          </div>
        </div>
        <div className="section-body cv-body">
          <div className="bio-block homepage-bio">
            <p className="bio-lead">
              IB Diploma Programme candidate in Spain, expected 2028.
            </p>
            <p>
              Independent work across economics, banking, finance, political
              economy, and mathematics.
            </p>
          </div>
          <Link className="text-link section-link" href="/cv">
            View curriculum vitae <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
