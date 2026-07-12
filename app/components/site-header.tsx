"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cvHref } from "@/lib/profile";

const navigation = [
  { href: "/research", label: "Research" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: cvHref, label: "CV" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header shell">
      <Link className="wordmark" href="/" aria-label="Idriss Mouaden, home">
        Idriss Mouaden
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
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
      </nav>
    </header>
  );
}
