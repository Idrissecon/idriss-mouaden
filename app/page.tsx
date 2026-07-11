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
          <p className="work-meta">Academic portfolio</p>
          <h1 id="hero-title">Idriss Mouaden.</h1>
        </div>

        <div className="academic-hero-summary">
          <p>Research and writing.</p>
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

      <section className="portfolio-section home-section shell" id="research" aria-labelledby="research-heading">
        <div className="section-heading">
          <p className="section-number">01</p>
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
            <p className="publication-list-empty">No research entries have been published yet.</p>
          )}
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

      <section className="portfolio-section home-section cv-section shell" id="cv" aria-labelledby="cv-heading">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <h2 id="cv-heading">CV</h2>
            <p className="section-note">Curriculum vitae.</p>
          </div>
        </div>
        <div className="section-body cv-body">
          <Link className="text-link section-link" href="/cv">
            View curriculum vitae <Arrow />
          </Link>
        </div>
      </section>
    </main>
  );
}
