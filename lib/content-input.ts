export type ContentInput = {
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
};

export function contentInputToRow(input: ContentInput) {
  return {
    title: input.title,
    slug: input.slug,
    category: input.category,
    status: input.status,
    summary: input.summary,
    body: input.body,
    venue: input.venue,
    year: input.year,
    publication_date: input.publicationDate,
    featured: input.featured,
    external_url: input.externalUrl,
    document_key: input.documentKey,
    document_name: input.documentName,
    tags: input.tags,
  };
}

export function parseContentInput(value: unknown): ContentInput {
  const input = (value ?? {}) as Record<string, unknown>;
  const title = cleanText(input.title);
  const category = input.category === "writing" ? "writing" : "research";
  const status = input.status === "published" ? "published" : "draft";
  const slug = slugify(cleanText(input.slug) || title);

  if (!title) throw new Error("El título es obligatorio.");
  if (!slug) throw new Error("No se ha podido crear una URL válida.");

  const rawYear = Number(input.year);
  const year = Number.isInteger(rawYear) && rawYear >= 1900 && rawYear <= 2200 ? rawYear : null;
  const externalUrl = nullableText(input.externalUrl);
  const tags = Array.isArray(input.tags)
    ? input.tags.reduce<string[]>((result, value) => {
        const tag = cleanText(value).replace(/\s+/g, " ").slice(0, 40);
        if (tag && !result.some((current) => current.toLowerCase() === tag.toLowerCase())) {
          result.push(tag);
        }
        return result;
      }, []).slice(0, 12)
    : [];
  if (externalUrl && !/^https?:\/\//i.test(externalUrl)) {
    throw new Error("El enlace externo debe empezar por http:// o https://.");
  }

  return {
    title,
    slug,
    category,
    status,
    summary: cleanText(input.summary),
    body: cleanText(input.body),
    venue: nullableText(input.venue),
    year,
    publicationDate: nullableText(input.publicationDate),
    featured: Boolean(input.featured),
    externalUrl,
    documentKey: nullableText(input.documentKey),
    documentName: nullableText(input.documentName),
    tags,
  };
}

export function contentApiError(message: string) {
  const conflict = message.includes("duplicate key") || message.includes("content_items_slug_key");
  const validation = message.includes("obligatorio") || message.includes("enlace externo");
  return Response.json(
    { error: conflict ? "Ya existe una entrada con esa URL. Cambia el slug." : message },
    { status: conflict ? 409 : validation ? 400 : 500 },
  );
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const result = cleanText(value);
  return result || null;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
