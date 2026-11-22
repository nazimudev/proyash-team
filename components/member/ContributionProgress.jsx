'use client';
import { useEffect, useState } from 'react';
import { formatTaka } from '../../lib/member/format';

const R = 52;
const C = 2 * Math.PI * R;

export default function ContributionProgress({ summary }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(summary.completionPercent));
    return () => cancelAnimationFrame(id);
  }, [summary.completionPercent]);

  const rows = [
    { label: 'Expected contribution', value: summary.expectedAmount, dot: 'bg-green-200' },
    { label: 'Paid (verified)', value: summary.paidAmount, dot: 'bg-green-700' },
    { label: 'Outstanding', value: summary.outstandingAmount, dot: 'bg-red-400' },
  ];

  return (
    <section aria-labelledby="progress-title" className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <h2 id="progress-title" className="text-base font-bold text-slate-900">Contribution progress</h2>
      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0" role="img" aria-label={`${summary.completionPercent} percent of expected contributions paid`}>
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={R} fill="none" stroke="#dcfce7" strokeWidth="12" />
            <circle cx="60" cy="60" r={R} fill="none" stroke="#166534" strokeWidth="12" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * shown) / 100} className="transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-green-900">{summary.completionPercent}%</span>
            <span className="text-[11px] font-semibold text-slate-500">completed</span>
          </div>
        </div>
        <dl className="min-w-0 flex-1 space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className={`h-2 w-2 rounded-full ${r.dot}`} />{r.label}</dt>
              <dd className="text-lg font-extrabold text-slate-900">{formatTaka(r.value)}</dd>
            </div>
          ))}
        </dl>
      </div>
      {summary.pendingAmount > 0 && <p className="mt-4 rounded-xl bg-yellow-50 px-3 py-2 text-xs text-yellow-900">{formatTaka(summary.pendingAmount)} is awaiting verification and is not counted as paid yet.</p>}
    </section>
  );
}
