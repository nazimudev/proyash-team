import TeamHero from "@/components/team/TeamHero";
import TeamDirectory from "@/components/team/TeamDirectory";
import TeamCTA from "@/components/team/TeamCTA";
import { getTeamProfiles } from "@/data/teamMembers";

export const metadata = {
  title: "Our Team | Proyash Songgothon",
  description:
    "Meet the official members and advisors of Proyash Songgothon and learn about the people contributing to our community-focused mission.",
};

export default function TeamPage() {
  const { members, usingSamples } = getTeamProfiles();

  return (
    <>
      <TeamHero />
      <TeamDirectory members={members} usingSamples={usingSamples} />
      <TeamCTA />
    </>
  );
}
