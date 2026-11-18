"use client";

import { useEffect, useState } from "react";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

import SectionHeading from "@/components/ui/SectionHeading";
import TeamMemberCard from "@/components/team/TeamMemberCard";
import { getPublicTeamMembers } from "@/services/teamApi";
import { mapOfficialMembers } from "@/data/teamMembers";

export default function TeamSection({
  id,
  title,
  description,
  members: initialMembers = [],
  variant = "official",
}) {
  const isAdvisor = variant === "advisor";

  const [members, setMembers] = useState(initialMembers);
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: initialMembers.length,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdvisor) return;

    let active = true;

    async function loadMembers() {
      setLoading(true);

      try {
        const response = await getPublicTeamMembers(page);

        if (!active) return;

        const apiMembers = Array.isArray(response?.data) ? response.data : [];

        // Raw API data -> normalized member objects
        setMembers(mapOfficialMembers(apiMembers));

        setPagination(
          response.pagination || {
            current_page: page,
            last_page: 1,
            total: apiMembers.length,
          },
        );
      } catch (error) {
        console.error("Failed to load team members:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMembers();

    return () => {
      active = false;
    };
  }, [page, isAdvisor]);

  const totalPages = pagination.last_page;

  return (
    <section aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <SectionHeading title={title} headingId={`${id}-heading`} size="md">
        {description}
      </SectionHeading>

      {loading ? (
        <div className="mt-10 py-12 text-center">Loading team members...</div>
      ) : members.length > 0 ? (
        <>
          <ul
            className={`mt-10 grid gap-6 sm:grid-cols-2 ${
              isAdvisor ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {members.map((member) => (
              <li key={member.id}>
                <TeamMemberCard member={member} variant={variant} />
              </li>
            ))}
          </ul>

          {!isAdvisor && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-muted">
                Showing page {pagination.current_page} of {totalPages}
                {" · "}
                Total {pagination.total} members
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1 || loading}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm font-semibold">
                  {pagination.current_page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages || loading}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest">
            <Users size={22} />
          </span>

          <h3 className="mt-5 text-xl font-extrabold text-ink">
            Profiles Coming Soon
          </h3>

          <p className="mx-auto mt-2 max-w-md text-muted">
            We are preparing this section. Check back soon to meet the people
            behind our work.
          </p>
        </div>
      )}
    </section>
  );
}
