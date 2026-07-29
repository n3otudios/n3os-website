import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle.jsx";
import { NAV_LINKS, SITE } from "../data/content.js";

const MENU_ID = "mobile-menu";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Nav({ current }) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);
  const hasOpened = useRef(false);

  // Escape to dismiss, and Tab kept inside the sheet while it's up. An open
  // overlay that lets focus wander behind it is a keyboard dead end.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll(FOCUSABLE);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Stop the page scrolling underneath the open sheet.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the sheet on open, and hand it back to the button on close.
  useEffect(() => {
    if (open) {
      hasOpened.current = true;
      closeRef.current?.focus();
    } else if (hasOpened.current) {
      burgerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="container-page">
          <nav className="nav" aria-label="Primary">
            <a href="/" className="logo">
              <img src="/favicon.svg" alt="" width="30" height="30" className="logo__mark" />
              <span>
                {SITE.name}
                <span className="logo__sub">by {SITE.studio}</span>
              </span>
            </a>

            <div className="nav__links">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav__link"
                  aria-current={current === link.label.toLowerCase() ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="nav__actions">
              <ThemeToggle />
              <a href={SITE.directoryUrl} className="btn btn--primary btn--sm">
                Browse tools
              </a>
              <button
                ref={burgerRef}
                className="nav__burger"
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls={MENU_ID}
                onClick={() => setOpen((value) => !value)}
              >
                <Menu size={20} aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="mobile-menu__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={menuRef}
              id={MENU_ID}
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mobile-menu__top">
                <button
                  ref={closeRef}
                  className="mobile-menu__close"
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <nav className="mobile-menu__links" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </nav>

              <a href={SITE.directoryUrl} className="btn btn--primary btn--block mobile-menu__cta">
                Browse tools
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
