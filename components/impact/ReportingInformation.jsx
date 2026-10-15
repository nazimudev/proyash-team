import { FileText } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { reportingInformation as c } from "@/data/impact";

export default function ReportingInformation({ reporting }) {
  return (
    <section
      id="reporting"
      aria-labelledby="reporting-heading"
      className="scroll-mt-20 bg-paper py-16 sm:py-20"
    >
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <SectionHeading
            eyebrow={c.eyebrow}
            title={c.title}
            headingId="reporting-heading"
            size="md"
            className="lg:col-span-5"
          />

          <div className="lg:col-span-7">
            {reporting.hasAny ? (
              <>
                <dl className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-white">
                  {reporting.rows.map(([label, value]) => (
                    <div
                      key={label}
                      className="grid gap-1 p-5 sm:grid-cols-3 sm:gap-4"
                    >
                      <dt className="text-sm font-bold text-ink">{label}</dt>
                      <dd className="text-muted sm:col-span-2">{value}</dd>
                    </div>
                  ))}
                </dl>
                {/* Reports are listed in the Transparency section when available */}
              </>
            ) : (
              <div className="flex items-start gap-4 rounded-2xl border border-dashed border-forest/25 bg-white p-6">
                <FileText
                  size={22}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-forest"
                />
                <p className="text-muted">{c.emptyText}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
