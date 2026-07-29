import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";
import Scene from "../scenes/Scene.jsx";
import { SITE } from "../data/content.js";

const ACCENT_CAMERA = { position: [0, 0, 3.6], fov: 40 };

export default function DetailSection() {
  return (
    <section className="section section--tight border-t bg-surface">
      <div className="container-page">
        <SectionHead
          eyebrow="Every tool, fully indexed"
          title="Real descriptions. No dead links."
          lede="Every entry gets a proper detail page — what it does, who it's for, and a direct link to the tool itself. We write the summary ourselves, by hand, after actually trying it."
        />

        <div className="detail-scenes-row">
          <Scene name="detailGlyph" camera={ACCENT_CAMERA} className="detail-scene" />
          <Scene name="detailCheck" camera={ACCENT_CAMERA} className="detail-scene" />
        </div>

        <Reveal className="detail-card" delay={0.1}>
          <span className="detail-card__url">{SITE.directoryLabel}/polymer</span>
          <picture>
            <source srcSet="/polymer-detail-preview.webp" type="image/webp" />
            <img
              src="/polymer-detail-preview.png"
              alt="Screenshot of the Polymer tool detail card on tools.n3os.com, showing its icon, category tags (AI, Data, Analytics, Visualization), a real description, and a Visit tool link"
              className="detail-card__screenshot"
              width="473"
              height="229"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>
      </div>
    </section>
  );
}
