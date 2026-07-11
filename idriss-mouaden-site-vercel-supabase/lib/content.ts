import { createClient } from "@/lib/supabase/server";
import {
  toContentItem,
  type ContentItem,
  type ContentRow,
} from "@/lib/content-types";

export type PublicContentItem = ContentItem;

export async function listPublishedContent(
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
}

export async function getPublishedContentBySlug(
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
}

export function contentHref(item: Pick<ContentItem, "category" | "slug">) {
  return `/${item.category}/${item.slug}`;
}

export function contentMeta(item: ContentItem) {
  return [item.venue, item.year?.toString()].filter(Boolean).join(" · ");
}
