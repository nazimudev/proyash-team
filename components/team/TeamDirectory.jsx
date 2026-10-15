"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import TeamCategoryFilter from "@/components/team/TeamCategoryFilter";
import TeamSection from "@/components/team/TeamSection";
import { teamCategories } from "@/data/teamMembers";

/** The only interactive part of the page: category filter + the two profile sections. */
export default function TeamDirectory({ members, usingSamples }) {
  const [category, setCategory] = useState("all");

  const official = members.filter((m) => m.memberType === "official");
  const advisors = members.filter((m) => m.memberType === "advisor");
  const counts = {
    all: members.length,
    official: official.length,
    advisor: advisors.length,
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

        {usingSamples && (
          <p className="mt-6 rounded-xl border border-dashed border-muted/50 bg-white px-4 py-3 text-sm text-muted">
            Sample profiles are shown to preview the layout. They are not real
            members. Add real profiles in{" "}
            <code className="font-semibold text-ink">data/teamMembers.js</code>.
          </p>
        )}

        <div key={category} className="rise mt-12 space-y-20 sm:space-y-24">
          {showOfficial && (
            <TeamSection
              id="official-members"
              title="Our Official Members"
              description="Meet the people actively contributing to the work and activities of Proyash Songgothon."
              members={official}
            />
          )}
          {showAdvisors && (
            <TeamSection
              id="advisors"
              title="Our Advisors"
              description="Guided by experience, knowledge, and a shared commitment to community wellbeing."
              members={advisors}
              variant="advisor"
            />
          )}
        </div>
      </Container>
    </section>
  );
}
