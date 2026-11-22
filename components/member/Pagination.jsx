import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange, label = 'records' }) {
  if (!pagination || pagination.total === 0) return null;
  const { page, pageSize, total, totalPages } = pagination;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn = 'inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white';
  return (
    <nav aria-label="Pagination" className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
      <p className="text-sm text-slate-500">Showing <b className="text-slate-800">{from}–{to}</b> of <b className="text-slate-800">{total}</b> {label}</p>
      <div className="flex items-center gap-2">
        <button type="button" className={btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft className="h-4 w-4" /> Previous</button>
        <span className="px-2 text-sm font-semibold text-slate-600" aria-current="page">{page} / {totalPages}</span>
        <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next <ChevronRight className="h-4 w-4" /></button>
      </div>
    </nav>
  );
}
