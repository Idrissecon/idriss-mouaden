import Link from "next/link";
import type { PublicContentItem } from "@/lib/content";
import { contentDisplayStatus, contentMeta } from "@/lib/content";
import { ReportPages } from "@/app/components/report-pages";
import { ReportTranscript } from "@/app/components/report-transcript";
import { StructuredText } from "@/app/components/structured-text";
import { messages, type Locale } from "@/lib/i18n";

export function ContentDetail({ item, locale }: { item: PublicContentItem; locale: Locale }) {
  const m = messages(locale);
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
      {item.status === "draft" && (
        <p className="admin-notice draft-banner" role="status">{m.content.draftNotice}</p>
      )}
      <header className="publication-hero">
        <Link className="back-link" href={`/${item.category}`}>
          {item.category === "research" ? m.content.backResearch : m.content.backWriting}
        </Link>
        <p className="work-meta">
          {item.category === "research" ? m.content.researchCategory : m.content.writingCategory}
          {meta ? ` · ${meta}` : ""}
        </p>
        <p className="publication-status">{contentDisplayStatus(item, locale)}</p>
        <h1>{item.title}</h1>
        {item.summary && <p className="publication-summary">{item.summary}</p>}
        <div className="publication-links">
          {documentHref && (
            <a className="text-link accent-link" href={documentHref} target="_blank" rel="noreferrer">
              {m.common.readPdf}
            </a>
          )}
          {item.externalUrl && (
            <a className="text-link" href={item.externalUrl} target="_blank" rel="noreferrer">
              {m.common.externalLink}
            </a>
          )}
        </div>
      </header>
      {isSynchronyReport && <ReportPages locale={locale} />}
      {item.body && isSynchronyReport && <ReportTranscript body={item.body} locale={locale} />}
      {item.body && !isSynchronyReport && (
        <article className="publication-body">
          <p className="detail-label">{m.common.text}</p>
          <StructuredText
            body={item.body}
            figure={isNationStateEssay ? {
              alt: m.content.nationFigureAlt,
              height: 970,
              openLabel: m.content.openFigure,
              src: "/images/nation-state/german-confederation-1815-1866.png",
              width: 960,
            } : undefined}
          />
        </article>
      )}
    </main>
  );
}
