import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  toContentItem,
  type ContentItem,
  type ContentRow,
} from "@/lib/content-types";
import type { Locale } from "@/lib/i18n";

export type PublicContentItem = ContentItem;

export const listPublishedContent = cache(async function listPublishedContent(
  category?: "research" | "writing",
  limit = 50,
): Promise<PublicContentItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from("content_items")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("publication_date", { ascending: false, nullsFirst: false })
    .order("year", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) {
    console.error("Could not load published content", error.message);
    return [];
  }
  return ((data ?? []) as ContentRow[]).map(toContentItem);
});

export const getPublishedContentBySlug = cache(async function getPublishedContentBySlug(
  category: "research" | "writing",
  slug: string,
): Promise<PublicContentItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("status", "published")
    .eq("category", category)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toContentItem(data as ContentRow);
});

// Row Level Security only exposes drafts to the signed-in owner, so this
// returns published content for visitors and drafts for the owner.
export const getViewableContentBySlug = cache(async function getViewableContentBySlug(
  category: "research" | "writing",
  slug: string,
): Promise<PublicContentItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_items")
    .select("*")
    .eq("category", category)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toContentItem(data as ContentRow);
});

export { contentPath as contentHref } from "@/lib/seo";

export function contentMeta(item: ContentItem) {
  return [item.venue, ...item.tags, item.year?.toString()].filter(Boolean).join(" · ");
}

const displayStatusBySlug: Record<Locale, Record<string, string> & { default: string }> = {
  en: {
    "cashlessness-and-monetary-discretion": "Shortlisted · Full text forthcoming",
    "the-end-of-exit": "Submitted · Decision pending",
    default: "Published",
  },
  es: {
    "cashlessness-and-monetary-discretion": "Preseleccionado · Texto completo próximamente",
    "the-end-of-exit": "Enviado · Decisión pendiente",
    default: "Publicado",
  },
};

export function contentDisplayStatus(
  item: Pick<ContentItem, "slug" | "displayStatusEn" | "displayStatusEs">,
  locale: Locale = "en",
) {
  const fromCms = locale === "es"
    ? item.displayStatusEs ?? item.displayStatusEn
    : item.displayStatusEn;
  if (fromCms) return fromCms;
  const statuses = displayStatusBySlug[locale];
  return statuses[item.slug] ?? statuses.default;
}
