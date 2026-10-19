import { Clock, CheckCircle2, XCircle } from "lucide-react";

const styles = {
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Clock },
  verified: { label: "Verified", cls: "bg-green-50 text-green-800 ring-green-200", Icon: CheckCircle2 },
  rejected: { label: "Rejected", cls: "bg-red-50 text-red-800 ring-red-200", Icon: XCircle },
};

export default function StatusBadge({ status }) {
  const { label, cls, Icon } = styles[status] ?? styles.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
