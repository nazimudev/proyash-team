/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  FolderKanban,
  Wallet,
  HandCoins,
  TrendingUp,
  Receipt,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";

import { fetchAdminDashboard } from "@/services/admin/adminDashboardService";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatNumber = (value) =>
  new Intl.NumberFormat("en-BD").format(Number(value || 0));

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusStyle = {
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  completed: "bg-blue-50 text-blue-700 ring-blue-600/20",
};


function StatusBadge({ status }) {
  const value = status || "unknown";

  const styles = {
    approved: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`
        inline-flex
        h-fit
        w-fit
        shrink-0
        self-start
        items-center
        justify-center
        rounded-full
        border
        px-3
        py-1.5
        text-[11px]
        font-medium
        leading-4
        capitalize
        ${styles[value] || "bg-gray-50 text-gray-600 border-gray-200"}
      `}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}


function StatCard({ title, value, description, icon: Icon, color }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
    teal: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </h3>

          <p className="mt-2 text-xs text-gray-500">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            colors[color]
          }`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
}

function ContributionChart({ data = [] }) {
  const maxValue = Math.max(
    1,
    ...data.map(
      (item) => Number(item.approved || 0) + Number(item.pending || 0),
    ),
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Monthly Contributions"
        description="Approved and pending contribution payments"
        action={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-green-600" />
              Approved
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              Pending
            </span>
          </div>
        }
      />

      <div className="flex h-56 items-end gap-2 border-b border-gray-100 pb-2 sm:gap-3">
        {data.map((item) => {
          const approved = Number(item.approved || 0);
          const pending = Number(item.pending || 0);

          const approvedHeight = (approved / maxValue) * 100;
          const pendingHeight = (pending / maxValue) * 100;

          return (
            <div
              key={item.month}
              className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              title={`${item.month_name}: Approved ${formatMoney(
                approved,
              )}, Pending ${formatMoney(pending)}`}
            >
              <div className="flex h-45 w-full max-w-8 flex-col justify-end overflow-hidden rounded-t-md bg-gray-50">
                <div
                  className="w-full rounded-t-sm bg-amber-400 transition-all duration-300 group-hover:bg-amber-500"
                  style={{ height: `${pendingHeight}%` }}
                />
                <div
                  className="w-full bg-green-600 transition-all duration-300 group-hover:bg-green-700"
                  style={{ height: `${approvedHeight}%` }}
                />
              </div>

              <span className="text-[10px] font-medium text-gray-400 sm:text-xs">
                {item.month_name?.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
        <span>
          Approved:{" "}
          {formatMoney(
            data.reduce((sum, item) => sum + Number(item.approved || 0), 0),
          )}
        </span>
        <span>
          Pending:{" "}
          {formatMoney(
            data.reduce((sum, item) => sum + Number(item.pending || 0), 0),
          )}
        </span>
      </div>
    </div>
  );
}

function RecentApplications({ applications = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Recent Applications"
        description="Latest membership requests"
        action={<UserPlus size={19} className="text-gray-400" />}
      />

      {applications.length === 0 ? (
        <EmptyState message="No pending applications found." />
      ) : (
        <div className="divide-y divide-gray-100">
          {applications.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-700">
                {(member.full_name_bn || member.user?.name || "M").charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {member.full_name_bn || member.user?.name || "Unknown member"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {member.mobile_number || member.user?.email || "—"}
                </p>
              </div>

              <StatusBadge status={member.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentDonations({ donations = [] }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Recent Donations"
        description="Latest donation records"
        action={<HeartHandshake size={19} className="text-gray-400" />}
      />

      {donations.length === 0 ? (
        <EmptyState message="No donations found." />
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HandCoins size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {donation.full_name || "Anonymous"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {formatDate(donation.donation_date || donation.created_at)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">
                  {formatMoney(donation.amount)}
                </p>
                <StatusBadge status={donation.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentPayments({ payments = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5">
        <SectionHeader
          title="Recent Contribution Payments"
          description="Latest member contribution transactions"
          action={<Receipt size={19} className="text-gray-400" />}
        />
      </div>

      {payments.length === 0 ? (
        <div className="px-5 pb-5">
          <EmptyState message="No contribution payments found." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold">Transaction</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/70">
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-800">
                    {payment.member?.user?.name ||
                      payment.member?.full_name_bn ||
                      "Member"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {payment.transaction_id || "—"}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {formatDate(payment.payment_date || payment.created_at)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                    {formatMoney(payment.amount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RecentActivities({ activities = [] }) {
  const icons = {
    donation: HeartHandshake,
    contribution: HandCoins,
    application: UserPlus,
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <SectionHeader
        title="Recent Activities"
        description="Latest updates across the organization"
        action={<Activity size={19} className="text-gray-400" />}
      />

      {activities.length === 0 ? (
        <EmptyState message="No recent activities found." />
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = icons[activity.type] || Activity;

            return (
              <div key={`${activity.type}-${index}`} className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                  <Icon size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {activity.name} · {formatMoney(activity.amount)}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-400">
                    {formatDate(activity.date)}
                  </p>
                </div>

                <StatusBadge status={activity.status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center text-center">
      <Activity size={24} className="mb-2 text-gray-300" />
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-20 rounded-2xl bg-gray-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-gray-100" />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-gray-100" />
    </div>
  );
}

export default function DashboardOverview() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (selectedYear, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      setError("");

      const result = await fetchAdminDashboard(selectedYear);

      setDashboard(result);
    } catch (err) {
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(year);
  }, [year, loadDashboard]);

  if (loading && !dashboard) {
    return (
      <div className="p-4 sm:p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="m-4 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-600" size={30} />
        <h2 className="font-semibold text-red-800">
          Dashboard could not be loaded
        </h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => loadDashboard(year)}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const members = summary.members || {};
  const projects = summary.projects || {};
  const donations = summary.donations || {};
  const contributions = summary.contributions || {};
  const expenses = summary.expenses || {};

  const stats = [
    {
      title: "Total Members",
      value: formatNumber(members.total),
      description: `${formatNumber(members.active)} active members`,
      icon: Users,
      color: "green",
    },
    {
      title: "Pending Applications",
      value: formatNumber(members.pending_applications),
      description: "Waiting for review",
      icon: UserPlus,
      color: "orange",
    },
    {
      title: "Total Projects",
      value: formatNumber(projects.total),
      description: `${formatNumber(projects.active)} currently active`,
      icon: FolderKanban,
      color: "purple",
    },
    {
      title: "Total Donations",
      value: formatMoney(donations.total_amount),
      description: `${formatNumber(donations.approved_count)} approved donations`,
      icon: Wallet,
      color: "blue",
    },
    {
      title: "Total Contributions",
      value: formatMoney(contributions.total_paid),
      description: "Approved payments",
      icon: HandCoins,
      color: "teal",
    },
    {
      title: "Pending Contributions",
      value: formatMoney(contributions.total_pending),
      description: "Awaiting verification",
      icon: Clock,
      color: "orange",
    },
    {
      title: "Total Expenses",
      value: formatMoney(expenses.total_amount),
      description: "All recorded expenses",
      icon: Receipt,
      color: "red",
    },
    {
      title: "Outstanding Due",
      value: formatMoney(contributions.total_due),
      description: "Remaining contribution amount",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Proyash Management
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {`Welcome back! Here is what's happening with your organization.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <CalendarDays size={17} className="text-gray-400" />

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-sm font-medium text-gray-700 outline-none"
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => loadDashboard(year, true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Refresh failed: {error}. Showing the last successfully loaded data.
          </div>
        )}

        {/* Stats */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
              Organization Summary
            </h2>
            <span className="text-xs text-gray-400">Live database data</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </section>

        {/* Secondary summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-green-700 p-5 text-white shadow-sm">
            <p className="text-sm text-green-100">
              Total Required Contributions
            </p>
            <h3 className="mt-3 text-2xl font-bold">
              {formatMoney(contributions.total_required)}
            </h3>
            <p className="mt-2 text-xs text-green-100">For {year}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Waived Contributions</p>
            <h3 className="mt-3 text-2xl font-bold text-gray-900">
              {formatMoney(contributions.total_waived)}
            </h3>
            <p className="mt-2 text-xs text-gray-400">Approved waivers</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Donations</p>
            <h3 className="mt-3 text-2xl font-bold text-amber-600">
              {formatMoney(donations.pending_amount)}
            </h3>
            <p className="mt-2 text-xs text-gray-400">
              {formatNumber(donations.pending_count)} pending records
            </p>
          </div>
        </section>

        {/* Chart */}
        <ContributionChart data={dashboard?.monthly_contributions || []} />

        {/* Recent applications and donations */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <RecentApplications
            applications={dashboard?.recent_applications || []}
          />

          <RecentDonations donations={dashboard?.recent_donations || []} />
        </section>

        {/* Payments */}
        <RecentPayments
          payments={dashboard?.recent_contribution_payments || []}
        />

        {/* Activities */}
        <RecentActivities activities={dashboard?.recent_activities || []} />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-5 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Proyash Team. All rights
            reserved.
          </p>
          <p className="flex items-center gap-1">
            <CheckCircle2 size={13} className="text-green-600" />
            Dashboard connected to API
          </p>
        </div>
      </div>
    </div>
  );
}
