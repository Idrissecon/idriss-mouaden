import Image from "next/image";
import { messages, type Locale } from "@/lib/i18n";

const pages = [
  "Investment recommendation and valuation overview",
  "Business summary and recommendation snapshot",
  "Business model map",
  "Sales platforms",
  "Volume, receivables, and revenue mechanics",
  "Credit performance",
  "Funding, liquidity, and regulatory capital",
  "Funding and liquidity discussion",
  "Financial forecast and assumptions",
  "Valuation summary",
  "Total capital return model",
  "Risk matrix",
  "Source tracker",
] as const;

type PaginatedReport = {
  id: number;
  pageCount: number;
  title: string;
};

export function ReportPages({ locale, report }: { locale: Locale; report?: PaginatedReport }) {
  const m = messages(locale);
  const pageTitles = report
    ? Array.from({ length: report.pageCount }, (_, index) => `${report.title} — ${m.report.page} ${index + 1}`)
    : pages;
  return (
    <section className="report-pages" aria-labelledby="report-pages-heading">
      <header className="report-pages-heading">
        <p className="detail-label">{m.report.fullReport}</p>
        <div>
          <h2 id="report-pages-heading">{m.report.heading}</h2>
          <p>{m.report.explanation}</p>
        </div>
      </header>
      <nav className="report-page-index" aria-label={m.report.pagesAria}>
        {pageTitles.map((_, index) => {
          const page = index + 1;
          return <a href={`#report-page-${page}`} key={page}>{page}</a>;
        })}
      </nav>
      <ol className="report-page-list">
        {pageTitles.map((title, index) => {
          const page = index + 1;
          const source = report
            ? `/api/report-pages/${report.id}/page-${String(page).padStart(4, "0")}.jpg`
            : `/reports/syf/page-${String(page).padStart(2, "0")}.jpg`;
          return (
            <li className="report-page" id={`report-page-${page}`} key={page}>
              <figure>
                <a href={source} target="_blank" rel="noreferrer" aria-label={m.report.openPage(page)}>
                  <Image
                    alt={m.report.imageAlt(page, title)}
                    height={1584}
                    priority={page === 1}
                    sizes="(max-width: 900px) 94vw, 960px"
                    src={source}
                    unoptimized={Boolean(report)}
                    width={1224}
                  />
                </a>
                <figcaption><span>{m.report.page} {page}</span>{title}</figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
