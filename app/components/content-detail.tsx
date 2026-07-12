import Link from "next/link";
import type { PublicContentItem } from "@/lib/content";
import { contentMeta } from "@/lib/content";
import { ReportPages } from "@/app/components/report-pages";
import { ReportTranscript } from "@/app/components/report-transcript";
import { StructuredText } from "@/app/components/structured-text";

export function ContentDetail({ item }: { item: PublicContentItem }) {
  const meta = contentMeta(item);
  const documentHref = item.documentKey?.startsWith("static/")
    ? `/documents/${encodeURIComponent(item.documentKey.slice("static/".length))}`
    : item.documentKey
      ? `/api/files/${encodeURIComponent(item.documentKey)}`
      : null;
  const isSynchronyReport = item.slug === "synchrony-financial-investment-report";
  const isNationStateEssay = item.slug === "nations-states-and-the-free-evolution-of-social-order";
  return (
    <main className="detail-page shell publication-page">
      <header className="publication-hero">
        <Link className="back-link" href={`/${item.category}`}>← {item.category === "research" ? "Research" : "Writing"}</Link>
        <p className="work-meta">{item.category}{meta ? ` · ${meta}` : ""}</p>
        <h1>{item.title}</h1>
        {item.summary && <p className="publication-summary">{item.summary}</p>}
        <div className="publication-links">
          {documentHref && (
            <a className="text-link accent-link" href={documentHref} target="_blank" rel="noreferrer">
              Read PDF ↗
            </a>
          )}
          {item.externalUrl && (
            <a className="text-link" href={item.externalUrl} target="_blank" rel="noreferrer">
              External link ↗
            </a>
          )}
        </div>
      </header>
      {isSynchronyReport && <ReportPages />}
      {item.body && isSynchronyReport && <ReportTranscript body={item.body} />}
      {item.body && !isSynchronyReport && (
        <article className="publication-body">
          <p className="detail-label">Text</p>
          <StructuredText
            body={item.body}
            figure={isNationStateEssay ? {
              alt: "Map of the German Confederation and its constituent states from 1815 to 1866",
              height: 970,
              src: "/images/nation-state/german-confederation-1815-1866.png",
              width: 960,
            } : undefined}
          />
        </article>
      )}
    </main>
  );
}
