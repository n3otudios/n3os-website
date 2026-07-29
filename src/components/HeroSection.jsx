import Reveal from "./Reveal.jsx";
import ToolDirectoryDemo from "./ToolDirectoryDemo.jsx";
import Scene from "../scenes/Scene.jsx";
import { SITE } from "../data/content.js";

const HERO_CAMERA = { position: [0, 0, 6], fov: 45 };

export default function HeroSection() {
  return (
    <section className="hero">
      <Scene name="hero" camera={HERO_CAMERA} className="hero__scene" />

      <div className="container-page hero__content">
        <Reveal>
          <span className="hero__badge">
            <span className="dot" />
            {SITE.studio} · Phase 1 live
          </span>
          <h1>The platform for tools that actually work.</h1>
          <p className="lede">
            Discover AI and productivity tools — curated, searchable, and completely free. No fluff, no affiliate
            links.
          </p>
          <div className="hero__actions">
            <a href={SITE.directoryUrl} className="btn btn--primary">
              Browse tools — it's free
            </a>
            <a href="#roadmap" className="btn btn--ghost">
              See the roadmap
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ToolDirectoryDemo />
        </Reveal>
        <p className="demo__note">A look at {SITE.directoryLabel}</p>

        <ul className="feature-strip">
          <li>No account required</li>
          <li>No credit card</li>
          <li>Curated by hand</li>
        </ul>
      </div>
    </section>
  );
}
