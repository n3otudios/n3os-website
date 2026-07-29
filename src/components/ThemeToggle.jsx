import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "n3os-theme";

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Both icons are always in the DOM; CSS picks which one shows based on the
 * `data-theme` attribute that the blocking <head> script sets before first
 * paint. That means the correct icon is painted immediately, with no
 * post-hydration swap, and no state that could disagree with the server.
 *
 * Only the accessible state (`aria-pressed`) needs React, and it settles on
 * mount — matching the server's initial value first so hydration stays clean.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  // With no explicit choice stored, follow the operating system if it changes
  // mid-session (e.g. a scheduled switch to dark at sunset).
  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      if (readStoredTheme()) return;
      applyTheme(event.matches ? "dark" : "light");
      setIsDark(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function toggle() {
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    setIsDark(!isDark);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Private mode or storage disabled — the theme just won't persist. */
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={isDark}
      title="Toggle dark mode"
    >
      <Moon className="icon-moon" size={18} aria-hidden="true" />
      <Sun className="icon-sun" size={18} aria-hidden="true" />
    </button>
  );
}
