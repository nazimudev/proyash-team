import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Project Management | Proyash Admin" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader title="Project Management" description="Create and update Proyash projects." />
      <EmptyState title="Project management is not built yet" description="Projects will appear here once the API is connected." />
    </>
  );
}
