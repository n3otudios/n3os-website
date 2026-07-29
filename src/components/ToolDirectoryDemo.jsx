import { SITE } from "../data/content.js";

/**
 * A real screenshot of the live directory, framed in browser chrome.
 *
 * This sits inside the hero, so on the homepage it is almost certainly the
 * Largest Contentful Paint element — it must not be lazy-loaded. It previously
 * carried `loading="lazy"`, which tells the browser to *delay* fetching the
 * one image that decides the page's LCP score.
 *
 * The WebP is pixel-identical to the PNG (lossless) and roughly half the
 * bytes; the PNG stays as the fallback for anything that can't decode WebP.
 */
export default function ToolDirectoryDemo() {
  return (
    <div className="demo">
      <div className="demo__bar">
        <span className="demo__dot demo__dot--r" />
        <span className="demo__dot demo__dot--y" />
        <span className="demo__dot demo__dot--g" />
        <span className="demo__url">{SITE.directoryLabel}</span>
      </div>
      <picture>
        <source srcSet="/directory-preview.webp" type="image/webp" />
        <img
          src="/directory-preview.png"
          alt="Screenshot of the tools.n3os.com directory, showing category filters and a grid of AI tool cards including Devin, Decktopus, Tome, Readwise Reader, Glasp, and Obviously AI"
          className="demo__screenshot"
          width="1486"
          height="478"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </div>
  );
}
