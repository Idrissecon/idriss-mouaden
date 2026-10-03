import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";
import { cvHref } from "@/lib/profile";

export function ProfessionalDocuments({ locale }: { locale: Locale }) {
  const e = messages(locale).experiencePage;
  return (
    <section className="detail-content" aria-labelledby="professional-documents">
      <p className="detail-label">{e.documents}</p>
      <div>
        <h2 id="professional-documents">{e.documents}</h2>
        <div className="professional-documents">
          <Link className="text-link" href={cvHref}>{e.academicCv} ↗</Link>
          <p>{e.resume} — {e.resumeStatus}</p>
        </div>
      </div>
    </section>
  );
}
