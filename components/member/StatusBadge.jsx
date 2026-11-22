import { AlertCircle, BadgeCheck, CheckCircle2, Clock, CircleDot, Ban, XCircle, PieChart } from 'lucide-react';

const TONES = {
  green: 'bg-green-50 text-green-800 ring-green-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-600/25',
  orange: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

const CONFIG = {
  contribution: {
    paid: { label: 'Paid', tone: 'green', icon: CheckCircle2 },
    due: { label: 'Due', tone: 'red', icon: AlertCircle },
    partial: { label: 'Partial', tone: 'orange', icon: PieChart },
    pending_verification: { label: 'Pending verification', tone: 'yellow', icon: Clock },
  },
  payment: {
    verified: { label: 'Verified', tone: 'green', icon: BadgeCheck },
    pending: { label: 'Pending', tone: 'yellow', icon: Clock },
    rejected: { label: 'Rejected', tone: 'red', icon: XCircle },
  },
  membership: {
    approved: { label: 'Approved', tone: 'green', icon: BadgeCheck },
    pending: { label: 'Pending', tone: 'yellow', icon: Clock },
    rejected: { label: 'Rejected', tone: 'red', icon: XCircle },
    suspended: { label: 'Suspended', tone: 'orange', icon: Ban },
  },
  fee: {
    paid: { label: 'Paid', tone: 'green', icon: CheckCircle2 },
    unpaid: { label: 'Unpaid', tone: 'red', icon: AlertCircle },
    waived: { label: 'Waived', tone: 'slate', icon: CircleDot },
  },
  account: {
    active: { label: 'Active', tone: 'green', icon: CheckCircle2 },
    suspended: { label: 'Suspended', tone: 'orange', icon: Ban },
    unverified: { label: 'Unverified', tone: 'yellow', icon: Clock },
  },
};

export default function StatusBadge({ kind, status, className = '' }) {
  const cfg = CONFIG[kind]?.[status] || { label: status || 'Unknown', tone: 'slate', icon: CircleDot };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[cfg.tone]} ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}
