import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Photo from "@/components/ui/Photo";
import EmptyState from "@/components/impact/EmptyState";
import { impactTimelineIntro as c, impactFocusAreas } from "@/data/impact";
import { formatDate, safeLink } from "@/lib/impact";

export default function ImpactTimeline({ timeline }) {
  const areaLabel = Object.fromEntries(
    impactFocusAreas.map((a) => [a.id, a.label]),
  );

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="scroll-mt-20 bg-paper py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="journey-heading"
        />

        <div className="mt-12">
          {timeline.length > 0 ? (
            <ol className="max-w-3xl border-l-2 border-forest/20">
              {timeline.map((item) => {
                const when = formatDate(item.date) ?? item.period;
                const evidence = safeLink(item.evidenceUrl);
                return (
                  <li
                    key={item.id}
                    className="relative pb-12 pl-8 last:pb-0 sm:pl-10"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-2.25 top-1.5 size-4 rounded-full border-4 border-paper bg-forest"
                    />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={15} aria-hidden="true" />
                        {item.date ? (
                          <time dateTime={item.date}>{when}</time>
                        ) : (
                          when
                        )}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} aria-hidden="true" />
                          {item.location}
                        </span>
                      )}
                      {areaLabel[item.focusAreaId] && (
                        <span className="rounded-full bg-mist px-3 py-0.5 text-xs font-bold text-forest">
                          {areaLabel[item.focusAreaId]}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-muted">
                      {item.description}
                    </p>
                    {item.image && (
                      <div className="group mt-4 max-w-md">
                        <Photo
                          src={item.image.src}
                          alt={item.image.alt}
                          sizes="448px"
                          className="aspect-16/10 rounded-xl"
                        />
                      </div>
                    )}
                    {evidence && (
                      <a
                        href={evidence}
                        {...(evidence.startsWith("/")
                          ? {}
                          : { target: "_blank", rel: "noopener noreferrer" })}
                        className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                      >
                        {item.evidenceLabel || "View supporting record"}
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Verified records are on the way"
            >
              {c.emptyText}
            </EmptyState>
          )}
        </div>
      </Container>
    </section>
  );
}
