import { Eye } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatTaka, monthName } from '../../lib/member/format';

const th = 'px-4 py-3 text-left text-xs font-bold text-slate-500';
const td = 'whitespace-nowrap px-4 py-3.5 text-sm text-slate-700';

// `onView` adds a details button (Payment History page). Omit it for a read-only table (dashboard).
export default function PaymentHistoryTable({ payments, onView }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-190">
          <caption className="sr-only">Payment records</caption>
          <thead className="bg-green-50/60"><tr>
            <th scope="col" className={th}>Payment ID</th><th scope="col" className={th}>Month</th><th scope="col" className={`${th} text-right`}>Amount</th>
            <th scope="col" className={th}>Method</th><th scope="col" className={th}>Transaction ID</th><th scope="col" className={th}>Date</th>
            <th scope="col" className={th}>Status</th>{onView && <th scope="col" className={th}><span className="sr-only">Actions</span></th>}
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id} className="transition hover:bg-green-50/40">
                <td className={`${td} font-bold text-slate-900`}>{p.id}</td>
                <td className={td}>{monthName(p.month)} {p.year}</td>
                <td className={`${td} text-right font-bold text-slate-900`}>{formatTaka(p.amount)}</td>
                <td className={td}>{p.method}</td>
                <td className={`${td} font-mono text-xs`}>{p.transactionId || p.receiptNo || '—'}</td>
                <td className={td}>{formatDate(p.paymentDate)}</td>
                <td className={td}><StatusBadge kind="payment" status={p.status} /></td>
                {onView && <td className={`${td} text-right`}><button type="button" onClick={() => onView(p)} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-green-800 transition hover:bg-green-100"><Eye className="h-4 w-4" />View</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {payments.map((p) => (
          <li key={p.id} className="space-y-2 px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div><p className="text-sm font-bold text-slate-900">{monthName(p.month)} {p.year}</p><p className="text-xs text-slate-500">{p.id} · {formatDate(p.paymentDate)}</p></div>
              <p className="text-base font-extrabold text-slate-900">{formatTaka(p.amount)}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-600">{p.method} · <span className="font-mono">{p.transactionId || p.receiptNo || '—'}</span></p>
              <StatusBadge kind="payment" status={p.status} />
            </div>
            {onView && <button type="button" onClick={() => onView(p)} className="inline-flex items-center gap-1.5 text-xs font-bold text-green-800"><Eye className="h-4 w-4" />View details</button>}
          </li>
        ))}
      </ul>
    </>
  );
}
