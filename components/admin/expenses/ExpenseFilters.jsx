"use client";

import { Search, RotateCcw } from "lucide-react";
import { btnSecondary, inputCls } from "@/components/admin/donation/Modal";
import { EXPENSE_CATEGORIES, EXPENSE_TYPES, EXPENSE_PAYMENT_METHODS } from "@/data/expenseOptions";

export default function ExpenseFilters({ filters, onChange, onReset, projects, rangeError, hasFilters }) {
  const on = (key) => (e) => onChange(key, e.target.value);
  return (
    <div className="space-y-3 border-b border-gray-100 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
        <input type="search" aria-label="Search expenses" value={filters.search} onChange={on("search")}
          placeholder="Search by title, ID, paid-to name, or description" className={`${inputCls} pl-9`} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <select aria-label="Category" value={filters.category} onChange={on("category")} className={inputCls}>
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Expense type" value={filters.type} onChange={on("type")} className={inputCls}>
          <option value="all">All Types</option>
          {EXPENSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select aria-label="Project" value={filters.project} onChange={on("project")} className={inputCls}>
          <option value="all">All Projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Payment method" value={filters.method} onChange={on("method")} className={inputCls}>
          <option value="all">All Payment Methods</option>
          {EXPENSE_PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-xs text-gray-500">Start date
          <input type="date" value={filters.startDate} onChange={on("startDate")} className={`${inputCls} mt-1`} />
        </label>
        <label className="text-xs text-gray-500">End date
          <input type="date" value={filters.endDate} onChange={on("endDate")} className={`${inputCls} mt-1`} />
        </label>
        <button type="button" onClick={onReset} disabled={!hasFilters} className={btnSecondary}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
        </button>
      </div>
      {rangeError ? <p role="alert" className="text-xs text-red-700">{rangeError} The date filter is ignored until this is fixed.</p> : null}
    </div>
  );
}
