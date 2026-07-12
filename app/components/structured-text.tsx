import Image from "next/image";
import type { ReactNode } from "react";

const sectionHeadings = new Set(["Conclusion", "Works Cited"]);

type StructuredFigure = {
  alt: string;
  height: number;
  src: string;
  width: number;
};

export function StructuredText({ body, figure }: { body: string; figure?: StructuredFigure }) {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  const bibliographyIndex = blocks.indexOf("Works Cited");

  return (
    <div className="publication-prose">
      {blocks.map((block, index) => {
        if (sectionHeadings.has(block)) {
          return <h2 key={`${block}-${index}`}>{block}</h2>;
        }
        if (bibliographyIndex !== -1 && index > bibliographyIndex) {
          return <p className="bibliography-entry" key={index}>{linkify(block)}</p>;
        }
        if (figure && /^Figure\s+1:/i.test(block)) {
          return (
            <figure className="publication-figure" key={index}>
              <a href={figure.src} target="_blank" rel="noreferrer" aria-label="Open Figure 1 at full resolution">
                <Image
                  alt={figure.alt}
                  height={figure.height}
                  sizes="(max-width: 900px) 94vw, 768px"
                  src={figure.src}
                  width={figure.width}
                />
              </a>
              <figcaption>{linkify(block)}</figcaption>
            </figure>
          );
        }
        if (/^Figure\s+\d+:/i.test(block)) {
          return <p className="figure-caption" key={index}>{linkify(block)}</p>;
        }
        return <p key={index}>{linkify(block)}</p>;
      })}
    </div>
  );
}

function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s]+)/g).filter(Boolean).map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const trailing = part.match(/[.,;:]$/)?.[0] ?? "";
    const href = trailing ? part.slice(0, -1) : part;
    return (
      <span key={`${href}-${index}`}>
        <a className="reference-link" href={href} target="_blank" rel="noreferrer">{href}</a>
        {trailing}
      </span>
    );
  });
}
