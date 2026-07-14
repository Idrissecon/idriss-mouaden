import { getPublishedContentBySlug } from "@/lib/content";
import { ogImageContentType, ogImageSize, publicationOgImage } from "@/lib/og-image";

export const alt = "Research by Idriss Mouaden";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPublishedContentBySlug("research", (await params).slug);
  return publicationOgImage(item, "research");
}
