import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/app/components/json-ld";
import { contentHref, contentMeta, listPublishedContent } from "@/lib/content";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { collectionStructuredData, pageMetadata } from "@/lib/seo";

const english = messages("en").researchPage;
export const metadata: Metadata = pageMetadata(
  english.title,
  english.description,
  "/research",
);

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const [locale, items] = await Promise.all([
    getLocale(),
    listPublishedContent("research"),
  ]);
  const m = messages(locale);
  return (
    <>
      <JsonLd data={collectionStructuredData(english.title, english.description, "/research", items)} />
      <main className="detail-page shell">
        <header className="detail-hero">
          <Link className="back-link" href="/#research">← {m.common.home}</Link>
          <p className="work-meta">{m.researchPage.title}</p>
          <h1>{m.researchPage.title}</h1>
          <p>{m.researchPage.intro}</p>
        </header>
        <section className="detail-content" aria-labelledby="current-research">
          <p className="detail-label">{m.researchPage.currentProject}</p>
          <div>
            <h2 id="current-research">{m.profile.currentResearchTitle}</h2>
            <p>{m.profile.currentResearchDescription}</p>
          </div>
        </section>
        <section className="publication-index" aria-labelledby="research-list">
          <p className="detail-label">{m.researchPage.selectedWork}</p>
          <div className="publication-list">
            {items.length === 0 && (
              <article className="publication-list-empty">
                <h2 id="research-list">{m.researchPage.empty}</h2>
              </article>
            )}
            {items.map((item, index) => (
              <article className="publication-list-item" key={item.id}>
                <p className="writing-number">{String(index + 1).padStart(2, "0")}</p>
                <div>
                  <p className="item-meta">{contentMeta(item) || m.common.research}</p>
                  <h2 id={index === 0 ? "research-list" : undefined}>
                    <Link href={contentHref(item)}>{item.title}</Link>
                  </h2>
                  {item.summary && <p>{item.summary}</p>}
                  <Link className="text-link" href={contentHref(item)}>{m.researchPage.viewProject}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
