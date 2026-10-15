import React from "react";
import {
  aboutMeta,
  hero,
  organizationIntro,
  goals,
  vision,
  mission,
  draftBadgeLabel,
  coreValues,
  founder,
  founderMessage,
  commitments,
  cta,
} from "@/data/aboutProyash";
import AboutHero from "@/components/about/AboutHero";
import OrganizationIntro from "@/components/about/OrganizationIntro";
import GoalsSection from "@/components/about/GoalsSection";
import VisionMission from "@/components/about/VisionMission";
import CoreValues from "@/components/about/CoreValues";
import FounderProfile from "@/components/about/FounderProfile";
import FounderMessage from "@/components/about/FounderMessage";
import CommitmentSection from "@/components/about/CommitmentSection";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
};

const AboutPage = () => {
  return (
    <>
      <AboutHero content={hero} />
      <OrganizationIntro content={organizationIntro} />
      <GoalsSection content={goals} />
      <VisionMission vision={vision} mission={mission} draftLabel={draftBadgeLabel} />
      <CoreValues content={coreValues} />
      <FounderProfile content={founder} />
      <FounderMessage content={founderMessage} founder={founder} />
      <CommitmentSection content={commitments} />
      <AboutCTA content={cta} />
    </>
  );
};

export default AboutPage;
