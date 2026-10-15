import { ExternalLink, Receipt } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatMoney } from "@/lib/donationCalculations";

export default function ExpenseList({ expenses }) {
  return (
    <section id="expenses" aria-labelledby="expenses-heading" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Expenses" title="How Funds Have Been Spent" headingId="expenses-heading">
          Approved expenses that have been reviewed for public disclosure.
        </SectionHeading>

        {expenses.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-forest/25 bg-paper px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest"><Receipt size={22} aria-hidden="true" /></span>
            <p className="mx-auto mt-4 max-w-md text-muted">Expense records will be published here once they have been verified and approved.</p>
          </div>
        ) : (
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {expenses.map((x) => (
              <li key={x.id} className="rounded-2xl border border-forest/10 bg-paper p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-extrabold text-ink">{x.description}</h3>
                  <p className="shrink-0 text-lg font-extrabold text-forest">{formatMoney(x.expenseMinor)}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{x.dateLabel}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {x.category && <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">{x.category}</span>}
                  {x.projectLabel && <span className="rounded-full border border-forest/15 px-3 py-1 text-xs font-semibold text-muted">{x.projectLabel}</span>}
                </div>
                {x.documentUrl && (
                  <a
                    href={x.documentUrl}
                    {...(x.documentUrl.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                  >
                    View supporting document <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
