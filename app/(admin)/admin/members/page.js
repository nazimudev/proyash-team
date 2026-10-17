import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Member Management | Proyash Admin" };

export default function MembersPage() {
  return (
    <>
      <PageHeader title="Member Management" description="Review applications and manage member records." />
      <EmptyState title="Member management is not built yet" description="Member lists and approvals will appear here once the API is connected." />
    </>
  );
}
