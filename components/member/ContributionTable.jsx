import StatusBadge from "./StatusBadge";
import { formatDate, formatTaka, monthName } from "@/lib/member/format";

const th = "px-4 py-3 text-left text-xs font-bold text-slate-500";
const td = "whitespace-nowrap px-4 py-3.5 text-sm text-slate-700";

function Note({ r }) {
  return r.pendingAmount > 0 ? (
    <span className="mt-0.5 block text-xs font-medium text-yellow-700">
      {formatTaka(r.pendingAmount)} awaiting verification
    </span>
  ) : null;
}

export default function ContributionTable({ records, summary }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-205">
          <caption className="sr-only">Monthly contributions</caption>
          <thead className="bg-green-50/60">
            <tr>
              <th scope="col" className={th}>
                Month
              </th>
              <th scope="col" className={th}>
                Year
              </th>
              <th scope="col" className={`${th} text-right`}>
                Required
              </th>
              <th scope="col" className={`${th} text-right`}>
                Paid
              </th>
              <th scope="col" className={`${th} text-right`}>
                Due
              </th>
              <th scope="col" className={th}>
                Payment date
              </th>
              <th scope="col" className={th}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r.id} className="transition hover:bg-green-50/40">
                <td className={`${td} font-bold text-slate-900`}>
                  {monthName(r.month)}
                </td>
                <td className={td}>{r.year}</td>
                <td className={`${td} text-right`}>
                  {formatTaka(r.requiredAmount)}
                </td>
                <td className={`${td} text-right font-semibold text-green-800`}>
                  {formatTaka(r.paidAmount)}
                </td>
                <td
                  className={`${td} text-right font-semibold ${r.dueAmount ? "text-red-600" : "text-slate-400"}`}
                >
                  {formatTaka(r.dueAmount)}
                </td>
                <td className={td}>{formatDate(r.paymentDate)}</td>
                <td className={td}>
                  <StatusBadge kind="contribution" status={r.status} />
                  <Note r={r} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-green-100 bg-green-50/40">
            <tr>
              <th
                scope="row"
                colSpan={2}
                className="px-4 py-3.5 text-left text-sm font-extrabold text-slate-900"
              >
                Total (all matching months)
              </th>
              <td className="px-4 py-3.5 text-right text-sm font-extrabold text-slate-900">
                {formatTaka(summary.expectedAmount)}
              </td>
              <td className="px-4 py-3.5 text-right text-sm font-extrabold text-green-800">
                {formatTaka(summary.paidAmount)}
              </td>
              <td className="px-4 py-3.5 text-right text-sm font-extrabold text-red-600">
                {formatTaka(summary.dueAmount)}
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {records.map((r) => (
          <li key={r.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-extrabold text-slate-900">
                  {monthName(r.month)} {r.year}
                </p>
                <p className="text-xs text-slate-500">
                  Paid on {formatDate(r.paymentDate)}
                </p>
              </div>
              <StatusBadge kind="contribution" status={r.status} />
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Required</dt>
                <dd className="font-bold text-slate-900">
                  {formatTaka(r.requiredAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Paid</dt>
                <dd className="font-bold text-green-800">
                  {formatTaka(r.paidAmount)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Due</dt>
                <dd
                  className={`font-bold ${r.dueAmount ? "text-red-600" : "text-slate-400"}`}
                >
                  {formatTaka(r.dueAmount)}
                </dd>
              </div>
            </dl>
            <Note r={r} />
          </li>
        ))}
      </ul>
    </>
  );
}
