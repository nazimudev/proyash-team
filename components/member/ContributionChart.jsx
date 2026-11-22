'use client';
import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import EmptyState from './EmptyState';
import { formatTaka, monthName, monthShort } from '../../lib/member/format';

const SEGMENTS = [
  { key: 'paidAmount', label: 'Paid', cls: 'bg-green-700' },
  { key: 'pendingAmount', label: 'Pending verification', cls: 'bg-yellow-400' },
  { key: 'dueAmount', label: 'Due', cls: 'bg-red-400' },
];

export default function ContributionChart({ data }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!data?.length) return <section className="rounded-3xl border border-green-100 bg-white shadow-sm"><EmptyState icon={BarChart3} title="No contribution data yet" description="Your monthly chart will appear once contributions are recorded." /></section>;

  const max = Math.max(...data.map((d) => d.requiredAmount), 1);
  const ticks = [1, 0.5, 0];

  return (
    <section aria-labelledby="chart-title" className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="chart-title" className="text-base font-bold text-slate-900">Monthly payments</h2>
        <ul className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          {SEGMENTS.map((s) => <li key={s.key} className="flex items-center gap-1.5"><span className={`h-2.5 w-2.5 rounded-sm ${s.cls}`} />{s.label}</li>)}
        </ul>
      </div>

      <div className="relative mt-6 h-56 pl-12">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 flex items-center" style={{ bottom: `${t * 100}%` }} aria-hidden="true">
            <span className="w-10 pr-2 text-right text-[11px] font-semibold text-slate-400">{formatTaka(max * t)}</span>
            <span className="h-px flex-1 bg-green-100" />
          </div>
        ))}
        <ul className="relative flex h-full items-stretch gap-1.5 sm:gap-3">
          {data.map((d) => {
            const label = `${monthName(d.month)} ${d.year}: ${formatTaka(d.paidAmount)} paid, ${formatTaka(d.pendingAmount)} pending, ${formatTaka(d.dueAmount)} due`;
            return (
              <li key={`${d.year}-${d.month}`} className="group relative flex-1">
                <div className="flex h-full flex-col-reverse gap-px" role="img" aria-label={label} title={label}>
                  {SEGMENTS.map((s) => d[s.key] > 0 && (
                    <div key={s.key} className={`w-full rounded-[3px] ${s.cls} transition-[height] duration-700 ease-out motion-reduce:transition-none`} style={{ height: grown ? `${(d[s.key] / max) * 100}%` : '0%' }} />
                  ))}
                </div>
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 text-center text-[11px] font-semibold leading-tight text-slate-500">
                  {monthShort(d.month)}
                  {(d.month === 1 || d === data[0]) && <span className="block text-[10px] font-medium text-slate-400">{d.year}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-8" />
    </section>
  );
}
