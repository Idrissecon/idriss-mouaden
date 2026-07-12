"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { messages, type Locale } from "@/lib/i18n";
import { cvHref } from "@/lib/profile";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const m = messages(locale);
  const navigation = [
    { href: "/research", label: m.nav.research },
    { href: "/writing", label: m.nav.writing },
    { href: "/about", label: m.nav.about },
    { href: cvHref, label: m.nav.cv },
  ];

  return (
    <header className="site-header shell">
      <Link className="wordmark" href="/" aria-label={m.nav.homeAria}>
        Idriss Mouaden
      </Link>
      <nav className="primary-nav" aria-label={m.nav.primaryAria}>
        {navigation.map((item) => (
          <Link
            aria-current={pathname === item.href ? "page" : undefined}
            className={pathname === item.href ? "is-current" : undefined}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
        <LanguageSwitcher label={m.nav.language} locale={locale} />
      </nav>
    </header>
  );
}
