import Layout from "../components/Layout.jsx";
import HeroSection from "../components/HeroSection.jsx";
import Marquee from "../components/Marquee.jsx";
import VisionSection from "../components/VisionSection.jsx";
import RoadmapSection from "../components/RoadmapSection.jsx";
import DetailSection from "../components/DetailSection.jsx";
import FaqSection from "../components/FaqSection.jsx";
import FreeBandSection from "../components/FreeBandSection.jsx";
import NotifyBandSection from "../components/NotifyBandSection.jsx";

export default function Home() {
  return (
    <Layout current="home">
      <HeroSection />
      <Marquee />
      <VisionSection />
      <RoadmapSection />
      <DetailSection />
      <FaqSection />
      <FreeBandSection />
      <NotifyBandSection formId="notify-email" />
    </Layout>
  );
}
