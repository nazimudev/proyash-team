import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Donation Management | Proyash Admin" };

export default function DonationsPage() {
  return (
    <>
      <PageHeader title="Donation Management" description="Verify and record incoming donations." />
      <EmptyState title="Donation management is not built yet" description="Donations awaiting verification will appear here once the API is connected." />
    </>
  );
}
