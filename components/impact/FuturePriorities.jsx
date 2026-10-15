import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { iconMap } from "@/components/ui/icons";
import { futurePrioritiesIntro as c } from "@/data/impact";
import { formatNumber } from "@/lib/impact";

export default function FuturePriorities({ priorities }) {
  return (
    <section
      id="looking-ahead"
      aria-labelledby="looking-ahead-heading"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="looking-ahead-heading"
        >
          {c.text}
        </SectionHeading>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {priorities.map(({ id, icon, title, text, targets }) => {
            const Icon = iconMap[icon];
            return (
              <li
                key={id}
                className="rounded-2xl border border-forest/10 bg-paper p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon size={26} aria-hidden="true" className="text-forest" />
                  <span className="rounded-full border border-dashed border-muted/50 px-3 py-1 text-xs font-semibold text-muted">
                    Future priority
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-muted">{text}</p>

                {/* Targets render only when approved; progress only with valid target AND verified progress. */}
                {targets.length > 0 && (
                  <ul className="mt-5 space-y-4 border-t border-forest/10 pt-5">
                    {targets.map((t) => (
                      <li key={t.id} className="text-sm">
                        <p className="font-semibold text-ink">
                          {t.description}
                        </p>
                        <p className="text-muted">
                          Target: {formatNumber(t.value)} {t.unit}
                          {t.period ? ` · ${t.period}` : ""}
                        </p>
                        {t.progress && (
                          <div className="mt-2">
                            <div
                              role="progressbar"
                              aria-label={`Verified progress toward target: ${t.description}`}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={t.progress.percent}
                              className="h-2 overflow-hidden rounded-full bg-mist"
                            >
                              <div
                                className="h-full bg-forest"
                                style={{ width: `${t.progress.percent}%` }}
                              />
                            </div>
                            <p className="mt-1 text-xs font-semibold text-muted">
                              {formatNumber(t.progress.current)} of{" "}
                              {formatNumber(t.progress.target)} {t.unit}{" "}
                              verified ({t.progress.percent}%)
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-sm text-muted">{c.note}</p>
      </Container>
    </section>
  );
}
