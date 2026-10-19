import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";
import DonationsPage from "@/components/admin/donation/DonationsPage";


export const metadata = { title: "Donation Management | Proyash Admin" };

export default function DonationPage() {
  return (
    <>
      <DonationsPage />
    </>
  );
}
