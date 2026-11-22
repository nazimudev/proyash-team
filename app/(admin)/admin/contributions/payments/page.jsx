import PageHeader from "@/components/admin/ui/PageHeader";
import ContributionPayments from "@/components/admin/contributions/ContributionPayments";

export const instant = false;

export const metadata = {
  title: "Contribution Payments | Proyash Admin",
};

export default function ContributionPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Contribution Payments"
        description="Review, approve, and manage member contribution payments."
      />

      <ContributionPayments />
    </>
  );
}
