import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/json-ld";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { collectionStructuredData, pageMetadata } from "@/lib/seo";

const description = "Essays by Idriss Mouaden on economics, monetary institutions, political economy, liberty, and the evolution of social order.";
export const metadata: Metadata = pageMetadata(
  "Writing",
  description,
  "/writing",
);

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const items = await listPublishedContent("writing");
  return (
    <>
      <JsonLd data={collectionStructuredData("Writing", description, "/writing", items)} />
      <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#writing">← Home</Link>
        <p className="work-meta">Writing</p>
        <h1>Writing</h1>
        <p>Essays, commentary, and selected shorter pieces.</p>
      </header>
      <section className="publication-index" aria-labelledby="writing-list">
        <p className="detail-label">Archive</p>
        <div className="publication-list">
          {items.length === 0 && (
            <article className="publication-list-empty">
              <h2 id="writing-list">No writing entries have been published yet.</h2>
            </article>
          )}
          {items.map((item, index) => (
            <article className="publication-list-item" key={item.id}>
              <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
              <div>
                <p className="item-meta">{contentMeta(item) || "Essay"}</p>
                <h2 id={index === 0 ? "writing-list" : undefined}>
                  <Link href={contentHref(item)}>{item.title}</Link>
                </h2>
                {item.summary && <p>{item.summary}</p>}
                <Link className="text-link" href={contentHref(item)}>Read entry →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
    </>
  );
}
