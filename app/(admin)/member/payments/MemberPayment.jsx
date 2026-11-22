"use client";
import { useEffect, useState } from "react";
import { BadgeCheck, Clock, Receipt, XCircle } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { getMemberPayments } from "@/services/memberPaymentService";
import { useMember } from "@/components/member/MemberProvider";
import PageHeader from "@/components/member/PageHeader";
import DashboardSummaryCard from "@/components/member/DashboardSummaryCard";
import PaymentHistoryTable from "@/components/member/PaymentHistoryTable";
import PaymentDetailsModal from "@/components/member/PaymentDetailsModal";
import FilterBar, {
  DateFilter,
  SelectFilter,
} from "@/components/member/FilterBar";
import Pagination from "@/components/member/Pagination";
import EmptyState from "@/components/member/EmptyState";
import ErrorState from "@/components/member/ErrorState";
import {
  SkeletonCards,
  SkeletonTable,
} from "@/components/member/LoadingSkeleton";

const EMPTY = {
  status: "",
  method: "",
  dateFrom: "",
  dateTo: "",
  search: "",
  page: 1,
};
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];
const METHOD_OPTIONS = [
  { value: "", label: "All methods" },
  ...["bKash", "Nagad", "Rocket", "Bank Transfer", "Cash"].map((m) => ({
    value: m,
    label: m,
  })),
];

export default function MemberPayment() {
  const { member } = useMember();
  const [filters, setFilters] = useState(EMPTY);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState(null);

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
    () => getMemberPayments({ ...filters, pageSize: 6 }),
    [
      filters.status,
      filters.method,
      filters.dateFrom,
      filters.dateTo,
      filters.search,
      filters.page,
    ],
  );

  const setFilter = (key) => (value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clear = () => {
    setSearchInput("");
    setFilters(EMPTY);
  };
  const hasFilters = !!(
    filters.status ||
    filters.method ||
    filters.dateFrom ||
    filters.dateTo ||
    searchInput
  );

  return (
    <>
      <PageHeader
        title="Payment history"
        description="Every payment you have submitted, with its verification status. A payment counts as paid only after the office verifies it."
      />

      {error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : (
        <>
          {loading && !data ? (
            <SkeletonCards count={4} className="grid-cols-2 lg:grid-cols-4" />
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <DashboardSummaryCard
                label="All payments"
                value={data.summary.total}
                icon={Receipt}
                tone="slate"
              />
              <DashboardSummaryCard
                label="Verified"
                value={data.summary.verified}
                icon={BadgeCheck}
                tone="green"
              />
              <DashboardSummaryCard
                label="Pending"
                value={data.summary.pending}
                icon={Clock}
                tone="yellow"
              />
              <DashboardSummaryCard
                label="Rejected"
                value={data.summary.rejected}
                icon={XCircle}
                tone="red"
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
              searchLabel="Search by transaction ID"
              searchPlaceholder="e.g. BK7340218"
              onClear={clear}
              canClear={hasFilters}
            >
              <SelectFilter
                label="Status"
                value={filters.status}
                onChange={setFilter("status")}
                options={STATUS_OPTIONS}
              />
              <SelectFilter
                label="Method"
                value={filters.method}
                onChange={setFilter("method")}
                options={METHOD_OPTIONS}
              />
              <DateFilter
                label="From date"
                value={filters.dateFrom}
                onChange={setFilter("dateFrom")}
              />
              <DateFilter
                label="To date"
                value={filters.dateTo}
                onChange={setFilter("dateTo")}
              />
            </FilterBar>

            {loading && !data ? (
              <SkeletonTable />
            ) : data.payments.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title={
                  hasFilters
                    ? "No payments match these filters"
                    : "No payments yet"
                }
                description={
                  hasFilters
                    ? "Check the transaction ID or widen the date range."
                    : "When you pay a monthly contribution, the payment will be listed here."
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
                <PaymentHistoryTable
                  payments={data.payments}
                  onView={setSelected}
                />
                <Pagination
                  pagination={data.pagination}
                  onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                  label="payments"
                />
              </div>
            )}
          </section>
        </>
      )}
      <PaymentDetailsModal
        payment={selected}
        member={member}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
