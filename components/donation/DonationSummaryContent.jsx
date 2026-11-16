import { Suspense } from "react";
import DonationSummary from "./DonationSummary";
import { getDonationSummary } from "@/services/publicDonationApi";

async function SummaryData() {
  const summaryData = await getDonationSummary();

  const report = {
    published: summaryData?.published === true && !!summaryData?.summary,
    ledger: [],
    expenses: [],
  };

  if (report.published) {
    const summary = summaryData.summary;

    report.donationsMinor = Math.round(Number(summary.total_donations) * 100);

    report.expensesMinor = Math.round(Number(summary.total_expenses) * 100);

    report.balanceMinor = Math.round(Number(summary.available_balance) * 100);

    report.publishedDonationCount = summary.approved_donation_count;

    report.reportingPeriod = summaryData.reporting_period;
    report.lastUpdated = summaryData.last_updated;
  }

  return <DonationSummary report={report} />;
}

export default function DonationSummaryContent() {
  return (
    <Suspense
      fallback={
        <section className="bg-white py-14 text-center">
          Loading financial summary...
        </section>
      }
    >
      <SummaryData />
    </Suspense>
  );
}
