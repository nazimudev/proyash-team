import PageHeader from "@/components/admin/ui/PageHeader";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";

export const metadata = { title: "Dashboard | Proyash Admin" };

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="An overview of members, projects, and donations. Figures below are mock data." />
      <DashboardOverview />
    </>
  );
}
