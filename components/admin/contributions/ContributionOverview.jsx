/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  Wallet,
  CircleDollarSign,
  Clock,
  AlertCircle,
  Users,
} from "lucide-react";

import { contributionsApi } from "@/services/admin/contributionsApi";

const currentYear = new Date().getFullYear();

const initialSummary = {
  total_contributions: 0,
  total_required: 0,
  total_waived: 0,
  total_paid: 0,
  total_pending: 0,
  total_due: 0,
};

function formatMoney(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

function getMemberName(member) {
  return (
    member?.full_name || member?.name || member?.user?.name || "Unknown Member"
  );
}

function StatusBadge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-700",
    partial: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    due: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function StatCard({ title, amount, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <div className="rounded-lg bg-green-50 p-2">
          <Icon size={20} className="text-green-700" />
        </div>
      </div>

      <h3 className="mt-4 text-2xl font-bold text-gray-900">
        {formatMoney(amount)}
      </h3>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

export default function ContributionOverview() {
  const [summary, setSummary] = useState(initialSummary);
  const [contributions, setContributions] = useState([]);

  const [year, setYear] = useState(String(currentYear));
  const [month, setMonth] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchContributions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {
        year,
        month,
        page,
        per_page: perPage,
      };

      const [summaryResult, contributionResult] = await Promise.all([
        contributionsApi.getSummary({ year, month }),
        contributionsApi.getContributions(filters),
      ]);

      setSummary(summaryResult.summary || initialSummary);

      setContributions(contributionResult.data || []);

      setPagination({
        current_page: contributionResult.current_page,
        last_page: contributionResult.last_page,
        per_page: contributionResult.per_page,
        total: contributionResult.total,
        from: contributionResult.from,
        to: contributionResult.to,
      });
    } catch (err) {
      setError(err.message || "Failed to load contributions.");
    } finally {
      setLoading(false);
    }
  }, [year, month, page, perPage]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Required"
          amount={summary.total_required}
          icon={Wallet}
          description={`${summary.total_contributions} contribution records`}
        />

        <StatCard
          title="Total Paid"
          amount={summary.total_paid}
          icon={CircleDollarSign}
          description="Approved payments"
        />

        <StatCard
          title="Total Pending"
          amount={summary.total_pending}
          icon={Clock}
          description="Waiting for approval"
        />

        <StatCard
          title="Total Due"
          amount={summary.total_due}
          icon={AlertCircle}
          description="Outstanding contribution amount"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          {/* Heading */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Contribution Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and monitor monthly member contributions.
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            {/* Year */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Year
              </label>

              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-600"
              >
                {Array.from({ length: 7 }, (_, index) => {
                  const value = currentYear - index;

                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Month */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Month
              </label>

              <select
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-600"
              >
                <option value="">All Months</option>

                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {new Date(2000, index).toLocaleString("en", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            {/* Per Page */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Entries
              </label>

              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-green-600"
              >
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchContributions}
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Member</th>
                <th className="px-5 py-4 font-semibold">Month</th>
                <th className="px-5 py-4 text-right font-semibold">Required</th>
                <th className="px-5 py-4 text-right font-semibold">Paid</th>
                <th className="px-5 py-4 text-right font-semibold">Pending</th>
                <th className="px-5 py-4 text-right font-semibold">Due</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading contribution records...
                  </td>
                </tr>
              ) : contributions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Users size={32} className="mx-auto mb-3 text-gray-300" />

                    <p className="font-medium text-gray-700">
                      No contributions found
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Try selecting another year or month.
                    </p>
                  </td>
                </tr>
              ) : (
                contributions.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {getMemberName(item.member)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Member ID: {item.member_id}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {item.month_name} {item.year}
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-gray-700">
                      {formatMoney(item.payable_amount)}
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-green-700">
                      {formatMoney(item.paid_amount)}
                    </td>

                    <td className="px-5 py-4 text-right text-yellow-700">
                      {formatMoney(item.pending_amount)}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-red-600">
                      {formatMoney(item.due_amount)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {pagination.from || 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {pagination.to || 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{" "}
              entries
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.last_page || 0 },
                (_, index) => index + 1,
              )
                .filter(
                  (pageNumber) =>
                    pageNumber === 1 ||
                    pageNumber === pagination.last_page ||
                    Math.abs(pageNumber - page) <= 1,
                )
                .map((pageNumber, index, pages) => (
                  <div key={pageNumber} className="flex items-center gap-2">
                    {index > 0 && pageNumber - pages[index - 1] > 1 && (
                      <span className="text-gray-400">...</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                        page === pageNumber
                          ? "bg-green-700 text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  </div>
                ))}

              <button
                type="button"
                disabled={page >= pagination.last_page}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!loading && contributions.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
            Showing {contributions.length} contribution records
          </div>
        )}
      </div>
    </div>
  );
}
