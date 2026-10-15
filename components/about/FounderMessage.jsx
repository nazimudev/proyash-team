import { Quote } from "lucide-react"; // ASSUMPTION: lucide-react
import SectionHeading from "./SectionHeading";
import FounderPortrait from "./FounderPortrait";
import DraftBadge from "./DraftBadge";

/** Name, designation and portrait are read from `founder` — never duplicated. */
export default function FounderMessage({ content, founder }) {
  return (
    <section
      id={content.id}
      aria-labelledby="founder-message-heading"
      className="scroll-mt-24 bg-emerald-950 py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="founder-message-heading"
          title={content.title}
          subtitle={content.subtitle}
          tone="dark"
        />

        <figure className="mt-10">
          <Quote className="h-12 w-12 text-amber-400" aria-hidden="true" />
          {content.isPlaceholder && (
            <div className="mt-4">
              <DraftBadge tone="dark">{content.placeholderNotice}</DraftBadge>
            </div>
          )}
          <blockquote className="mt-6 space-y-5 text-xl leading-9 text-emerald-50 sm:text-2xl sm:leading-10">
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </blockquote>

          <figcaption className="mt-10 flex items-center gap-4 border-t border-white/15 pt-6">
            <FounderPortrait
              portrait={founder.portrait}
              className="h-16 w-16 shrink-0 rounded-full aspect-square!"
            />
            <div>
              <p className="text-lg font-semibold">{founder.name}</p>
              <p className="text-emerald-200">{founder.designation}</p>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
