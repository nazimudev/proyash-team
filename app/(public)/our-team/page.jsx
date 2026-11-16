import TeamHero from "@/components/team/TeamHero";
import TeamDirectory from "@/components/team/TeamDirectory";
import TeamCTA from "@/components/team/TeamCTA";
import { mapOfficialMembers, mapAdvisors } from "@/data/teamMembers";
import { getPublicAdvisors, getPublicTeamMembers } from "@/services/teamApi";

export const metadata = {
  title: "Our Team | Proyash Songgothon",
  description:
    "Meet the official members and advisors of Proyash Songgothon and learn about the people contributing to our community-focused mission.",
};

export default async function TeamPage() {

  let members = [];

  try {
    const [memberData, advisorData] = await Promise.all([
      getPublicTeamMembers(),
      getPublicAdvisors(),
    ]);

    members = [
      ...mapOfficialMembers(memberData),
      ...mapAdvisors(advisorData),
    ];
  } catch (error) {
    console.error("Team API Error:", error);
  }

  return (
    <>
      <TeamHero />
      <TeamDirectory members={members} />
      <TeamCTA />
    </>
  );
}
