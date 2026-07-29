import { Check, Lock } from "lucide-react";
import Reveal from "./Reveal.jsx";
import Scene from "../scenes/Scene.jsx";
import { SITE } from "../data/content.js";

const UNLOCK_CAMERA = { position: [0, 0, 4], fov: 38 };

const FREE_FEATURES = [
  "Browse the full tool directory",
  "Search and filter by category",
  "Full tool detail pages",
  "No account required",
  "No credit card, ever",
];

const LOCKED_FEATURES = [
  "Host and run tools in-browser",
  "Build & publish your own tools",
  "Priority directory placement",
];

export default function PricingCards() {
  return (
    <section className="section section--tight border-t has-scene">
      <Scene name="unlock" camera={UNLOCK_CAMERA} className="pricing-scene" />

      <div className="container-page section-body">
        <div className="pricing-grid">
          <Reveal className="price-card price-card--primary">
            <span className="price-card__badge">Available now</span>
            <h2>Directory</h2>
            <p className="price-card__amount">
              <strong>$0</strong>
              <span>forever</span>
            </p>
            <ul>
              {FREE_FEATURES.map((feature) => (
                <li key={feature}>
                  <Check size={15} aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>
            <a href={SITE.directoryUrl} className="btn btn--primary btn--block">
              Start browsing
            </a>
          </Reveal>

          <Reveal className="price-card" delay={0.08}>
            <span className="price-card__badge price-card__badge--muted">Coming later</span>
            <h2>Phases 2 &amp; 3</h2>
            <p className="price-card__amount">
              <strong>?</strong>
              <span>pricing not set</span>
            </p>
            <ul>
              {LOCKED_FEATURES.map((feature) => (
                <li className="is-locked" key={feature}>
                  <Lock size={15} aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>
            <a href="#notify" className="btn btn--ghost btn--block">
              Notify me
            </a>
          </Reveal>
        </div>

        <p className="pricing-note">
          We'll announce Phase 2 and 3 pricing well before launch — nothing changes for the free directory you use
          today.
        </p>
      </div>
    </section>
  );
}
