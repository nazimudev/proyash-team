import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Volunteer Management | Proyash Admin" };

export default function VolunteersPage() {
  return (
    <>
      <PageHeader title="Volunteer Management" description="Track volunteer sign-ups and assignments." />
      <EmptyState title="Volunteer management is not built yet" description="Volunteer records will appear here once the API is connected." />
    </>
  );
}
