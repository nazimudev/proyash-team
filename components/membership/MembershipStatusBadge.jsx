import { Clock, CircleCheck, CircleX, CirclePause } from "lucide-react";
import { statusCopy } from "@/data/membership";

const styles = {
  pending: { Icon: Clock, cls: "bg-[#fff6e0] text-[#6b4a05]" },
  approved: { Icon: CircleCheck, cls: "bg-mist text-forest" },
  rejected: { Icon: CircleX, cls: "bg-[#fef3f2] text-[#7a271a]" },
  suspended: { Icon: CirclePause, cls: "bg-[#eef0f2] text-ink" },
};

/** Icon + text label (never colour alone). `status` must come from the backend. */
export default function MembershipStatusBadge({ status }) {
  const s = styles[status];
  if (!s) return null;
  const { Icon, cls } = s;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${cls}`}>
      <Icon size={16} aria-hidden="true" />
      {statusCopy[status].label}
    </span>
  );
}
