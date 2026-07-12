import Link from "next/link";
import { messages, type Locale } from "@/lib/i18n";
import { cvHref, profile } from "@/lib/profile";

export function SiteFooter({ locale }: { locale: Locale }) {
  const m = messages(locale);
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-kicker">Idriss Mouaden</p>
          <h2>{m.footer.heading}</h2>
        </div>
        <nav className="footer-links" aria-label={m.footer.aria}>
          <Link href="/research">{m.nav.research}</Link>
          <Link href="/writing">{m.nav.writing}</Link>
          <Link href="/about">{m.nav.about}</Link>
          <Link href={cvHref}>{m.nav.cv}</Link>
          <a href={profile.orcid} target="_blank" rel="me noreferrer">ORCID ↗</a>
          <a href={`mailto:${profile.contactEmail}`}>{m.footer.email}</a>
        </nav>
        <div className="footer-bottom">
          <p>© 2026 Idriss Mouaden</p>
          <Link href="/">{m.footer.home}</Link>
        </div>
      </div>
    </footer>
  );
}
