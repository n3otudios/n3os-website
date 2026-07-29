import Layout from "../components/Layout.jsx";
import Reveal from "../components/Reveal.jsx";
import { SITE } from "../data/content.js";

export default function About() {
  return (
    <Layout current="about">
      <section className="page-hero">
        <Reveal className="container-page">
          <span className="eyebrow eyebrow--center">About</span>
          <h1 className="h1">
            We're {SITE.studio}.
            <br />
            Building the platform for tools that actually work.
          </h1>
        </Reveal>
      </section>

      <section className="section section--tight border-t">
        <div className="container-page about-story">
          <Reveal>
            <h2 className="h3">Our story</h2>
            <p>
              n3os started with a simple frustration: too many tools, too little signal. Every week brings another
              AI tool, another productivity app, another thing you're supposed to try. Most of them aren't worth
              your time.
            </p>
            <p>
              So we built a curated directory. No affiliate links, no sponsored placements — just tools we'd
              actually open tomorrow morning. That's Phase 1.
            </p>
            <p>
              Phase 2 takes it further: try tools here on n3os, right in your browser. No installs, no setup, no
              switching between a dozen apps. Just open and use.
            </p>
            <p>
              Phase 3 is for builders: create your own lightweight web tools and publish them to the n3os platform.
              Your tools, your audience, your rules.
            </p>
            <p>
              We're a small studio. We move fast, we ship things that work, and we don't add features for the sake
              of adding features.
            </p>
          </Reveal>

          <Reveal className="about-cta" delay={0.1}>
            <a href={SITE.directoryUrl} className="btn btn--primary">
              See the tools
            </a>
            <a href="contact.html" className="btn btn--ghost">
              Get in touch
            </a>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
