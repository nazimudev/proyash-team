import { ShieldCheck, Hourglass } from "lucide-react";
import Container from "@/components/ui/Container";
import { formatMoney } from "@/lib/donationCalculations";

/** Four headline figures, shown only from a verified reporting baseline. Otherwise an honest note, never zeros. */
export default function DonationSummary({ report }) {
  return (
    <section aria-labelledby="summary-heading" className="bg-white py-14 sm:py-16">
      <Container>
        <h2 id="summary-heading" className="sr-only">Donation summary</h2>
        {report.published ? (
          <>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total Donations Received", formatMoney(report.donationsMinor)],
                ["Total Expenses", formatMoney(report.expensesMinor)],
                ["Available Balance", formatMoney(report.balanceMinor)],
                ["Total Published Donations", new Intl.NumberFormat("en-US").format(report.publishedDonationCount)],
              ].map(([label, value], i) => (
                <div key={label} className={`rounded-2xl border p-6 ${i === 2 ? "border-forest bg-forest text-white" : "border-forest/10 bg-paper"}`}>
                  <dt className={`text-sm font-bold ${i === 2 ? "text-white/80" : "text-muted"}`}>{label}</dt>
                  <dd className={`mt-2 text-3xl font-extrabold tracking-tight ${i === 2 ? "text-white" : "text-forest"}`}>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
              Pending and unverified donations are not included in these figures.
              {report.reportingPeriod ? ` Scope: ${report.reportingPeriod}.` : ""}
              {report.lastUpdated ? ` Last updated ${report.lastUpdated}.` : ""}
            </p>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-forest/25 bg-paper px-6 py-10 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest"><Hourglass size={22} aria-hidden="true" /></span>
            <p className="mt-4 text-lg font-extrabold text-ink">Financial records will be published here once verified.</p>
            <p className="mx-auto mt-2 max-w-xl text-muted">We only share totals that come from reviewed accounting records, so no figures are shown until then.</p>
          </div>
        )}
      </Container>
    </section>
  );
}
