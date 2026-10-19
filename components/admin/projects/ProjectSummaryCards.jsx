import {
  Layers,
  CheckCircle2,
  Activity,
  CalendarClock,
  Wallet,
  Receipt,
} from "lucide-react";
import StatCard from "@/components/admin/ui/StatCard";
import { formatCurrency } from "@/lib/donationUtils";

export default function ProjectSummaryCards({ summary, financials }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Projects" icon={Layers} value={summary.total} />
        <StatCard
          label="Completed Projects"
          icon={CheckCircle2}
          value={summary.completed}
        />
        <StatCard
          label="Running Projects"
          icon={Activity}
          value={summary.running}
          note="Status: In Progress"
        />
        <StatCard
          label="Planned Projects"
          icon={CalendarClock}
          value={summary.planned}
          note="Not started yet"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Project Budget"
          icon={Wallet}
          value={formatCurrency(financials.budget)}
          note="Allocated across all projects"
        />
        <StatCard
          label="Total Project Expenses"
          icon={Receipt}
          value={formatCurrency(financials.expenses)}
          note="Project-linked expenses only"
        />
      </div>
    </div>
  );
}
