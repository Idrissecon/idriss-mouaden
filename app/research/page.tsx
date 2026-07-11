import type { Metadata } from "next";
import Link from "next/link";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Research — Idriss Mouaden",
  description: "Research projects by Idriss Mouaden.",
};

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const items = await listPublishedContent("research");
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#research">← Home</Link>
        <p className="work-meta">Research</p>
        <h1>Research</h1>
        <p>Working papers, research notes, and longer projects.</p>
      </header>
      <section className="detail-content" aria-labelledby="current-research">
        <p className="detail-label">Current project</p>
        <div>
          <h2 id="current-research">{profile.currentResearch.title}</h2>
          <p>{profile.currentResearch.description}</p>
        </div>
      </section>
      <section className="publication-index" aria-labelledby="research-list">
        <p className="detail-label">Selected work</p>
        <div className="publication-list">
          {items.length === 0 && (
            <article className="publication-list-empty">
              <h2 id="research-list">No research entries have been published yet.</h2>
            </article>
          )}
          {items.map((item, index) => (
            <article className="publication-list-item" key={item.id}>
              <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <p className="item-meta">{contentMeta(item) || "Research"}</p>
                <h2 id={index === 0 ? "research-list" : undefined}>
                  <Link href={contentHref(item)}>{item.title}</Link>
                </h2>
                {item.summary && <p>{item.summary}</p>}
                <Link className="text-link" href={contentHref(item)}>View project →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
