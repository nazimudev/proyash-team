"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  Clock,
  Wallet,
  PlusCircle,
} from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { getMemberContributions } from "@/services/memberContributionService";
import PageHeader from "@/components/member/PageHeader";
import DashboardSummaryCard from "@/components/member/DashboardSummaryCard";
import ContributionTable from "@/components/member/ContributionTable";
import FilterBar, { SelectFilter } from "@/components/member/FilterBar";
import SubmitContributionModal from "@/components/member/SubmitContributionModal";
import Pagination from "@/components/member/Pagination";
import EmptyState from "@/components/member/EmptyState";
import ErrorState from "@/components/member/ErrorState";
import {
  SkeletonCards,
  SkeletonTable,
} from "@/components/member/LoadingSkeleton";
import { MONTHS, formatTaka } from "@/lib/member/format";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "due", label: "Due" },
  { value: "partial", label: "Partial" },
  { value: "pending_verification", label: "Pending verification" },
];

function ContributionsContent() {
  const params = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    month: params.get("month") || "",
    year: params.get("year") || "",
    status: params.get("status") || "",
    search: "",
    page: 1,
  }));
  const [searchInput, setSearchInput] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(
      () =>
        setFilters((f) =>
          f.search === searchInput ? f : { ...f, search: searchInput, page: 1 },
        ),
      300,
    );
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, error, loading, reload } = useAsync(
    () => getMemberContributions({ ...filters, pageSize: 6 }),
    [filters.month, filters.year, filters.status, filters.search, filters.page],
  );

  const setFilter = (key) => (value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clear = () => {
    setSearchInput("");
    setFilters({ month: "", year: "", status: "", search: "", page: 1 });
  };
  const hasFilters = !!(
    filters.month ||
    filters.year ||
    filters.status ||
    searchInput
  );

  return (
    <>
      <PageHeader
        title="Monthly contributions"
        description="See which months are paid and which are still due. Only payments verified by the office count as paid."
      />

      <div className="mt-4 mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setSubmitOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900"
        >
          <PlusCircle size={18} />
          Submit Contribution
        </button>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          {loading && !data ? (
            <SkeletonCards count={4} className="grid-cols-2 lg:grid-cols-4" />
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <DashboardSummaryCard
                label="Total expected"
                value={formatTaka(data.summary.expectedAmount)}
                icon={Wallet}
                tone="slate"
              />
              <DashboardSummaryCard
                label="Total paid"
                value={formatTaka(data.summary.paidAmount)}
                hint={`${data.summary.paidMonths} months`}
                icon={Banknote}
                tone="green"
              />
              <DashboardSummaryCard
                label="Total due"
                value={formatTaka(data.summary.dueAmount)}
                hint={`${data.summary.dueMonths} months`}
                icon={CalendarDays}
                tone="red"
              />
              <DashboardSummaryCard
                label="Awaiting verification"
                value={formatTaka(data.summary.pendingAmount)}
                hint={`${data.summary.pendingMonths} months`}
                icon={Clock}
                tone="yellow"
              />
            </div>
          )}

          <section
            className="mt-6 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm"
            aria-busy={loading}
          >
            <FilterBar
              search={searchInput}
              onSearch={setSearchInput}
              searchLabel="Search"
              searchPlaceholder="e.g. Sep 2026"
              onClear={clear}
              canClear={hasFilters}
            >
              <SelectFilter
                label="Month"
                value={filters.month}
                onChange={setFilter("month")}
                options={[
                  { value: "", label: "All months" },
                  ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m })),
                ]}
              />
              <SelectFilter
                label="Year"
                value={filters.year}
                onChange={setFilter("year")}
                options={[
                  { value: "", label: "All years" },
                  ...(data?.filterOptions.years || []).map((y) => ({
                    value: String(y),
                    label: String(y),
                  })),
                ]}
              />
              <SelectFilter
                label="Status"
                value={filters.status}
                onChange={setFilter("status")}
                options={STATUS_OPTIONS}
              />
            </FilterBar>

            {loading && !data ? (
              <SkeletonTable />
            ) : data.records.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title={
                  hasFilters
                    ? "No months match these filters"
                    : "No contributions recorded yet"
                }
                description={
                  hasFilters
                    ? "Try a different month, year or status."
                    : "Your monthly contributions will appear here once the organisation records them."
                }
              >
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-900"
                  >
                    Clear filters
                  </button>
                )}
              </EmptyState>
            ) : (
              <div
                className={
                  loading
                    ? "opacity-60 transition-opacity"
                    : "transition-opacity"
                }
              >
                <ContributionTable
                  records={data.records}
                  summary={data.summary}
                />
                <Pagination
                  pagination={data.pagination}
                  onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                  label="months"
                />
              </div>
            )}
          </section>
        </>
      )}

      <SubmitContributionModal
        open={submitOpen}
        records={data?.records ?? []}
        onClose={() => setSubmitOpen(false)}
        onSuccess={reload}
      />
    </>
  );
}

export default function ContributionsPage() {
  return (
    <Suspense fallback={<SkeletonTable rows={6} />}>
      <ContributionsContent />
    </Suspense>
  );
}
