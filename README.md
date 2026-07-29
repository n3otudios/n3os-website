# n3os.com

Marketing site for N3O Studios' AI tool directory (n3os.com — the directory itself lives at tools.n3os.com).

## What this is

**React + Vite + react-three-fiber + Framer Motion**, compiled to plain static HTML/CSS/JS in `dist/`. There is no Node server at runtime. Every page is **prerendered** at build time, so the content is real and crawlable before any JavaScript runs.

The visual identity — floating WebGL polyhedra, the orb in the vision section, the three bobbing roadmap cubes, the torus-knot pair by the notify form, the frosted blob on pricing — is unchanged. This revision is about correctness, performance and accessibility underneath it.

## Structure

```
├── index.html / about.html / contact.html / subscriptions.html / 404.html
│                          Generated shells — meta tags + <div id="root">.
│                          Edit scripts/build-html-shells.mjs, not these files.
├── src/
│   ├── entries/           One hydrateRoot() entry per page
│   ├── pages/             Home, About, Contact, Pricing, NotFound
│   ├── components/        Nav, Footer, Reveal, SectionHead, Marquee,
│   │                      FaqAccordion, ToolDirectoryDemo, RoadmapSection,
│   │                      PricingCards, NotifyForm, ContactForm, …
│   ├── scenes/            Scene.jsx        — the only 3D entry point
│   │                      SceneStage.jsx   — lazily loaded canvas + registry
│   │                      SceneBoundary.jsx— error boundary
│   │                      textures.js      — shared canvas textures + disposal
│   │                      …plus one file per visual
│   ├── hooks/             useNearViewport
│   ├── lib/forms.js       Form submission + honest no-backend fallbacks
│   ├── data/content.js    SITE constants, FAQ copy, marquee, nav links
│   └── styles/main.css    Design tokens, light/dark theme, all component CSS
├── public/                Fonts, favicons, screenshots (PNG + WebP), robots,
│                          sitemap, .htaccess
├── scripts/
│   ├── build-html-shells.mjs  Regenerates the five HTML shells
│   └── prerender.mjs          Post-build: SSR into dist/, FAQ JSON-LD, sitemap
└── .github/workflows/deploy.yml
```

## Local development

```bash
npm install
npm run dev                # http://localhost:5173, hot reload
npm run build              # vite build → dist/, then prerenders all 5 pages
npm run build:client-only  # skip prerendering (faster iteration)
npm run preview            # serve the dist/ build locally
npm run shells             # regenerate the five HTML shells after a <head> edit
```

Node 22 (see `.nvmrc`).

## What changed in 2.2.0

- **Forms are wired to a live Formspree endpoint.** Both `VITE_NOTIFY_ENDPOINT` and `VITE_CONTACT_ENDPOINT` point at the same Formspree form (one form ID, free-tier limit). Each submission includes a `_subject` field — Formspree's convention for setting the notification email's subject line — so a contact message and a notify signup are distinguishable at a glance in the shared `support@n3os.com` inbox, even though they're one form on Formspree's side.
- **A real `.env` is included in this zip**, not just `.env.example`, so the build works immediately without extra setup. `.env` stays in `.gitignore` — if this goes into version control, set the same two variables as CI secrets/variables instead of committing the file.
- Before deploying: confirm `support@n3os.com` has clicked Formspree's one-time confirmation email, or submissions won't deliver. If you outgrow the free tier's single-form limit, split `VITE_NOTIFY_ENDPOINT` and `VITE_CONTACT_ENDPOINT` into two separate Formspree form IDs — no other code change needed.

## What changed in 2.1.0

### Bugs

