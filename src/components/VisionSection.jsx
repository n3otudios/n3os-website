import Reveal from "./Reveal.jsx";
import Scene from "../scenes/Scene.jsx";

const VISION_CAMERA = { position: [0, 0, 5], fov: 42 };

/** Matches the original: one large centered orb graphic with the copy
 * overlaid directly on top of it, not a side-by-side split. */
export default function VisionSection() {
  return (
    <section className="section border-t vision perma-dark">
      <div className="container-page vision__stage">
        <Scene name="vision" camera={VISION_CAMERA} className="vision__scene" />

        <Reveal className="vision__copy">
          <span className="eyebrow eyebrow--center">The vision</span>
          <h2 className="h2">Every tool, one connected index.</h2>
          <p className="lede mx-auto">
            n3os started as a directory. It's becoming the place tools actually live — discovered, used, and
            eventually built, all in one connected system instead of a dozen disconnected tabs.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
