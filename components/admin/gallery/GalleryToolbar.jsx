"use client";

import { Search, RotateCcw, LayoutGrid, List } from "lucide-react";
import { btnSecondary, inputCls } from "./ModalShell";
import { GALLERY_CATEGORIES } from "@/lib/galleryUtils";

export default function GalleryToolbar({ filters, onChange, onClear, hasFilters, view, onViewChange, matchCount, totalCount }) {
  const on = (key) => (e) => onChange(key, e.target.value);
  const viewBtn = (value, Icon, label) => (
    <button type="button" aria-pressed={view === value} aria-label={label} title={label} onClick={() => onViewChange(value)}
      className={`rounded-md p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600 ${view === value ? "bg-green-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
          <input type="search" aria-label="Search photos" value={filters.search} onChange={on("search")} placeholder="Search by title, description, or category" className={`${inputCls} pl-9`} />
        </div>
        <select aria-label="Category" value={filters.category} onChange={on("category")} className={`${inputCls} md:w-48`}>
          <option value="all">All Categories</option>
          {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Publication status" value={filters.status} onChange={on("status")} className={`${inputCls} md:w-40`}>
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600" aria-live="polite">{hasFilters ? `${matchCount} of ${totalCount} photos match` : `${totalCount} photo${totalCount === 1 ? "" : "s"}`}</p>
        <div className="flex items-center gap-2">
          {hasFilters ? <button type="button" onClick={onClear} className={`${btnSecondary} px-3 py-1.5`}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters</button> : null}
          <div role="group" aria-label="View" className="flex gap-1 rounded-lg border border-gray-200 p-1">
            {viewBtn("grid", LayoutGrid, "Grid view")}
            {viewBtn("list", List, "Compact list view")}
          </div>
        </div>
      </div>
    </div>
  );
}
