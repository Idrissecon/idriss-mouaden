import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-kicker">Idriss Mouaden</p>
          <h2>Research, writing, and selected academic work.</h2>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/research">Research</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/about">About</Link>
          <Link href="/cv">CV</Link>
        </nav>
        <div className="footer-bottom">
          <p>© 2026 Idriss Mouaden</p>
          <Link href="/">Home ↑</Link>
        </div>
      </div>
    </footer>
  );
}
