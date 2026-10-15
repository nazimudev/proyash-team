import { Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import TeamMemberCard from "@/components/team/TeamMemberCard";

export default function TeamSection({
  id,
  title,
  description,
  members,
  variant = "official",
}) {
  const isAdvisor = variant === "advisor";
  return (
    <section aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <SectionHeading title={title} headingId={`${id}-heading`} size="md">
        {description}
      </SectionHeading>

      {members.length > 0 ? (
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
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest">
            <Users size={22} aria-hidden="true" />
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
