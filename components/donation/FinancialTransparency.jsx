import { Hourglass } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FinancialSummary from "@/components/donation/FinancialSummary";
import { formatMoney } from "@/lib/donationCalculations";

const dash = <span aria-label="none">—</span>;

export default function FinancialTransparency({ report }) {
  return (
    <section id="transparency" aria-labelledby="transparency-heading" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Transparency" title="Your Contributions, Accounted For" headingId="transparency-heading">
          We publish confirmed donations and approved expenses so you can see how contributions are managed.
        </SectionHeading>

        {!report.published ? (
          <div className="mt-12 rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest"><Hourglass size={22} aria-hidden="true" /></span>
            <p className="mt-4 text-lg font-extrabold text-ink">Financial records will be published here once verified.</p>
          </div>
        ) : (
          <>
            {(report.reportingPeriod || report.lastUpdated) && (
              <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-2 text-sm">
                {report.reportingPeriod && <div><dt className="inline font-bold text-ink">Reporting period: </dt><dd className="inline text-muted">{report.reportingPeriod}</dd></div>}
                {report.lastUpdated && <div><dt className="inline font-bold text-ink">Last updated: </dt><dd className="inline text-muted">{report.lastUpdated}</dd></div>}
              </dl>
            )}
            <div className="mt-8 max-w-3xl"><FinancialSummary report={report} /></div>

            <h3 className="mt-16 text-2xl font-extrabold text-ink">Published financial activity</h3>
            <p className="mt-2 max-w-2xl text-sm text-muted">Only entries reviewed and approved for public disclosure are listed. Totals above are calculated from all verified records, so they can include entries that are not itemised here. Private donor and payment details are never published.</p>

            {report.ledger.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-10 text-center text-muted">No itemised entries have been published yet.</p>
            ) : (
              <>
                <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-forest/10 bg-white md:block">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Published financial activity</caption>
                    <thead className="bg-mist text-ink">
                      <tr>{["Date", "Description", "Category", "Income", "Expense", "Status"].map((h) => <th key={h} scope="col" className="px-4 py-3 font-bold">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-forest/10">
                      {report.ledger.map((r) => (
                        <tr key={r.id}>
                          <td className="whitespace-nowrap px-4 py-3 text-muted">{r.dateLabel}</td>
                          <td className="px-4 py-3 text-ink">{r.description}</td>
                          <td className="px-4 py-3 text-muted">{r.category ?? dash}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-forest">{r.incomeMinor !== null ? formatMoney(r.incomeMinor) : dash}</td>
                          <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{r.expenseMinor !== null ? formatMoney(r.expenseMinor) : dash}</td>
                          <td className="px-4 py-3"><span className="rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-forest">{r.statusLabel}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="mt-6 space-y-3 md:hidden">
                  {report.ledger.map((r) => (
                    <li key={r.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-ink">{r.description}</p>
                        <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-xs font-bold text-forest">{r.statusLabel}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">{r.dateLabel}{r.category ? ` · ${r.category}` : ""}</p>
                      <p className="mt-2 font-extrabold">
                        {r.incomeMinor !== null ? <span className="text-forest">Income {formatMoney(r.incomeMinor)}</span> : <span className="text-ink">Expense {formatMoney(r.expenseMinor)}</span>}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
