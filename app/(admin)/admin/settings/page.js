import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Settings | Proyash Admin" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage site and account preferences." />
      <EmptyState title="Settings are not built yet" description="Site and account settings will appear here later." />
    </>
  );
}
