import FuturePriorities from "@/components/impact/FuturePriorities";
import ImpactCTA from "@/components/impact/ImpactCTA";
import ImpactFocusAreas from "@/components/impact/ImpactFocusAreas";
import ImpactGallery from "@/components/impact/ImpactGallery";
import ImpactHero from "@/components/impact/ImpactHero";
import ImpactStatistics from "@/components/impact/ImpactStatistics";
import ImpactStories from "@/components/impact/ImpactStories";
import ImpactTimeline from "@/components/impact/ImpactTimeline";
import ReportingInformation from "@/components/impact/ReportingInformation";
import TransparencySection from "@/components/impact/TransparencySection";
import { getImpactData } from "@/lib/impact";

export const metadata = {
  title: "Our Impact | Proyash Songgothon",
  description:
    "Explore Proyash Songgothon's documented community initiatives, verified achievements, educational support, and environmental activities.",
};

const ImpactPage = () => {
  const data = getImpactData();

  return (
    <>
      <ImpactHero />
      <ImpactStatistics
        statistics={data.statistics}
        pendingStatistics={data.pendingStatistics}
      />
      <ImpactFocusAreas focusAreas={data.focusAreas} />
      <ImpactTimeline timeline={data.timeline} />
      <ImpactStories stories={data.stories} />
      <ImpactGallery gallery={data.gallery} />
      <TransparencySection reports={data.reporting.reports} />
      <ReportingInformation reporting={data.reporting} />
      <FuturePriorities priorities={data.priorities} />
      <ImpactCTA />
    </>
  );
};

export default ImpactPage;
