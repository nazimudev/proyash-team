"use client";

import { useState } from "react";
import { CircleCheck, Hourglass, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import CountUp from "@/components/impact/CountUp";
import EmptyState from "@/components/impact/EmptyState";
import { impactNumbersIntro as c } from "@/data/impact";
import { formatNumber, formatDate, safeLink } from "@/lib/impact";

function StatCard({ stat }) {
  const link = safeLink(stat.sourceUrl);
  const verifiedOn = formatDate(stat.lastVerifiedAt);
  return (
    <li className="flex flex-col rounded-2xl border border-forest/10 bg-paper p-7">
      <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">
        <CircleCheck size={14} aria-hidden="true" />
        Verified{verifiedOn ? ` on ${verifiedOn}` : ""}
      </span>
      <p className="mt-5 text-5xl font-extrabold leading-none tracking-tight text-forest">
        <CountUp value={stat.value} />
      </p>
      <p className="mt-1 text-sm font-semibold text-muted">{stat.unit}</p>
      <h3 className="mt-5 text-lg font-extrabold text-ink">{stat.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {stat.description}
      </p>
      <dl className="mt-auto space-y-1 pt-5 text-sm">
        {stat.reportingPeriod && (
          <div className="flex gap-2">
            <dt className="font-semibold text-ink">Period:</dt>
            <dd className="text-muted">{stat.reportingPeriod}</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="font-semibold text-ink">Source:</dt>
          <dd className="text-muted">
            {link ? (
              <a
                href={link}
                {...(link.startsWith("/")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex items-center gap-1 font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
              >
                {stat.sourceLabel}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            ) : (
              stat.sourceLabel
            )}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function ImpactStatistics({ statistics, pendingStatistics }) {
  const periods = [
    ...new Set(statistics.map((s) => s.reportingPeriod).filter(Boolean)),
  ];
  const [period, setPeriod] = useState("all");
  const visible =
    period === "all"
      ? statistics
      : statistics.filter((s) => s.reportingPeriod === period);

  return (
    <section
      id="impact-numbers"
      aria-labelledby="impact-numbers-heading"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="impact-numbers-heading"
        >
          {c.text}
        </SectionHeading>

        {/* The filter only exists once real data spans more than one reporting period. */}
        {periods.length > 1 && (
          <div
            role="group"
            aria-label="Filter statistics by reporting period"
            className="mt-8 flex flex-wrap gap-2"
          >
            {["all", ...periods].map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  period === p
                    ? "border-forest bg-forest text-white"
                    : "border-forest/20 bg-white text-ink hover:border-forest/50"
                }`}
              >
                {p === "all" ? "All periods" : p}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          {visible.length > 0 ? (
            <>
              <h3 className="sr-only">Verified figures</h3>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((s) => (
                  <StatCard key={s.id} stat={s} />
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              icon={Hourglass}
              title="Verified figures are not yet published"
            >
              We are collecting and checking our records. Figures will appear
              here only once they can be supported by reliable organizational
              records.
            </EmptyState>
          )}
        </div>

        {pendingStatistics.length > 0 && (
          <div className="mt-12">
            <h3 className="text-base font-extrabold text-ink">
              Data Not Yet Available
            </h3>
            <p className="mt-1 text-sm text-muted">
              These measures are still being collected. No figure is shown until
              it has been verified.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingStatistics.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 rounded-xl border border-dashed border-muted/40 px-4 py-3.5 text-sm"
                >
                  <Hourglass
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-muted"
                  />
                  <span className="font-semibold text-ink">{s.title}</span>
                  <span className="ml-auto text-xs font-semibold text-muted">
                    Not yet available
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
