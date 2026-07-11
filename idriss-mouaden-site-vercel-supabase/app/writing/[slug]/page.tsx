import { notFound } from "next/navigation";
import { ContentDetail } from "@/app/components/content-detail";
import { getPublishedContentBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function WritingEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPublishedContentBySlug("writing", (await params).slug);
  if (!item) notFound();
  return <ContentDetail item={item} />;
}
