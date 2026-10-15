import { formatMoney } from "@/lib/donationCalculations";

/** Line-by-line breakdown behind the Available Balance, so visitors can see exactly how it is derived. */
export default function FinancialSummary({ report }) {
  const rows = [
    ["Total confirmed donations", formatMoney(report.donationsMinor), "+"],
    ["Other confirmed income", formatMoney(report.otherIncomeMinor), "+"],
    ["Total approved expenses", formatMoney(report.expensesMinor), "−"],
    ["Refunds and other adjustments", formatMoney(report.deductionsMinor), "−"],
  ];
  return (
    <div className="rounded-2xl border border-forest/10 bg-white">
      <dl className="divide-y divide-forest/10">
        {rows.map(([label, value, sign]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-6 py-4">
            <dt className="text-ink"><span aria-hidden="true" className="mr-2 font-bold text-forest">{sign}</span>{label}</dt>
            <dd className="font-extrabold text-ink">{value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 rounded-b-2xl bg-mist px-6 py-5">
          <dt className="font-extrabold text-ink">Available balance</dt>
          <dd className="text-xl font-extrabold text-forest">{formatMoney(report.balanceMinor)}</dd>
        </div>
      </dl>
      <p className="border-t border-forest/10 px-6 py-4 text-sm text-muted">
        Available balance = confirmed donations + other confirmed income − approved expenses − refunds and adjustments.
        Only confirmed income and approved expenses are counted. Pending, rejected and refunded donations never are.
        Figures are all-time totals.
      </p>
    </div>
  );
}
