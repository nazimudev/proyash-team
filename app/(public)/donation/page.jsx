import DonationHero from "@/components/donation/DonationHero";
import DonationSummary from "@/components/donation/DonationSummary";
import DonationForm from "@/components/donation/DonationForm";
import DonorList from "@/components/donation/DonorList";
import FinancialTransparency from "@/components/donation/FinancialTransparency";
import ExpenseList from "@/components/donation/ExpenseList";
import DonationCTA from "@/components/donation/DonationCTA";
import { getDonationPageData } from "@/lib/donationCalculations";
import { getPaymentMethods, isSubmissionConfigured } from "@/lib/payment";
import { donationConfig } from "@/data/donationConfig";

export const metadata = {
  title: "Donate | Proyash",
  description:
    "Learn how to support Proyash through manual donation methods and explore verified donation records and financial transparency information.",
};

export default function DonationPage() {
  const { donations, report } = getDonationPageData();
  const methods = getPaymentMethods();
  // Open only if a backend endpoint exists AND at least one method is fully configured.
  const submissionOpen =
    isSubmissionConfigured() && methods.some((m) => m.available);

  return (
    <>
      <DonationHero />
      <DonationSummary report={report} />
      <DonationForm methods={methods} submissionOpen={submissionOpen} />
      <DonorList
        donations={donations}
        pageSize={donationConfig.publicListPageSize}
      />
      <FinancialTransparency report={report} />
      <ExpenseList expenses={report.expenses} />
      <DonationCTA />
    </>
  );
}
