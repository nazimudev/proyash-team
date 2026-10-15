import { FileText, Sprout } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { iconMap } from "@/components/ui/icons";
import { impactFocusAreasIntro as c } from "@/data/impact";
import { formatNumber, formatDate } from "@/lib/impact";

export default function ImpactFocusAreas({ focusAreas }) {
  return (
    <section
      id="focus-areas"
      aria-labelledby="focus-areas-heading"
      className="scroll-mt-20 bg-mist py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="focus-areas-heading"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {focusAreas.map((area) => {
            const Icon = iconMap[area.icon];
            const hasDetails =
              area.statistics.length > 0 || area.activities.length > 0;
            return (
              <article
                key={area.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white"
              >
                {area.image && (
                  <Photo
                    src={area.image.src}
                    alt={area.image.alt}
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="aspect-16/10"
                  />
                )}
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <span className="grid size-12 place-items-center rounded-xl bg-mist text-forest">
                    <Sprout size={24} aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-bold text-forest">
                    {area.label}
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-ink">
                    {area.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    {area.description}
                  </p>

                  <div className="mt-6 border-t border-forest/10 pt-6">
                    {hasDetails ? (
                      <>
                        {area.statistics.length > 0 && (
                          <dl className="space-y-3">
                            {area.statistics.map((s) => (
                              <div key={s.id}>
                                <dt className="text-sm text-muted">
                                  {s.title}
                                </dt>
                                <dd className="text-2xl font-extrabold text-forest">
                                  {formatNumber(s.value)}{" "}
                                  <span className="text-sm font-semibold text-muted">
                                    {s.unit}
                                  </span>
                                  {s.reportingPeriod && (
                                    <span className="block text-xs font-semibold text-muted">
                                      {s.reportingPeriod}
                                    </span>
                                  )}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {area.activities.length > 0 && (
                          <ul className="mt-4 space-y-2 text-sm">
                            {area.activities.map((a) => (
                              <li key={a.id} className="flex gap-2">
                                <FileText
                                  size={16}
                                  aria-hidden="true"
                                  className="mt-0.5 shrink-0 text-forest"
                                />
                                <span>
                                  <span className="font-semibold text-ink">
                                    {a.title}
                                  </span>
                                  <span className="text-muted">
                                    {" "}
                                    · {formatDate(a.date) ?? a.period}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted">
                        Verified activity details for this area will appear here
                        once records are published.
                      </p>
                    )}
                  </div>

                  <Button
                    href="/#initiatives"
                    variant="link"
                    className="mt-auto self-start pt-6"
                  >
                    About this initiative
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
