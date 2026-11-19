"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import TeamCategoryFilter from "@/components/team/TeamCategoryFilter";
import TeamSection from "@/components/team/TeamSection";
import { teamCategories } from "@/data/teamMembers";
import { getPublicTeamMembers } from "@/services/teamApi";

export default function TeamDirectory({ members, totalMembers = 0 }) {
  const [category, setCategory] = useState("all");


  const official = members.filter((m) => m.memberType === "official");

  console.log("DIRECTORY MEMBER:", official[0]);
  console.log("DIRECTORY NAME:", official[0]?.name);

  const advisors = members.filter((m) => m.memberType === "advisor");

  const counts = {
    all: totalMembers,
    official: members.filter((member) => member.memberType === "official")
      .length,
    advisor: members.filter((member) => member.memberType === "advisor").length,
  };

  const showOfficial = category === "all" || category === "official";

  const showAdvisors = category === "all" || category === "advisor";

  const visible =
    (showOfficial ? official.length : 0) + (showAdvisors ? advisors.length : 0);

  return (
    <section
      id="team-directory"
      aria-label="Team directory"
      className="scroll-mt-20 bg-mist py-16 sm:py-24"
    >
      <Container>
        <TeamCategoryFilter
          categories={teamCategories}
          counts={counts}
          value={category}
          onChange={setCategory}
        />

        <p className="sr-only" role="status" aria-live="polite">
          Showing {visible} {visible === 1 ? "profile" : "profiles"}.
        </p>

        <div key={category} className="rise mt-12 space-y-20 sm:space-y-24">
          {showOfficial && official.length > 0 && (
            <TeamSection
              id="official-members"
              title="Our Official Members"
              description="Meet the people actively contributing to the work and activities of Proyash Team."
              members={official}
            />
          )}

          {showAdvisors && advisors.length > 0 && (
            <TeamSection
              id="advisors"
              title="Our Advisors"
              description="Guided by experience, knowledge, and a shared commitment to community wellbeing."
              members={advisors}
              variant="advisor"
            />
          )}

          {visible === 0 && (
            <p className="py-16 text-center text-muted">
              No team members available at the moment.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