- **The roadmap cubes never rendered.** `RoadmapSection` passed `className="roadmap-scene"`, but no `.roadmap-scene` rule existed. The canvas inherited no height, collapsed to zero, and the three phase cubes were invisible on every viewport. The rule now exists.
- **The deploy workflow read the wrong secret.** It used `secrets.FTP_HOST` while this README told you to set `FTP_SERVER`. A correctly-configured repo would still deploy to an empty host. Both now agree on `FTP_SERVER`, and a preflight step fails with a readable message when a secret is missing.
- **The hero screenshot was lazy-loaded.** It sits above the fold and is almost certainly the homepage's Largest Contentful Paint element; `loading="lazy"` told the browser to *defer* fetching the one image LCP is measured on. It's now `eager` with `fetchpriority="high"`.
- **In-page anchors landed under the sticky header.** `#roadmap` and `#notify` scrolled the target heading behind the nav bar. Added `scroll-padding-top`.
- **The latin-ext fonts were dead weight.** The latin face carried no `unicode-range`, so it claimed every codepoint and the `-ext` files were never requested — accented characters silently fell back to a system font. Both faces now have explicit ranges.
- **Prerendering could fail silently.** The script string-replaced `<div id="root"></div>` and logged `OK` whether or not the placeholder was found. It now throws, and CI asserts on the built output.
- **drei's `<Text>` was fetching a font from Google's CDN.** With no `font` prop, troika-three-text downloads a default typeface at runtime — a third-party request on an otherwise fully self-hosted site, which also breaks offline and under a strict CSP. That glyph is now drawn to a canvas texture.

### Performance

- **Three.js is out of the initial bundle.** All WebGL now sits behind one dynamic import in `src/scenes/Scene.jsx`, so the ~220KB gzipped chunk is fetched only when a scene actually approaches the viewport — and never at all on About, Contact, 404, or on screens where the decorative scenes are `display: none`. This was flagged as the obvious next optimisation in the previous README; it's done.
- **Off-screen scenes stop rendering.** Canvases now switch to `frameloop="never"` when scrolled away or when the tab is hidden, and release their WebGL context entirely after 10 seconds away. The homepage declares ten canvases; browsers cap concurrent WebGL contexts (Safari lowest), and previously every one of them stayed live and animating for the rest of the session.
- **Screenshots ship as lossless WebP** with PNG fallbacks via `<picture>`: 66KB → 35KB and 22KB → 12KB, pixel-identical.
- **Fonts are preloaded** rather than discovered late via the stylesheet.
- Canvas textures and hand-built geometries are now disposed on unmount, which matters now that scenes unmount.
- `.htaccess` serves correct MIME types for `.woff2`/`.webp` (previously `application/octet-stream`, which bypassed the compression and caching rules), marks fingerprinted assets `immutable`, and stops HTML being cached.

### Accessibility

