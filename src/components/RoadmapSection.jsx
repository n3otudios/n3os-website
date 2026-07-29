import Reveal from "./Reveal.jsx";
import SectionHead from "./SectionHead.jsx";
import Scene from "../scenes/Scene.jsx";
import { Search, Zap, Wrench } from "lucide-react";

const ROADMAP_CAMERA = { position: [0, 0, 6], fov: 35 };

const PHASES = [
  {
    num: "01",
    icon: Search,
    title: "Discover",
    status: "Live now",
    statusClass: "status-pill--live",
    barClass: "roadmap-card--live",
    text: "Browse a curated, searchable directory of AI and productivity tools. No fluff, no affiliate links — just what works.",
  },
  {
    num: "02",
    icon: Zap,
    title: "Use",
    status: "In progress",
    statusClass: "status-pill--progress",
    barClass: "roadmap-card--progress",
    text: "Try tools here on n3os — right in your browser. No installs, no setup, just open a tool and use it.",
  },
  {
    num: "03",
    icon: Wrench,
    title: "Build",
    status: "Planned",
    statusClass: "status-pill--planned",
    barClass: "roadmap-card--planned",
    text: "Create your own lightweight web tools and publish them to n3os. Your tools, your audience.",
  },
];

export default function RoadmapSection() {
  return (
    <section className="section section--tight border-t bg-surface has-scene has-scene--clip" id="roadmap">
      {/* This wrapper had no matching CSS rule, so the canvas inside collapsed
          to zero height and the three cubes never appeared on the page. */}
      <Scene name="roadmap" camera={ROADMAP_CAMERA} className="roadmap-scene" />

      <div className="container-page section-body">
        <SectionHead
          eyebrow="The roadmap"
          title="Built to grow with you."
          lede="Three phases, shipped in order. Phase 1 is live today — phases 2 and 3 are already in motion."
        />

        {/* An ordered list, because the numbering is load-bearing: these ship
            in sequence, and the phase number is referenced in the copy. */}
        <ol className="roadmap-grid">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <Reveal as="li" className={`roadmap-card ${phase.barClass}`} key={phase.num} delay={i * 0.06}>
                <span className="roadmap-card__num" aria-hidden="true">
                  {phase.num}
                </span>
                <div className="roadmap-card__icon">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="roadmap-card__head">
                  <h3>{phase.title}</h3>
                  <span className={`status-pill ${phase.statusClass}`}>{phase.status}</span>
                </div>
                <p>{phase.text}</p>
                <div className="roadmap-card__bar" aria-hidden="true">
                  <span />
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
