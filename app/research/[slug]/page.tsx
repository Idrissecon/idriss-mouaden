import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetail } from "@/app/components/content-detail";
import { JsonLd } from "@/app/components/json-ld";
import { getPublishedContentBySlug } from "@/lib/content";
import { contentMetadata, contentStructuredData } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getPublishedContentBySlug("research", (await params).slug);
  return item ? contentMetadata(item) : {};
}

export default async function ResearchEntryPage({ params }: PageProps) {
  const item = await getPublishedContentBySlug("research", (await params).slug);
  if (!item) notFound();
  return (
    <>
      <JsonLd data={contentStructuredData(item)} />
      <ContentDetail item={item} />
    </>
  );
}
