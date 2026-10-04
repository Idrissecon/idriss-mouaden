import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalDocuments } from "@/app/components/professional-documents";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const e = messages(await getLocale()).experiencePage;
  return pageMetadata(e.resume, e.resumeDescription, "/resume");
}

export default async function ResumePage() {
  const locale = await getLocale();
  const m = messages(locale);
  return (
    <main className="detail-page shell">
      <header className="detail-hero resume-hero">
        <Link className="back-link" href="/experience">← {m.nav.experience}</Link>
        <p className="work-meta">{m.experiencePage.documents}</p>
        <h1>{m.experiencePage.resume}</h1>
        <p>{m.experiencePage.resumeDescription}</p>
      </header>
      <ProfessionalDocuments locale={locale} />
    </main>
  );
}
