import { SITE, NAV_LINKS } from "../data/content.js";

export default function Footer() {
  // Derived rather than hard-coded, so the notice can't quietly go stale.
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer perma-dark">
      <div className="container-page">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">
              <img src="/footer-logo.png" alt="" width="24" height="28" className="logo__mark logo__mark--footer" />
              <span>
                {SITE.name}
                <span className="logo__sub">by {SITE.studio}</span>
              </span>
            </a>
            <p>
              A curated index of AI and productivity tools. No fluff, no affiliate links — built by a small studio
              that uses what it ships.
            </p>
            <p className="directory-note">Directory live at {SITE.directoryLabel}</p>
          </div>

          <div className="footer-col">
            <h4>Site</h4>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <a href={SITE.directoryUrl}>
                  Browse directory <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} {SITE.studio}. All rights reserved.</span>
          <span>Built for people who'd rather use tools than read about them.</span>
        </div>
      </div>
    </footer>
  );
}
