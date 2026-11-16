import { Suspense } from "react";
import { connection } from "next/server";

import DonationHero from "@/components/donation/DonationHero";
import DonationForm from "@/components/donation/DonationForm";
import DonationCTA from "@/components/donation/DonationCTA";
import { getDonationPageData } from "@/lib/donationCalculations";
import { getPaymentMethods, isSubmissionConfigured } from "@/lib/payment";
import { donationConfig } from "@/data/donationConfig";

import DonationSummaryContent from "@/components/donation/DonationSummaryContent";
import DonorListContent from "@/components/donation/DonorListContent";
import FinancialTransparencyContent from "@/components/donation/FinancialTransparencyContent";

export const metadata = {
  title: "Donate | Proyash",
  description:
    "Learn how to support Proyash through manual donation methods and explore verified donation records and financial transparency information.",
};

async function DonationFormContent() {
  const methods = await getPaymentMethods();

  const submissionOpen =
    isSubmissionConfigured() && methods.some((m) => m.available);

  return <DonationForm methods={methods} submissionOpen={submissionOpen} />;
}

// Live API data: wait for an actual request before fetching.
async function DonationLiveContent() {
  await connection();

  return (
    <>
      <DonationSummaryContent />

      <DonorListContent pageSize={donationConfig.publicListPageSize} />

      <FinancialTransparencyContent />
    </>
  );
}

export default function DonationPage() {
  const { report } = getDonationPageData();

  return (
    <>
      <DonationHero />

      <Suspense
        fallback={
          <div className="py-20 text-center">
            Loading donation information...
          </div>
        }
      >
        <DonationLiveContent />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 text-center">Loading payment methods...</div>
        }
      >
        <DonationFormContent />
      </Suspense>

      <DonationCTA />
    </>
  );
}
