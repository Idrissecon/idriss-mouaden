import Link from "next/link";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function NotFound() {
  const m = messages(await getLocale());
  return (
    <main className="detail-page shell">
      <header className="detail-hero">
        <p className="work-meta">404</p>
        <h1>{m.notFound.title}</h1>
        <p>{m.notFound.description}</p>
        <Link className="text-link accent-link" href="/">
          {m.notFound.backHome} <span aria-hidden="true">→</span>
        </Link>
      </header>
    </main>
  );
}
