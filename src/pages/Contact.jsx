import Layout from "../components/Layout.jsx";
import Reveal from "../components/Reveal.jsx";
import ContactForm from "../components/ContactForm.jsx";
import { Clock, Users } from "lucide-react";
import { SITE } from "../data/content.js";

export default function Contact() {
  return (
    <Layout current="contact">
      <section className="page-hero">
        <Reveal className="container-page">
          <span className="eyebrow eyebrow--center">Contact</span>
          <h1 className="h1">Get in touch.</h1>
          <p className="lede">Questions, feedback, or just want to say hi — we're listening.</p>
        </Reveal>
      </section>

      <section className="section section--tight border-t">
        <div className="container-page">
          <div className="contact-grid">
            <Reveal className="contact-info-card">
              <div className="contact-info-row">
                <Clock size={18} strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <h2>Response time</h2>
                  <p>Usually within {SITE.replyWindow}</p>
                </div>
              </div>
              <div className="contact-info-row">
                <Users size={18} strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <h2>Team</h2>
                  <p>Small, and reads everything</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
