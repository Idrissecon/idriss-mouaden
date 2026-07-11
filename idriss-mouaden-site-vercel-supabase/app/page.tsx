import Link from "next/link";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";

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
          <p className="work-meta">Economics · Banking</p>
          <h1 id="hero-title">Banking and monetary institutions.</h1>
        </div>

        <div className="academic-hero-summary">
          <p>
            Student based in Spain. Research interests include bank liquidity,
            credit, and monetary economics.
          </p>
          <div className="hero-actions" aria-label="Primary pages">
            <Link className="text-link accent-link" href="/research">
              Research <Arrow />
            </Link>
            <Link className="text-link" href="/writing">
              Writing <Arrow />
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
          <dd>Contingent funding capacity</dd>
        </div>
        <div>
          <dt>Fields</dt>
          <dd>Banking · Credit · Monetary economics</dd>
        </div>
        <div>
          <dt>Recognition</dt>
          <dd>John Locke Institute, 2026 shortlist</dd>
        </div>
      </dl>

      <section className="portfolio-section home-section shell" id="research" aria-labelledby="research-heading">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <h2 id="research-heading">Research</h2>
            <p className="section-note">Working papers and longer projects.</p>
          </div>
        </div>
        <div className="section-body">
          <article className="featured-work homepage-feature">
            <p className="work-meta">
              {featuredResearch ? contentMeta(featuredResearch) || "Selected research" : "Current work · Banking · 2026"}
            </p>
            <h3>{featuredResearch?.title ?? "Current paper on contingent funding capacity"}</h3>
            <p>
              {featuredResearch?.summary ?? "Current research examines collateral, asset pledgeability, and contingent funding capacity. Titles and full project records will be added after review."}
            </p>
            <Link className="text-link" href={featuredResearch ? contentHref(featuredResearch) : "/research"}>
              {featuredResearch ? "View project" : "Open research page"} <Arrow />
            </Link>
          </article>
        </div>
      </section>

      <section className="portfolio-section home-section shell" id="writing" aria-labelledby="writing-heading">
        <div className="section-heading">
          <p className="section-number">02</p>
          <div>
            <h2 id="writing-heading">Writing</h2>
            <p className="section-note">Essays and public commentary.</p>
          </div>
        </div>
        <div className="section-body writing-list homepage-list">
          {writing.length === 0 ? (
            <article className="writing-item">
              <p className="writing-number">01</p>
              <div>
                <p className="item-meta">Essays</p>
                <h3>Monetary economics and political economy</h3>
              </div>
              <p className="writing-note">Archive under review</p>
            </article>
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

      <section className="portfolio-section home-section shell" id="experience" aria-labelledby="experience-heading">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <h2 id="experience-heading">Experience</h2>
            <p className="section-note">Investment work, research, and speaking.</p>
          </div>
        </div>
        <div className="section-body timeline homepage-list">
          <article className="timeline-item">
            <p className="timeline-date">2026 — present</p>
            <div>
              <p className="item-meta">BYCIG</p>
              <h3>Investment analysis</h3>
              <p>
                Active member working on company analysis and investment
                proposals in a personal capacity.
              </p>
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
            <p className="section-note">Academic profile and distinctions.</p>
          </div>
        </div>
        <div className="section-body cv-body">
          <div className="bio-block homepage-bio">
            <p className="bio-lead">
              Student based in Spain, focused on economics, banking, and
              political economy.
            </p>
            <p>
              Shortlisted for the 2026 John Locke Institute Global Essay Prize.
              The full CV will be completed after factual review.
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
