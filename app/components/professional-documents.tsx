import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";
import { academicCvHref, professionalResumeHref } from "@/lib/profile";

export function ProfessionalDocuments({ locale }: { locale: Locale }) {
  const e = messages(locale).experiencePage;
  return (
    <section className="detail-content" aria-labelledby="professional-documents">
      <p className="detail-label">{e.documents}</p>
      <div>
        <h2 id="professional-documents">{e.documents}</h2>
        <div className="professional-documents">
          <div>
            <Link className="text-link" href={academicCvHref(locale)}>{e.academicCv}</Link>
            <p className="document-languages">
              <a href={academicCvHref("en")} lang="en" hrefLang="en">English</a>
              {" · "}
              <a href={academicCvHref("es")} lang="es" hrefLang="es">Español</a>
            </p>
          </div>
          <div>
            <Link className="text-link" href={professionalResumeHref(locale)}>{e.resume}</Link>
            <p className="document-languages">
              <a href={professionalResumeHref("en")} lang="en" hrefLang="en">English</a>
              {" · "}
              <a href={professionalResumeHref("es")} lang="es" hrefLang="es">Español</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
