import type { Metadata } from "next";
import Link from "next/link";
import { ExperienceList } from "@/app/components/experience-list";
import { ProfessionalDocuments } from "@/app/components/professional-documents";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const e = messages(await getLocale()).experiencePage;
  return pageMetadata(e.title, e.description, "/experience");
}

export default async function ExperiencePage() {
  const locale = await getLocale();
  const m = messages(locale);
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <Link className="back-link" href="/#experience">← {m.common.home}</Link>
        <p className="work-meta">{m.nav.experience}</p>
        <h1>{m.experiencePage.title}</h1>
        <p>{m.experiencePage.intro}</p>
      </header>
      <section className="professional-experience" aria-label={m.experiencePage.title}>
        <ExperienceList locale={locale} detailed />
        <Link className="text-link section-link" href="/research">{m.experiencePage.reports}</Link>
      </section>
      <ProfessionalDocuments locale={locale} />
    </main>
  );
}
