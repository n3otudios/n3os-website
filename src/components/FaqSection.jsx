import Reveal from "./Reveal.jsx";
import FaqAccordion from "./FaqAccordion.jsx";
import Scene from "../scenes/Scene.jsx";

const ORB_CAMERA = { position: [0, 0, 5.2], fov: 40 };

export default function FaqSection() {
  return (
    <section className="section border-t">
      <div className="container-page">
        <div className="faq-grid">
          <Reveal className="faq-intro">
            <span className="eyebrow">Questions</span>
            <h2 className="h2">Good to know.</h2>
            <p className="lede">The short version of everything people usually ask us.</p>
            <Scene name="faqOrb" camera={ORB_CAMERA} className="faq-bulb-stage" />
          </Reveal>

          <Reveal delay={0.1}>
            <FaqAccordion />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
