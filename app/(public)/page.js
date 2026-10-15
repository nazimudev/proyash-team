import HeroSection from "@/components/home/HeroSection";
import IntroductionSection from "@/components/home/IntroductionSection";
import InitiativesSection from "@/components/home/InitiativesSection";
import FeaturedProjectsSection from "@/components/home/FeaturedProjectsSection";
import ImpactSection from "@/components/home/ImpactSection";
import GallerySection from "@/components/home/GallerySection";
import VolunteerCTA from "@/components/home/VolunteerCTA";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroductionSection />
      <InitiativesSection />
      <FeaturedProjectsSection />
      <ImpactSection />
      <GallerySection />
      <VolunteerCTA />
      <ContactSection />
    </>
  );
}
