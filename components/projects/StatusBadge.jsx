import { CircleCheck, CalendarClock, Activity, Info } from "lucide-react";

const styles = {
  ongoing: { Icon: Activity, cls: "bg-fresh/20 text-forest" },
  completed: { Icon: CircleCheck, cls: "bg-mist text-forest" },
  planned: { Icon: CalendarClock, cls: "border border-dashed border-muted/60 bg-white text-muted" },
};

/** Verified status chip. With no status (unverified project) it says so instead of guessing. */
export default function StatusBadge({ status, label }) {
  const s = styles[status];
  if (!s) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-muted/60 px-3 py-1 text-xs font-semibold text-muted">
        <Info size={13} aria-hidden="true" />
        Awaiting verification
      </span>
    );
  }
  const { Icon, cls } = s;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  );
}
