import Layout from "../components/Layout.jsx";
import Reveal from "../components/Reveal.jsx";
import PricingCards from "../components/PricingCards.jsx";
import NotifyBandSection from "../components/NotifyBandSection.jsx";

export default function Pricing() {
  return (
    <Layout current="pricing">
      <section className="page-hero page-hero--free">
        <Reveal className="container-page">
          <span className="eyebrow eyebrow--center">Pricing</span>
          {/* "Completely free" styled in the primary brand blue, per brief */}
          <h1 className="h1">Completely. Free.</h1>
          <p className="lede">No account. No credit card. No catch. Just tools.</p>
        </Reveal>
      </section>

      <PricingCards />

      <NotifyBandSection formId="notify-email-2" sectionId="notify" />
    </Layout>
  );
}