- Skip link to `#main` on every page.
- **The mobile menu was a keyboard trap in the wrong direction**: no Escape, no focus containment, no focus return, no scroll lock, and clicking outside did nothing. All five fixed, plus `role="dialog"`, `aria-modal` and `aria-controls`.
- **Collapsed FAQ answers were still tabbable and still read aloud** — invisible but present. They stay in the DOM (that's deliberate, for crawlers and no-JS visitors) but are now `inert` when closed, with proper `aria-controls`/`aria-expanded` pairing and heading-wrapped triggers.
- **Contrast**: every text/background pairing now clears WCAG AA in both themes. Fixed: the fake URL bar and detail-card URL (2.6:1 on white), the "Planned" status pill (3.9:1), the 404 numeral (1.5:1 — effectively invisible), the notify placeholder (4.3:1), and brand-blue small text on dark surfaces (4.2:1, now a lighter tint via `--color-brand-text`).
- **`prefers-reduced-motion` now covers the CSS-driven motion too** — the marquee, the pulsing progress meter, hover lifts and smooth scrolling. Framer Motion already handled the reveals; nothing handled these.
- Dark mode follows the operating system by default, with an explicit toggle that overrides and persists. The toggle also reports state via `aria-pressed`, and both icons live in the DOM so the right one paints immediately instead of flipping after hydration.
- Heading order is valid on every page; decorative icons and numerals are `aria-hidden`; the roadmap is an ordered list, because the numbering is load-bearing.

### Honesty

- **The forms no longer lie.** Both used to wait 500ms and then say "You're on the list" having sent the address nowhere. Now: if `VITE_NOTIFY_ENDPOINT` / `VITE_CONTACT_ENDPOINT` is set, they really post and report real success and real failure. If not, the notify form points at the support address and the contact form opens the visitor's mail client with the message pre-filled. See `.env.example`.
- "Live snapshot of tools.n3os.com" under a static screenshot is now "A look at tools.n3os.com".

### Structure

- `SITE` constants in `src/data/content.js` — the directory URL and support address were typed by hand in eight components.
- The five HTML shells are generated from one template (`npm run shells`); their `<head>` was five copies that had already drifted.
- FAQ structured data (`FAQPage` JSON-LD) and `sitemap.xml` are generated at build time from the same source as the pages, so they can't go stale.
- Per-section inline `style={{ marginTop: "1rem" }}` props replaced by a `SectionHead` component and real CSS.
- Fluid `clamp()` type scale — the old scale jumped 36px → 48px at exactly 768px, leaving tablet widths visibly under-set.
- A `SceneBoundary` error boundary: if WebGL is unavailable or the scene chunk fails to download, the decoration is missing instead of the page being blank.
- `.htaccess` gains security headers (CSP, `X-Frame-Options`, `Permissions-Policy`) and clean-URL rewrites, so `/about` and `/pricing` work alongside the existing `.html` URLs without breaking any link.

## Forms

Already configured, in this zip's `.env`:

```
VITE_NOTIFY_ENDPOINT=https://formspree.io/f/mbdnbgjo
VITE_CONTACT_ENDPOINT=https://formspree.io/f/mbdnbgjo
```

Both forms currently share one Formspree form — the free tier allows one form, and each request adds a `_subject` field so the two stay distinguishable in the shared `support@n3os.com` inbox (see `src/lib/forms.js`, `ContactForm.jsx`, `NotifyForm.jsx`). Before relying on this in production, confirm `support@n3os.com` has clicked Formspree's one-time confirmation link — submissions silently don't deliver until that's done.

To move to two independent forms later (e.g. after upgrading past the free tier, or switching one form to a different backend like a direct Supabase PostgREST `POST`), just point `VITE_NOTIFY_ENDPOINT` and `VITE_CONTACT_ENDPOINT` at different URLs — no code change needed beyond that.

Anything prefixed `VITE_` is inlined into the client bundle and is therefore **public**. That's fine for a Formspree form ID (it's designed to be a public form action URL); if you ever add an endpoint that takes a key, only ever put a publishable/anon key here, never a service key.

## Deployment

`deploy.yml` builds on every push to `main` and every PR, and deploys `dist/` over FTP on `main` only. Required repository secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Optional: `FTP_SERVER_DIR` if your document root isn't the account root.

## Known limitations

- **This revision has not been built.** It was written without network access, so `npm install` and `npm run build` could not be run. Every source file was syntax-checked and cross-checked (scene registry against usage, CSS classes against markup, imports against the filesystem, contrast ratios computed numerically), but a real `npm run build` is the first thing to do — see "First run" below.
- The CSP ships with `script-src 'unsafe-inline'` because of the theme bootstrap in `<head>`. The hash needed to tighten it is pre-computed in `.htaccess`; verify it against the built `dist/index.html` before switching, since a wrong hash blocks the script and reintroduces a theme flash.
- No `manualChunks` config. Rollup's automatic splitting already isolates the Three.js chunk correctly via the dynamic import, and hand-written chunking is an easy way to accidentally make an async chunk eager again.
- Scenes still render for visitors who prefer reduced motion — that was an explicit product decision and it hasn't been reversed. If you want to change it, `Scene.jsx` is the single place to do it.

## First run

```bash
npm install
npm run build
npm run preview
```

Then check, in order: the roadmap cubes appear at ≥1240px wide (they never did before); the Network tab shows no Three.js chunk on `/about.html`; and toggling dark mode doesn't flash.
