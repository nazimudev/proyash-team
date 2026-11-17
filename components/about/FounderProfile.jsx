import SectionHeading from "./SectionHeading";
import FounderPortrait from "./FounderPortrait";
import DraftBadge from "./DraftBadge";
import { ExternalLink } from "lucide-react";

function FounderCard({ content }) {
  return (
    <article className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-emerald-100/10 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-sm">
        <FounderPortrait
          portrait={content.portrait}
          className="rounded-3xl shadow-lg ring-1 ring-emerald-900/10"
        />
      </div>

      <div className="mt-8">
        {content.isPlaceholder && (
          <DraftBadge>{content.placeholderNotice}</DraftBadge>
        )}

        <h3 className="mt-4 text-2xl font-bold leading-snug text-emerald-950 dark:text-emerald-50">
          {content.name}
        </h3>

        <p className="mt-1 text-lg font-medium text-emerald-700 dark:text-amber-300">
          {content.designation}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700 dark:text-amber-300">
          {content.message}
        </p>

        <div className="mt-6 space-y-4 text-base leading-8 text-neutral-700 dark:text-neutral-300">
          {content.bio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {content.socialLinks?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-3">
            {content.socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-800 px-4 py-2 text-sm font-medium text-emerald-900 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/50 dark:border-emerald-300 dark:text-emerald-100 dark:hover:bg-emerald-900/40"
                >
                  {link.label}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">(নতুন ট্যাবে খুলবে)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function FounderProfile({ content }) {
  const founders = Array.isArray(content) ? content : [content];

  if (!founders.length) return null;

  return (
    <section
      id="founders"
      aria-labelledby="founder-heading"
      className="scroll-mt-24 bg-neutral-50 py-16 sm:py-24 dark:bg-neutral-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="founder-heading"
          title="Meet Our Founders"
          subtitle="Proyash Team was founded in May 2024 by two young individuals who shared a vision of serving humanity and creating positive social change."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {founders.map((founder, index) => (
            <FounderCard
              key={founder.id || founder.name || index}
              content={founder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
