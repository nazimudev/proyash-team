import PageHeader from "@/components/admin/ui/PageHeader";
import DashboardOverview from "@/components/admin/dashboard/DashboardOverview";

export const instant = false;

export const metadata = {
  title: "Dashboard | Proyash Admin",
};

export default function AdminDashboardPage() {
  return (
    <>
      <DashboardOverview />
    </>
  );
}
