import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { renderToString } from "react-dom/server";
import React from "react";
import fs from "node:fs/promises";

/**
 * Post-build step. `vite build` produces the client bundle plus empty
 * `<div id="root">` shells; this renders each page's React tree with
 * react-dom/server and writes the real markup into dist/*.html, so the content
 * is present before any JavaScript runs.
 *
 * It also emits FAQPage structured data and the sitemap from the same source
 * of truth as the pages themselves, rather than from hand-maintained copies
 * that drift.
 */
const SITE_ORIGIN = "https://n3os.com";
const ROOT_PLACEHOLDER = '<div id="root"></div>';
const FAQ_PLACEHOLDER = "<!--faq-jsonld-->";

const pages = [
  { html: "dist/index.html", module: "/src/pages/Home.jsx", name: "Home", path: "/", changefreq: "weekly", priority: "1.0" },
  { html: "dist/about.html", module: "/src/pages/About.jsx", name: "About", path: "/about.html", changefreq: "monthly", priority: "0.6" },
  { html: "dist/contact.html", module: "/src/pages/Contact.jsx", name: "Contact", path: "/contact.html", changefreq: "yearly", priority: "0.4" },
  { html: "dist/subscriptions.html", module: "/src/pages/Pricing.jsx", name: "Pricing", path: "/subscriptions.html", changefreq: "monthly", priority: "0.6" },
  // Deliberately has no `path`: a 404 page must never appear in the sitemap.
  { html: "dist/404.html", module: "/src/pages/NotFound.jsx", name: "NotFound" },
];

// `configFile: false` keeps this deterministic: the previous version loaded
// vite.config.js *and* passed the React plugin again, applying it twice.
const vite = await createServer({
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true },
  appType: "custom",
});

function escapeForScript(json) {
  // A literal "</script>" inside JSON-LD would close the tag early.
  return json.replace(/</g, "\\u003c");
}

async function buildFaqJsonLd() {
  const { FAQ_ITEMS } = await vite.ssrLoadModule("/src/data/content.js");
  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return `<script type="application/ld+json">\n${escapeForScript(JSON.stringify(payload, null, 2))}\n  </script>`;
}

async function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const entries = pages
    .filter((page) => page.path)
    .map(
      (page) => `  <url>
    <loc>${SITE_ORIGIN}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  await fs.writeFile("dist/sitemap.xml", xml);
  console.log("OK   sitemap.xml", `(lastmod ${lastmod})`);
}

let failures = 0;
const faqJsonLd = await buildFaqJsonLd();

for (const page of pages) {
  try {
    const mod = await vite.ssrLoadModule(page.module);
    const appHtml = renderToString(React.createElement(mod.default));
    let html = await fs.readFile(page.html, "utf-8");

    // Previously this used a plain string replace and reported success even
    // when the placeholder was missing — so a silently un-prerendered page
    // looked identical to a working one in the build log.
    if (!html.includes(ROOT_PLACEHOLDER)) {
      throw new Error(`root placeholder not found in ${page.html}`);
    }
    html = html.replace(ROOT_PLACEHOLDER, `<div id="root">${appHtml}</div>`);

    if (html.includes(FAQ_PLACEHOLDER)) {
      html = html.replace(FAQ_PLACEHOLDER, faqJsonLd);
    }

    await fs.writeFile(page.html, html);
    console.log("OK  ", page.name, `(${appHtml.length} chars)`);
  } catch (err) {
    console.error("FAIL", page.name, "-", err.message);
    failures++;
  }
}

try {
  await writeSitemap();
} catch (err) {
  console.error("FAIL sitemap -", err.message);
  failures++;
}

await vite.close();

console.log(`\n${pages.length - failures} of ${pages.length} pages prerendered.`);
process.exit(failures === 0 ? 0 : 1);
