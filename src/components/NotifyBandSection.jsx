import Reveal from "./Reveal.jsx";
import NotifyForm from "./NotifyForm.jsx";
import Scene from "../scenes/Scene.jsx";

const LINK_CAMERA = { position: [0, 0, 5], fov: 40 };

export default function NotifyBandSection({ formId = "notify-email", sectionId }) {
  return (
    <section className="notify-section section--tight perma-dark" id={sectionId}>
      <Scene name="notifyLink" camera={LINK_CAMERA} className="notify-scene notify-scene--left" />
      <Scene
        name="notifyLink"
        camera={LINK_CAMERA}
        sceneProps={{ mirror: true }}
        className="notify-scene notify-scene--right"
      />

      <Reveal className="notify-band">
        <h2>Want a heads-up when Phase 2 ships?</h2>
        <NotifyForm id={formId} />
      </Reveal>
    </section>
  );
}
