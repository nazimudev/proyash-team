const statusStyles = {
  Planned: "bg-sky-50 text-sky-800 ring-sky-200",
  "In Progress": "bg-blue-50 text-blue-800 ring-blue-200",
  Completed: "bg-green-50 text-green-800 ring-green-200",
  "On Hold": "bg-amber-50 text-amber-800 ring-amber-200",
  Cancelled: "bg-red-50 text-red-800 ring-red-200",
};

export function ProjectStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] ?? statusStyles.Planned}`}
    >
      {status}
    </span>
  );
}

export function ProgressBar({ value, label }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-2 w-24 overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-9 text-xs text-gray-600">{pct}%</span>
    </div>
  );
}
