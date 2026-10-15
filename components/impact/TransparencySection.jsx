import { BookOpen, ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { iconMap } from "@/components/ui/icons";
import { transparencyIntro as c, transparencyPrinciples } from "@/data/impact";

export default function TransparencySection({ reports = [] }) {
  return (
    <section
      id="transparency"
      aria-labelledby="transparency-heading"
      className="on-dark scroll-mt-20 bg-deep py-20 text-white sm:py-28"
    >
      <Container>
        <SectionHeading
          tone="dark"
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="transparency-heading"
        >
          {c.text}
        </SectionHeading>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {transparencyPrinciples.map(({ icon, title, text }) => {
            const Icon = iconMap[icon];
            return (
              <li
                key={title}
                className="rounded-2xl border border-white/10 bg-white/4 p-6"
              >
                <BookOpen size={24} aria-hidden="true" className="text-fresh" />
                <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {text}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-white/60">{c.note}</p>

        {/* Official documents appear only if real, valid links are supplied in data/impact.js */}
        {reports.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-3">
            {reports.map((r) => (
              <li key={r.id ?? r.url}>
                <a
                  href={r.url}
                  {...(r.url.startsWith("/")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  {r.label}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
