import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Team Management | Proyash Admin" };

export default function TeamPage() {
  return (
    <>
      <PageHeader title="Team Management" description="Manage the team members shown on the public site." />
      <EmptyState title="Team management is not built yet" description="Team profiles will appear here once the API is connected." />
    </>
  );
}
