"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";
import { useMember } from "@/components/member/MemberProvider";
import PageHeader from "@/components/member/PageHeader";
import MembershipCard from "@/components/member/MembershipCard";
import StatusBadge from "@/components/member/StatusBadge";
import ErrorState from "@/components/member/ErrorState";
import { SkeletonBlock } from "@/components/member/LoadingSkeleton";
import { formatDate } from "@/lib/member/format";

const STATUS_NOTE = {
  approved:
    "Your membership is active. Thank you for being part of Proyash Songgothon.",
  pending:
    "Your application is being reviewed. You will be able to see contributions once it is approved.",
  rejected:
    "Your application was not approved. Please contact the organisation office for details.",
  suspended:
    "Your membership is suspended. Please contact the organisation office to resolve this.",
};

export default function MemberShipView() {
  const { member, loading, error, refresh } = useMember();
  const [copied, setCopied] = useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(member.membershipId);
      setCopied(true);
      toast.success("Membership ID copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy. Select the ID and copy it manually.");
    }
  }

  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (loading && !member)
    return (
      <>
        <PageHeader title="My membership" />
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>
      </>
    );

  const rows = [
    ["English name", member.nameEn],
    ["Bangla name", member.nameBn],
    ["Email", member.email],
    ["Mobile number", member.mobile],
    ["Registered on", formatDate(member.registeredAt)],
    ["Approved on", formatDate(member.approvedAt)],
  ];

  return (
    <>
      <PageHeader
        title="My membership"
        description="Your official membership details as recorded by the organisation."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,28rem)_1fr]">
        <div className="space-y-4">
          <MembershipCard member={member} />
          <p className="rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm text-slate-600">
            {STATUS_NOTE[member.status]}
          </p>
        </div>

        <section
          aria-labelledby="details-title"
          className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
        >
          <h2 id="details-title" className="text-base font-bold text-slate-900">
            Membership details
          </h2>
          <dl className="mt-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-slate-500">Membership ID</dt>
              <dd className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <span className="font-mono">{member.membershipId}</span>
                <button
                  type="button"
                  onClick={copyId}
                  aria-label="Copy membership ID"
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-green-50 hover:text-green-800"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </dd>
            </div>
            {rows.map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 py-3"
              >
                <dt className="text-sm text-slate-500">{k}</dt>
                <dd className="break-all text-right text-sm font-semibold text-slate-900">
                  {v || "—"}
                </dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-slate-500">Membership status</dt>
              <dd>
                <StatusBadge kind="membership" status={member.status} />
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-slate-500">Membership fee</dt>
              <dd>
                <StatusBadge kind="fee" status={member.feeStatus} />
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
