const TONES = {
  green: 'bg-green-50 text-green-800',
  red: 'bg-red-50 text-red-600',
  yellow: 'bg-yellow-50 text-yellow-700',
  slate: 'bg-slate-100 text-slate-600',
};

export default function DashboardSummaryCard({ label, value, hint, icon: Icon, tone = 'green' }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tone]}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
