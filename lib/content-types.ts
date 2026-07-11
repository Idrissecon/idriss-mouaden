export type ContentItem = {
  id: number;
  title: string;
  slug: string;
  category: "research" | "writing";
  status: "draft" | "published";
  summary: string;
  body: string;
  venue: string | null;
  year: number | null;
  publicationDate: string | null;
  featured: boolean;
  externalUrl: string | null;
  documentKey: string | null;
  documentName: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ContentRow = {
  id: number;
  title: string;
  slug: string;
  category: "research" | "writing";
  status: "draft" | "published";
  summary: string;
  body: string;
  venue: string | null;
  year: number | null;
  publication_date: string | null;
  featured: boolean;
  external_url: string | null;
  document_key: string | null;
  document_name: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

export function toContentItem(row: ContentRow): ContentItem {
  return {
    id: Number(row.id),
    title: row.title,
    slug: row.slug,
    category: row.category,
    status: row.status,
    summary: row.summary,
    body: row.body,
    venue: row.venue,
    year: row.year,
    publicationDate: row.publication_date,
    featured: row.featured,
    externalUrl: row.external_url,
    documentKey: row.document_key,
    documentName: row.document_name,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
