import { Globe } from "lucide-react";
import Photo from "@/components/ui/Photo";
import FacebookIcon from "@/components/ui/FacebookIcon";
import { LinkedInIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const socials = [
  { key: "facebook", label: "Facebook profile of", Icon: FacebookIcon },
  { key: "linkedin", label: "LinkedIn profile of", Icon: LinkedInIcon },
  { key: "instagram", label: "Instagram profile of", Icon: InstagramIcon },
  { key: "website", label: "Website of", Icon: Globe },
];

/** Returns a normalized http(s) URL, or null for empty/invalid values. */
function validUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const badge = {
  official: { label: "Official Member", className: "bg-mist text-forest" },
  advisor: { label: "Advisor", className: "bg-warm/25 text-ink" },
};

/**
 * One profile. `variant="advisor"` gives a roomier frame and a warm top edge;
 * structure and portrait ratio (4:5) stay identical to official members.
 * The card itself is not a link: there is no profile detail page yet.
 */
export default function TeamMemberCard({ member, variant = "official" }) {
  const isAdvisor = variant === "advisor";
  const links = socials
    .map((s) => ({ ...s, href: validUrl(member.socialLinks?.[s.key]) }))
    .filter((s) => s.href);
  const type = badge[member.memberType] ?? badge.official;

  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-deep/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        isAdvisor
          ? "border-forest/10 border-t-4 border-t-warm"
          : "border-forest/10"
      }`}
    >
      <div className={isAdvisor ? "p-4" : "p-3"}>
        <Photo
          src={member.image}
          alt={`Portrait of ${member.name}, ${member.role}`}
          sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="aspect-4/5 rounded-xl"
          fallback={
            <span
              aria-hidden="true"
              className="text-5xl font-extrabold text-forest/40"
            >
              {initials(member.name)}
            </span>
          }
        />
      </div>

      <div
        className={`flex flex-1 flex-col ${isAdvisor ? "px-6 pb-6 pt-2" : "px-5 pb-5 pt-1"}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${type.className}`}
          >
            {type.label}
          </span>
          {member.isSample && (
            <span className="rounded-full border border-dashed border-muted/60 px-3 py-1 text-xs font-semibold text-muted">
              Sample profile
            </span>
          )}
        </div>

        <h3
          className={`mt-4 font-extrabold leading-tight tracking-tight text-ink ${isAdvisor ? "text-xl" : "text-lg"}`}
        >
          {member.name}
        </h3>
        <p className="mt-1 text-sm font-semibold text-forest">{member.role}</p>

        {member.bio && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
            {member.bio}
          </p>
        )}

        {links.length > 0 && (
          <ul className="mt-auto flex gap-2 border-t border-forest/10 pt-4">
            {links.map(({ key, label, Icon, href }) => (
              <li key={key}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} ${member.name} (opens in a new tab)`}
                  className="grid size-11 place-items-center rounded-lg bg-mist text-forest transition-colors hover:bg-forest hover:text-white"
                >
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
