import Link from "next/link";
import type { PublicContentItem } from "@/lib/content";
import { contentMeta } from "@/lib/content";

export function ContentDetail({ item }: { item: PublicContentItem }) {
  const meta = contentMeta(item);
  return (
    <main className="detail-page shell publication-page">
      <header className="publication-hero">
        <Link className="back-link" href={`/${item.category}`}>← {item.category === "research" ? "Research" : "Writing"}</Link>
        <p className="work-meta">{item.category}{meta ? ` · ${meta}` : ""}</p>
        <h1>{item.title}</h1>
        {item.summary && <p className="publication-summary">{item.summary}</p>}
        <div className="publication-links">
          {item.documentKey && (
            <a className="text-link accent-link" href={`/api/files/${item.documentKey}`} target="_blank" rel="noreferrer">
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
      {item.body && (
        <article className="publication-body">
          <p className="detail-label">{item.category === "research" ? "Abstract / notes" : "Text"}</p>
          <div>{item.body}</div>
        </article>
      )}
    </main>
  );
}
