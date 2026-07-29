import Nav from "./Nav.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ current, children }) {
  return (
    <>
      {/* First tab stop on every page: lets keyboard and screen-reader users
          jump the header instead of walking the nav on each navigation. */}
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Nav current={current} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
