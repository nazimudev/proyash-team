/* eslint-disable react-hooks/error-boundaries */
import FinancialTransparency from "./FinancialTransparency";
import { getPublicFinancialLedger } from "@/services/publicDonationApi";
import { getDonationSummary } from "@/services/publicDonationApi";

export default async function FinancialTransparencyContent() {
  try {
    const [summaryData, ledger] = await Promise.all([
      getDonationSummary(),
      getPublicFinancialLedger(),
    ]);

    const report = {
      published:
        summaryData?.published === true && Boolean(summaryData?.summary),

      reportingPeriod: summaryData?.reporting_period ?? null,
      lastUpdated: summaryData?.last_updated ?? null,

      donationsMinor: 0,
      expensesMinor: 0,
      balanceMinor: 0,

      ledger,
    };

    if (report.published) {
      const summary = summaryData.summary;

      report.donationsMinor = Math.round(Number(summary.total_donations) * 100);

      report.expensesMinor = Math.round(Number(summary.total_expenses) * 100);

      report.balanceMinor = Math.round(Number(summary.available_balance) * 100);
    }

    return <FinancialTransparency report={report} />;
  } catch (error) {
    console.error("Financial transparency error:", error);

    return (
      <FinancialTransparency
        report={{
          published: false,
          ledger: [],
        }}
      />
    );
  }
}
