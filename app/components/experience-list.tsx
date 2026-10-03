import { messages, type Locale } from "@/lib/i18n";
import { profile } from "@/lib/profile";

export function ExperienceList({ locale, detailed = false }: { locale: Locale; detailed?: boolean }) {
  const m = messages(locale);
  const e = m.experiencePage;
  const Heading = detailed ? "h2" : "h3";
  const roles = [
    {
      date: e.investmentDate,
      title: `${m.profile.experienceRole} — ${profile.experience.organisation}`,
      context: e.investmentContext,
      summary: m.profile.experienceDescription,
      responsibilities: e.investmentResponsibilities,
    },
    {
      date: e.retailDate,
      title: e.retailRole,
      context: e.retailContext,
      summary: e.retailDescription,
      responsibilities: e.retailResponsibilities,
    },
  ];
  return (
    <div className="timeline experience-list">
      {roles.map((role) => (
        <article className="timeline-item" key={role.title}>
          <p className="timeline-date">{role.date}</p>
          <div>
            <Heading>{role.title}</Heading>
            {detailed ? (
              <>
                <p className="experience-context">{role.context}</p>
                <ul className="experience-responsibilities">
                  {role.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}
                </ul>
              </>
            ) : <p>{role.summary}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
