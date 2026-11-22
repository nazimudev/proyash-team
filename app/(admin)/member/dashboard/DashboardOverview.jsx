"use client";
import Link from "next/link";
import {
  Banknote,
  CalendarCheck,
  CircleCheck,
  Receipt,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import { getMemberDashboard } from "@/services/memberDashboardService";
import { useMember } from "@/components/member/MemberProvider";
import DashboardSummaryCard from "@/components/member/DashboardSummaryCard";
import ContributionProgress from "@/components/member/ContributionProgress";
import ContributionChart from "@/components/member/ContributionChart";
import UpcomingDueCard from "@/components/member/UpcomingDueCard";
import PaymentHistoryTable from "@/components/member/PaymentHistoryTable";
import EmptyState from "@/components/member/EmptyState";
import ErrorState from "@/components/member/ErrorState";
import {
  SkeletonBlock,
  SkeletonCards,
} from "@/components/member/LoadingSkeleton";
import { firstName, formatTaka } from "@/lib/member/format";
import userData from "@/hooks/userData";

export default function DashboardOverview() {
  const { member } = useMember();
  const { data, error, loading, reload } = useAsync(
    () => getMemberDashboard(),
    [],
  );

  const user = userData();

  const greeting = (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Welcome back, {user.name}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here is where your contributions stand today.
      </p>
    </div>
  );

  if (error)
    return (
      <>
        {greeting}
        <ErrorState error={error} onRetry={reload} />
      </>
    );
  if (loading && !data) {
    return (
      <>
        {greeting}
        <SkeletonCards />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <SkeletonBlock className="h-80 lg:col-span-2" />
          <SkeletonBlock className="h-80" />
        </div>
      </>
    );
  }

  const { summary, monthlyChart, recentPayments, upcomingDue } = data;
  return (
    <>
      {greeting}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <DashboardSummaryCard
          label="Total contribution"
          value={formatTaka(summary.expectedAmount)}
          hint={`${monthlyChart.length} months`}
          icon={Wallet}
          tone="slate"
        />
        <DashboardSummaryCard
          label="Total paid"
          value={formatTaka(summary.paidAmount)}
          hint="Verified payments only"
          icon={Banknote}
          tone="green"
        />
        <DashboardSummaryCard
          label="Total due"
          value={formatTaka(summary.dueAmount)}
          hint={
            summary.pendingAmount
              ? `+ ${formatTaka(summary.pendingAmount)} awaiting verification`
              : "Nothing overdue"
          }
          icon={AlertCircle}
          tone="red"
        />
        <DashboardSummaryCard
          label="Paid months"
          value={summary.paidMonths}
          hint="Fully paid"
          icon={CircleCheck}
          tone="green"
        />
        <DashboardSummaryCard
          label="Due months"
          value={summary.dueMonths}
          hint="Need payment"
          icon={CalendarCheck}
          tone="red"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContributionChart data={monthlyChart} />
        </div>
        <div className="space-y-6">
          <ContributionProgress summary={summary} />
          <UpcomingDueCard item={upcomingDue} />
        </div>
      </div>

      <section
        aria-labelledby="recent-title"
        className="mt-6 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 id="recent-title" className="text-base font-bold text-slate-900">
            Recent payments
          </h2>
          <Link
            href="/member/payments"
            className="text-sm font-bold text-green-800 hover:underline"
          >
            View all
          </Link>
        </div>
        {recentPayments.length ? (
          <PaymentHistoryTable payments={recentPayments} />
        ) : (
          <EmptyState
            icon={Receipt}
            title="No payments yet"
            description="Payments you make will be listed here once they are recorded."
          />
        )}
      </section>
    </>
  );
}
