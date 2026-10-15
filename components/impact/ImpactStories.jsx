import { BookOpenText, ExternalLink, Info, Sunrise } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { impactStoriesIntro as c, impactFocusAreas } from "@/data/impact";
import { formatDate, safeLink } from "@/lib/impact";

export default function ImpactStories({ stories }) {
  return (
    <section
      id="stories"
      aria-labelledby="stories-heading"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="stories-heading"
        >
          {c.text}
        </SectionHeading>
        <p className="mt-5 flex max-w-2xl items-start gap-2 text-sm text-muted">
          <Info size={16} aria-hidden="true" className="mt-1 shrink-0" />
          {c.privacyNote}
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {impactFocusAreas.map((area) => {
            const Icon = iconMap[area.icon];
            const items = stories.filter((s) => s.focusAreaId === area.id);
            return (
              <section
                key={area.id}
                aria-labelledby={`stories-${area.id}`}
                className="flex flex-col rounded-2xl border border-forest/10 bg-paper p-6 sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-mist text-forest">
                    <Sunrise size={20} aria-hidden="true" />
                  </span>
                  <h3
                    id={`stories-${area.id}`}
                    className="text-lg font-extrabold text-ink"
                  >
                    {area.storiesLabel}
                  </h3>
                </div>

                {items.length > 0 ? (
                  <ul className="mt-6 space-y-6">
                    {items.map((s) => {
                      const link = safeLink(s.sourceUrl);
                      const date = formatDate(s.publishedAt);
                      return (
                        <li key={s.id} className="group">
                          {s.image && (
                            <Photo
                              src={s.image.src}
                              alt={s.image.alt}
                              sizes="400px"
                              className="mb-4 aspect-16/10 rounded-xl"
                            />
                          )}
                          {date && (
                            <time
                              dateTime={s.publishedAt}
                              className="text-xs font-semibold text-muted"
                            >
                              {date}
                            </time>
                          )}
                          <h4 className="mt-1 font-extrabold text-ink">
                            {s.title}
                          </h4>
                          {s.initiative && (
                            <p className="text-sm font-semibold text-forest">
                              {s.initiative}
                            </p>
                          )}
                          <p className="mt-2 text-sm leading-relaxed text-muted">
                            {s.summary}
                          </p>
                          {link && (
                            <a
                              href={link}
                              {...(link.startsWith("/")
                                ? {}
                                : {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  })}
                              className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                            >
                              {s.sourceLabel || "Source"}
                              <ExternalLink size={13} aria-hidden="true" />
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="mt-6 flex flex-1 flex-col items-start rounded-xl border border-dashed border-forest/25 bg-white p-5">
                    <BookOpenText
                      size={20}
                      aria-hidden="true"
                      className="text-forest"
                    />
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {c.emptyText}
                    </p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
