import Layout from "../components/Layout.jsx";
import Reveal from "../components/Reveal.jsx";
import { NAV_LINKS } from "../data/content.js";

export default function NotFound() {
  return (
    <Layout>
      <section className="error-page">
        <Reveal className="container-page">
          <span className="code" aria-hidden="true">404</span>
          <h1 className="h1">This page could not be found.</h1>
          <p className="lede">
            The link may be out of date, or the page may have moved. Here's where everything lives:
          </p>
          <nav className="error-page__links" aria-label="Site sections">
            <a href="/">Home</a>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a href="/" className="btn btn--primary">
            Back to home
          </a>
        </Reveal>
      </section>
    </Layout>
  );
}
