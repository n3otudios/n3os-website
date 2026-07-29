/**
 * Regenerates the five static HTML shells from one shared template.
 *
 * The <head> of these files was copy-pasted five times, so every fix had to be
 * applied five times and one page (404) had already drifted out of sync.
 * Keeping the shared parts in one place also guarantees the inline theme
 * script is byte-identical everywhere, which is what makes a hash-based CSP
 * viable later.
 *
 * Run with `npm run shells` after editing anything in the <head>.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://n3os.com";

// One string, so all five pages emit identical bytes.
const THEME_SCRIPT = `    (function () {
      var el = document.documentElement;
      el.classList.add("js");
      try {
        var stored = localStorage.getItem("n3os-theme");
        var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (stored === "dark" || (stored !== "light" && prefersDark)) {
          el.setAttribute("data-theme", "dark");
        }
      } catch (e) {}
    })();`;

const HOME_STRUCTURED_DATA = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "N3O Studios",
    "url": "https://n3os.com",
    "logo": "https://n3os.com/icon-512.png",
    "email": "support@n3os.com",
    "sameAs": ["https://tools.n3os.com"]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "n3os",
    "url": "https://n3os.com",
    "description": "n3os is a free AI tool hub — a curated, searchable directory of the best AI tools for 2026."
  }
  </script>
  <!--faq-jsonld-->`;

const PAGES = [
  {
    file: "index.html",
    entry: "home",
    urlPath: "/",
    title: "n3os — The platform for tools that actually work.",
    description:
      "n3os is a free AI tool hub — a curated, searchable directory of the best AI tools for 2026. No fluff, no affiliate links, no paywalls.",
    socialDescription:
      "n3os is a free AI tool hub — a curated, searchable directory of the best AI tools for 2026. No fluff, no affiliate links.",
    keywords:
      "free AI tools, AI tool directory, AI tool hub, best AI tools 2026, AI tools 2026, productivity tools, curated AI tools",
    extraHead: HOME_STRUCTURED_DATA,
  },
  {
    file: "about.html",
    entry: "about",
    urlPath: "/about.html",
    title: "About — n3os",
    description:
      "n3os is built by N3O Studios: a small team building a curated platform for discovering, using, and creating AI and productivity tools.",
    keywords: "AI tool hub, free AI tools, AI tool directory, N3O Studios, AI tools 2026",
  },
  {
    file: "contact.html",
    entry: "contact",
    urlPath: "/contact.html",
    title: "Contact — n3os",
    description:
      "Get in touch with N3O Studios — questions, feedback, or a tool you think belongs in the directory.",
    keywords: "contact n3os, N3O Studios, AI tool hub support",
  },
  {
    file: "subscriptions.html",
    entry: "pricing",
    urlPath: "/subscriptions.html",
    title: "Pricing — n3os",
    description: "n3os is completely free. No account required, no credit card, no catch.",
    keywords: "free AI tools, free AI tool hub, no credit card AI tools, AI tools 2026",
  },
  {
    file: "404.html",
    entry: "notfound",
    urlPath: "/404.html",
    title: "Page not found — n3os",
    description: "This page could not be found.",
    noindex: true,
  },
];

function render(page) {
  const url = ORIGIN + page.urlPath;
  const socialDescription = page.socialDescription ?? page.description;

  const social = page.noindex
    ? ""
    : `
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="n3os" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:title" content="${page.title}" />
  <meta property="og:description" content="${socialDescription}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${ORIGIN}/og-image.png" />
  <meta property="og:image:alt" content="n3os — the platform for tools that actually work." />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.title}" />
  <meta name="twitter:description" content="${socialDescription}" />
  <meta name="twitter:image" content="${ORIGIN}/og-image.png" />
`;

  const robots = page.noindex ? '  <meta name="robots" content="noindex, follow" />\n' : "";
  const keywords = page.keywords ? `  <meta name="keywords" content="${page.keywords}" />\n` : "";
  const extraHead = page.extraHead ? `\n${page.extraHead}` : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script>
${THEME_SCRIPT}
  </script>

  <!-- Browser chrome follows the active theme instead of always being brand blue. -->
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#2563eb" />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0f19" />

  <title>${page.title}</title>
  <meta name="description" content="${page.description}" />
${keywords}  <meta name="author" content="N3O Studios" />
${robots}  <link rel="canonical" href="${url}" />
${social}
  <!-- Both faces are used above the fold (body copy and the wordmark), so
       discovering them via the stylesheet costs a round trip of invisible text. -->
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin />

  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <link rel="stylesheet" href="/src/styles/main.css" />${extraHead}
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/entries/${page.entry}.jsx"></script>
</body>
</html>
`;
}

for (const page of PAGES) {
  await fs.writeFile(path.join(ROOT, page.file), render(page), "utf-8");
  console.log("wrote", page.file);
}
