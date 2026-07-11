import { notFound } from "next/navigation";
import { ContentDetail } from "@/app/components/content-detail";
import { getPublishedContentBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ResearchEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getPublishedContentBySlug("research", (await params).slug);
  if (!item) notFound();
  return <ContentDetail item={item} />;
}
