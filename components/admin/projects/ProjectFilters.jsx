"use client";

import { Search, RotateCcw } from "lucide-react";
import { btnSecondary, inputCls } from "@/components/admin/donation/Modal";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/data/projectsAdmin";
import { SORT_OPTIONS } from "@/lib/projectUtils";

export default function ProjectFilters({
  filters,
  onChange,
  onReset,
  hasFilters,
}) {
  const on = (key) => (e) => onChange(key, e.target.value);
  return (
    <div className="space-y-3 border-b border-gray-100 p-4">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Search projects"
          value={filters.search}
          onChange={on("search")}
          placeholder="Search by name, project ID, location, or responsible person"
          className={`${inputCls} pl-9`}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
        <select
          aria-label="Status"
          value={filters.status}
          onChange={on("status")}
          className={inputCls}
        >
          <option value="all">All Statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          aria-label="Category"
          value={filters.category}
          onChange={on("category")}
          className={inputCls}
        >
          <option value="all">All Categories</option>
          {PROJECT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort by"
          value={filters.sort}
          onChange={on("sort")}
          className={inputCls}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasFilters}
          className={btnSecondary}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
        </button>
      </div>
    </div>
  );
}
