import Image from "next/image";

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

export function ReportPages() {
  return (
    <section className="report-pages" aria-labelledby="report-pages-heading">
      <header className="report-pages-heading">
        <p className="detail-label">Full report</p>
        <div>
          <h2 id="report-pages-heading">Figures, tables, and analysis</h2>
          <p>The original report layout is reproduced below. Select any page to open it at full resolution.</p>
        </div>
      </header>
      <nav className="report-page-index" aria-label="Report pages">
        {pages.map((_, index) => {
          const page = index + 1;
          return <a href={`#report-page-${page}`} key={page}>{page}</a>;
        })}
      </nav>
      <ol className="report-page-list">
        {pages.map((title, index) => {
          const page = index + 1;
          const filename = `page-${String(page).padStart(2, "0")}.jpg`;
          const source = `/reports/syf/${filename}`;
          return (
            <li className="report-page" id={`report-page-${page}`} key={page}>
              <figure>
                <a href={source} target="_blank" rel="noreferrer" aria-label={`Open page ${page} at full resolution`}>
                  <Image
                    alt={`Synchrony Financial equity report, page ${page}: ${title}`}
                    height={1584}
                    priority={page === 1}
                    sizes="(max-width: 900px) 94vw, 960px"
                    src={source}
                    width={1224}
                  />
                </a>
                <figcaption><span>Page {page}</span>{title}</figcaption>
              </figure>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
