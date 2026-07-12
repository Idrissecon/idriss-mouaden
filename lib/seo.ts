import type { Metadata } from "next";
import type { ContentItem } from "@/lib/content-types";

export const siteConfig = {
  name: "Idriss Mouaden",
  title: "Idriss Mouaden — Economics, Banking & Financial Institutions",
  description:
    "Research, essays, and financial analysis by Idriss Mouaden on banking, financial institutions, monetary economics, and political economy.",
  url: "https://www.idrissmouaden.com",
  locale: "en_GB",
  language: "en",
  articleLocale: "en_GB",
  articleLanguage: "en",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function contentPath(item: Pick<ContentItem, "category" | "slug">) {
  return `/${item.category}/${item.slug}`;
}

export function contentDocumentUrl(
  item: Pick<ContentItem, "documentKey" | "category" | "slug">,
) {
  if (!item.documentKey) return null;
  return absoluteUrl(`${contentPath(item)}/paper.pdf`);
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} — ${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${title} — ${siteConfig.name}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${siteConfig.name}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function contentMetadata(item: ContentItem): Metadata {
  const path = contentPath(item);
  const canonical = absoluteUrl(path);
  const description = item.summary || `${item.title}, by Idriss Mouaden.`;
  const publicationDate = item.publicationDate ?? item.year?.toString();
  const documentUrl = contentDocumentUrl(item);
  const keywords = Array.from(new Set([
    ...item.tags,
    item.category === "research" ? "economic research" : "economics essays",
    "banking",
    "financial institutions",
    "Idriss Mouaden",
  ]));
  const other: Record<string, string> = {
    "citation_title": item.title,
    "citation_author": siteConfig.name,
    "citation_public_url": canonical,
    "citation_language": siteConfig.articleLanguage,
    "citation_keywords": keywords.join("; "),
    "DC.title": item.title,
    "DC.creator": siteConfig.name,
    "DC.identifier": canonical,
    "DC.language": siteConfig.articleLanguage,
    "DC.type": "Text",
  };

  if (publicationDate) {
    other.citation_publication_date = publicationDate;
    other["DC.date"] = publicationDate;
  }
  if (documentUrl) other.citation_pdf_url = documentUrl;
  if (item.slug === "synchrony-financial-investment-report") {
    other.citation_technical_report_institution = "BYCIG";
  }

  return {
    title: item.title,
    description,
    keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: item.title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.articleLocale,
      publishedTime: item.publicationDate ?? undefined,
      modifiedTime: item.updatedAt,
      authors: [siteConfig.name],
      section: item.category === "research" ? "Research" : "Writing",
      tags: item.tags,
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${item.title} — ${siteConfig.name}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: ["/opengraph-image"],
    },
    other,
  };
}

export function contentStructuredData(item: ContentItem) {
  const url = absoluteUrl(contentPath(item));
  const documentUrl = contentDocumentUrl(item);
  const datePublished = item.publicationDate ?? item.year?.toString();
  const articleType = item.category === "research" ? "ScholarlyArticle" : "Article";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": articleType,
        "@id": `${url}#article`,
        headline: item.title,
        name: item.title,
        description: item.summary,
        abstract: item.summary,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": `${siteConfig.url}/#person` },
        publisher: { "@id": `${siteConfig.url}/#person` },
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: siteConfig.articleLanguage,
        datePublished,
        dateModified: item.updatedAt,
        keywords: item.tags,
        about: item.tags.map((name) => ({ "@type": "Thing", name })),
        associatedMedia: documentUrl ? {
          "@type": "MediaObject",
          contentUrl: documentUrl,
          encodingFormat: "application/pdf",
          name: item.documentName ?? `${item.title}.pdf`,
        } : undefined,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: item.category === "research" ? "Research" : "Writing",
            item: absoluteUrl(`/${item.category}`),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: item.title,
            item: url,
          },
        ],
      },
    ],
  };
}

export function collectionStructuredData(
  title: string,
  description: string,
  path: string,
  items: ContentItem[],
) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    name: title,
    description,
    url,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: absoluteUrl(contentPath(item)),
      })),
    },
  };
}

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
      sameAs: ["https://orcid.org/0009-0007-7001-022X"],
      jobTitle: "Independent student researcher",
      description:
        "Economics student and independent researcher focused on banking, financial systems, and monetary institutions.",
      knowsAbout: [
        "Economics",
        "Banking",
        "Financial institutions",
        "Monetary economics",
        "Political economy",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};
