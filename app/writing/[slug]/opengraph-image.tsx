import { getPublishedContentBySlug } from "@/lib/content";
import { ogImageContentType, ogImageSize, publicationOgImage } from "@/lib/og-image";

export const alt = "Writing by Idriss Mouaden";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPublishedContentBySlug("writing", (await params).slug);
  return publicationOgImage(item, "writing");
}
