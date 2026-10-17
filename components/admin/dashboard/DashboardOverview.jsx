import { Users, ClipboardList, FolderKanban, HandCoins } from "lucide-react";
import StatCard from "../ui/StatCard";

// MOCK DATA ONLY: placeholder values, not real Proyash statistics.
const stats = [
  { label: "Total Members", value: "000", icon: Users },
  { label: "Pending Applications", value: "00", icon: ClipboardList },
  { label: "Active Projects", value: "00", icon: FolderKanban },
  { label: "Pending Donation Verifications", value: "00", icon: HandCoins },
];

const mockApplications = [
  { name: "Sample Applicant A", detail: "Submitted 2 days ago" },
  { name: "Sample Applicant B", detail: "Submitted 3 days ago" },
  { name: "Sample Applicant C", detail: "Submitted 5 days ago" },
];
const mockDonations = [
  { name: "Sample Donor A", detail: "Awaiting verification" },
  { name: "Sample Donor B", detail: "Awaiting verification" },
  { name: "Sample Donor C", detail: "Verified" },
];
const mockActivity = [
  { name: "Sample activity: a member application was reviewed", detail: "Today" },
  { name: "Sample activity: a project was updated", detail: "Yesterday" },
  { name: "Sample activity: a gallery album was added", detail: "This week" },
];

function Panel({ title, items }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Mock data</span>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.name} className="px-5 py-3">
            <p className="text-sm text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-400">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} note="Placeholder value" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Member Applications" items={mockApplications} />
        <Panel title="Recent Donations" items={mockDonations} />
        <Panel title="Recent Activity" items={mockActivity} />
      </div>
    </div>
  );
}
