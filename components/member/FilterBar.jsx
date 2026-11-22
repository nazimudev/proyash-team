'use client';
import { Search, X } from 'lucide-react';

const control = 'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/15';

export function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="block min-w-[130px] flex-1 text-xs font-semibold text-slate-500">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${control} mt-1 w-full`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function DateFilter({ label, value, onChange }) {
  return (
    <label className="block min-w-[140px] flex-1 text-xs font-semibold text-slate-500">
      {label}
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={`${control} mt-1 w-full`} />
    </label>
  );
}

export default function FilterBar({ search, onSearch, searchLabel, searchPlaceholder, onClear, canClear, children }) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 p-5">
      <label className="block min-w-[200px] flex-[2] text-xs font-semibold text-slate-500">
        {searchLabel}
        <span className="relative mt-1 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={searchPlaceholder} className={`${control} w-full pl-9`} />
        </span>
      </label>
      {children}
      {canClear && (
        <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-50">
          <X className="h-4 w-4" /> Clear filters
        </button>
      )}
    </div>
  );
}
