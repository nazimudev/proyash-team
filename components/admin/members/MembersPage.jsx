"use client";

import { useMemo, useState } from "react";
import {
  Search,
  RotateCcw,
  Users,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import MembersTable from "./MembersTable";
import { adminMembers } from "@/data/adminMembers"; // FUTURE API: replace with members fetched from Laravel
import {
  PAGE_SIZE,
  EMPTY_MEMBER_FILTERS,
  filterMembers,
} from "@/lib/memberUtils";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20";
const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-60";

export default function MembersPage() {
  const [members] = useState(adminMembers);
  const [filters, setFilters] = useState(EMPTY_MEMBER_FILTERS);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterMembers(members, filters),
    [members, filters],
  );
  const hasFilters = filters.search.trim() !== "" || filters.status !== "all";
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const setFilter = (key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
    setPage(1);
  };
  const clear = () => {
    setFilters(EMPTY_MEMBER_FILTERS);
    setPage(1);
  };

  const countLabel = hasFilters
    ? `${filtered.length} of ${members.length} member${members.length === 1 ? "" : "s"}`
    : `${members.length} member${members.length === 1 ? "" : "s"}`;

  return (
    <div>
      <PageHeader
        title="All Members"
        description="View and manage registered members of Proyash Songgothon."
        action={
          <span className="self-start rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800 ring-1 ring-inset ring-green-200 sm:self-auto">
            {countLabel}
          </span>
        }
      />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Sample data only. These are fictional people, not real Proyash
        Songgothon members.
      </p>

      <section
        className="rounded-xl border border-gray-200 bg-white"
        aria-label="Members"
      >
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search members"
              value={filters.search}
              onChange={setFilter("search")}
              placeholder="Search by name, member ID, phone, or email"
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            aria-label="Status"
            value={filters.status}
            onChange={setFilter("status")}
            className={`${inputCls} sm:w-44`}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {hasFilters ? (
            <button type="button" onClick={clear} className={btn}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
            </button>
          ) : null}
        </div>

        {members.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Users className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-medium text-gray-900">
              No members yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Approved members will appear here once they have been added.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <SearchX className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-base font-medium text-gray-900">
              No members found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              No members match the current filters. Try a different search or
              status.
            </p>
            <button type="button" onClick={clear} className={`${btn} mt-4`}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
            </button>
          </div>
        ) : (
          <>
            <MembersTable members={rows} />
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {start + 1}–{start + rows.length} of {filtered.length}{" "}
                member{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-3">
                <span>
                  Page {safePage} of {totalPages}
                </span>
                <button
                  type="button"
                  className={btn}
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />{" "}
                  Previous
                </button>
                <button
                  type="button"
                  className={btn}
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                >
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
