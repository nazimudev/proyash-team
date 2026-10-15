import SectionHeading from "./SectionHeading";
import FounderPortrait from "./FounderPortrait";
import DraftBadge from "./DraftBadge";
import { ExternalLink } from "lucide-react";

export default function FounderProfile({ content }) {
  return (
    <section
      id={content.id}
      aria-labelledby="founder-heading"
      className="scroll-mt-24 bg-neutral-50 py-16 sm:py-24 dark:bg-neutral-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="founder-heading"
          title={content.title}
          subtitle={content.subtitle}
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <FounderPortrait
              portrait={content.portrait}
              className="rounded-3xl shadow-lg ring-1 ring-emerald-900/10"
            />
          </div>

          <div>
            {content.isPlaceholder && (
              <DraftBadge>{content.placeholderNotice}</DraftBadge>
            )}
            <h3 className="mt-4 text-3xl font-bold leading-snug text-emerald-950 dark:text-emerald-50">
              {content.name}
            </h3>
            <p className="mt-1 text-lg font-medium text-emerald-700 dark:text-amber-300">
              {content.designation}
            </p>

            <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
              {content.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <blockquote className="mt-8 max-w-2xl border-l-4 border-amber-400 bg-white py-4 pl-5 pr-4 text-lg leading-8 text-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
              {content.purposeNote}
            </blockquote>

            {content.socialLinks.length > 0 && (
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
        </div>
      </div>
    </section>
  );
}
