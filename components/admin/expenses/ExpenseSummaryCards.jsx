import { Wallet, CalendarDays, FolderKanban, Building2 } from "lucide-react";
import StatCard from "@/components/admin/ui/StatCard";
import { formatCurrency } from "@/lib/donationUtils";

export default function ExpenseSummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Expenses"
        icon={Wallet}
        value={formatCurrency(summary.total)}
        note="All recorded expenses"
      />
      <StatCard
        label="This Month"
        icon={CalendarDays}
        value={
          summary.thisMonth === null ? "—" : formatCurrency(summary.thisMonth)
        }
        note="Current calendar month"
      />
      <StatCard
        label="Project Expenses"
        icon={FolderKanban}
        value={formatCurrency(summary.project)}
        note="Linked to a project"
      />
      <StatCard
        label="General Expenses"
        icon={Building2}
        value={formatCurrency(summary.general)}
        note="Not linked to a project"
      />
    </div>
  );
}
