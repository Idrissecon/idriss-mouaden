import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/json-ld";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { collectionStructuredData, pageMetadata } from "@/lib/seo";

const spanish = messages("es").writingPage;
export const metadata: Metadata = pageMetadata(
  spanish.title,
  spanish.description,
  "/writing",
);

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  const [locale, items] = await Promise.all([
    getLocale(),
    listPublishedContent("writing"),
  ]);
  const m = messages(locale);
  return (
    <>
      <JsonLd data={collectionStructuredData(spanish.title, spanish.description, "/writing", items)} />
      <main className="detail-page shell">
        <header className="detail-hero">
          <Link className="back-link" href="/#writing">← {m.common.home}</Link>
          <p className="work-meta">{m.writingPage.title}</p>
          <h1>{m.writingPage.title}</h1>
          <p>{m.writingPage.intro}</p>
        </header>
        <section className="publication-index" aria-labelledby="writing-list">
          <p className="detail-label">{m.writingPage.archive}</p>
          <div className="publication-list">
            {items.length === 0 && (
              <article className="publication-list-empty">
                <h2 id="writing-list">{m.writingPage.empty}</h2>
              </article>
            )}
            {items.map((item, index) => (
              <article className="publication-list-item" key={item.id}>
                <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <p className="item-meta">{contentMeta(item) || m.common.essay}</p>
                  <h2 id={index === 0 ? "writing-list" : undefined}>
                    <Link href={contentHref(item)}>{item.title}</Link>
                  </h2>
                  {item.summary && <p>{item.summary}</p>}
                  <Link className="text-link" href={contentHref(item)}>{m.writingPage.readEntry}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
