import Reveal from "./Reveal.jsx";
import Scene from "../scenes/Scene.jsx";
import { SITE } from "../data/content.js";

export default function FreeBandSection() {
  return (
    <section className="free-band border-t perma-dark">
      <Scene name="tesseract" sceneProps={{ seed: 1.2 }} className="scene-corner scene-corner--left" />
      <Scene
        name="tesseract"
        sceneProps={{ seed: 3.6, compact: true }}
        className="scene-corner scene-corner--right"
      />

      <div className="container-page section-body">
        <Reveal>
          <span className="eyebrow eyebrow--center">Completely free</span>
          <h2 className="h2">
            No paywalls. No sign-ups.
            <br />
            Just tools.
          </h2>
          <p className="lede mx-auto">
            Every tool in the directory is free to discover. No account, no credit card, no catch.
          </p>
          <a href={SITE.directoryUrl} className="btn btn--primary">
            Start browsing
          </a>
        </Reveal>
      </div>
    </section>
  );
}
