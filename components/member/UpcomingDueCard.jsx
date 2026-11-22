import Link from 'next/link';
import { CalendarCheck, PartyPopper } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatTaka, monthName } from '../../lib/member/format';

export default function UpcomingDueCard({ item }) {
  if (!item) {
    return (
      <section className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-800"><PartyPopper className="h-5 w-5" /></span>
        <h2 className="mt-4 text-base font-bold text-slate-900">You are all caught up</h2>
        <p className="mt-1 text-sm text-slate-500">There are no unpaid monthly contributions right now.</p>
      </section>
    );
  }
  const waiting = item.status === 'pending_verification';
  const amount = waiting ? item.pendingAmount : item.dueAmount;
  return (
    <section aria-labelledby="upcoming-title" className="rounded-3xl bg-green-800 p-6 text-white shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 id="upcoming-title" className="text-base font-bold">{waiting ? 'Waiting for verification' : 'Next contribution due'}</h2>
        <CalendarCheck className="h-5 w-5 text-green-200" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm text-green-100">{monthName(item.month)} {item.year}</p>
      <p className="text-4xl font-extrabold tracking-tight">{formatTaka(amount)}</p>
      <p className="mt-1 text-sm text-green-100">{waiting ? 'Submitted payment is being checked by the office.' : `Due by ${formatDate(item.dueDate)}`}</p>
      <div className="mt-3"><StatusBadge kind="contribution" status={item.status} /></div>
      <Link href={`/member/contributions?year=${item.year}&month=${item.month}`} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-green-900 transition hover:bg-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        View contribution details
      </Link>
    </section>
  );
}
