"use client";

import { CheckCircle2, XCircle, Wallet } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary, btnDanger } from "./ModalShell";
import { Avatar, StatusBadge } from "./RequestsTable";
import {
  formatDate,
  formatBdt,
  MEMBERSHIP_FEE_BDT,
} from "@/lib/memberRequestUtils";

function Item({ label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">
        {children || <span className="text-gray-400">Not provided</span>}
      </dd>
    </div>
  );
}

const Section = ({ title, children }) => (
  <section>
    <h3 className="mb-3 border-b border-gray-100 pb-1 text-sm font-semibold text-gray-900">
      {title}
    </h3>
    <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
  </section>
);

const accepted = (iso) => (iso ? `Accepted on ${formatDate(iso)}` : null);

function FeePanel({ status }) {
  // Payment is a SEPARATE requirement from approval. This panel only explains the stage; it never records payment.
  const copy = {
    pending:
      "Not payable yet. The applicant becomes eligible to pay the fee only after approval.",
    approved:
      "Awaiting membership fee. Payment is verified through the separate payment workflow. Until the backend confirms it, the applicant has no member login access.",
    rejected: "Not applicable. This application was rejected.",
  }[status];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <Wallet
        className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
        aria-hidden="true"
      />
      <div className="text-sm text-gray-700">
        <p className="font-medium text-gray-900">
          Membership fee: {formatBdt(MEMBERSHIP_FEE_BDT)}
        </p>
        <p className="mt-0.5">{copy}</p>
      </div>
    </div>
  );
}

export default function ApplicationDetailDialog({
  application: a,
  mode,
  onClose,
  onSwitchToReview,
  onDecide,
}) {
  const pending = a?.status === "pending";
  const footer = !a ? null : mode === "review" && pending ? (
    <>
      <button type="button" onClick={onClose} className={btnSecondary}>
        Close
      </button>
      <button
        type="button"
        onClick={() => onDecide("reject", a)}
        className={btnDanger}
      >
        <XCircle className="h-4 w-4" aria-hidden="true" />
        Reject Application
      </button>
      <button
        type="button"
        onClick={() => onDecide("approve", a)}
        className={btnPrimary}
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Approve Application
      </button>
    </>
  ) : (
    <>
      <button type="button" onClick={onClose} className={btnSecondary}>
        Close
      </button>
      {pending ? (
        <button type="button" onClick={onSwitchToReview} className={btnPrimary}>
          Review Request
        </button>
      ) : null}
    </>
  );

  return (
    <ModalShell
      open={!!a}
      onClose={onClose}
      size="xl"
      footer={footer}
      title={
        a ? (mode === "review" ? "Review Request" : "Application Details") : ""
      }
      description={a ? `${a.full_name_en} · ${a.id}` : ""}
    >
      {a ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar app={a} size="h-16 w-16" />
            <div>
              <p className="text-base font-semibold text-gray-900">
                {a.full_name_en}
              </p>
              <p className="text-sm text-gray-600" lang="bn">
                {a.full_name_bn}
              </p>
              <div className="mt-1">
                <StatusBadge status={a.status} />
              </div>
            </div>
          </div>

          <Section title="Personal Information">
            <Item label="Full name (Bangla)">
              <span lang="bn">{a.full_name_bn}</span>
            </Item>
            <Item label="Full name (English)">{a.full_name_en}</Item>
            <Item label="Father's name">{a.father_name}</Item>
            <Item label="Mother's name">{a.mother_name}</Item>
            <Item label="Date of birth">{formatDate(a.date_of_birth)}</Item>
            <Item label="Nationality">{a.nationality}</Item>
            <Item label="Religion">{a.religion}</Item>
            <Item label="Gender">{a.gender}</Item>
            <Item label="Marital status">{a.marital_status}</Item>
            <Item label="Occupation">{a.occupation}</Item>
            <Item label="Educational qualification">
              {a.educational_qualification}
            </Item>
            <Item label="Blood group">{a.blood_group}</Item>
            <Item label="Mobile number">{a.mobile_number}</Item>
            <Item label="Email">{a.email}</Item>
            <Item label="Profile photo">{a.photo ? "Uploaded" : null}</Item>
          </Section>

          <Section title="Permanent Address">
            <Item label="Village">{a.permanent_village}</Item>
            <Item label="Post office">{a.permanent_post_office}</Item>
            <Item label="Upazila">{a.permanent_upazila}</Item>
            <Item label="District">{a.permanent_district}</Item>
          </Section>

          <Section title="Present Address">
            <Item label="Village">{a.present_village}</Item>
            <Item label="Post office">{a.present_post_office}</Item>
            <Item label="Upazila">{a.present_upazila}</Item>
            <Item label="District">{a.present_district}</Item>
          </Section>

          <Section title="Application Information">
            <Item label="Application ID">{a.id}</Item>
            <Item label="Submitted">{formatDate(a.submitted_at)}</Item>
            <Item label="Current status">
              <StatusBadge status={a.status} />
            </Item>
            <Item label="Membership agreement">
              {accepted(a.agreement_accepted_at) ?? "Not recorded"}
            </Item>
            <Item label="Privacy policy">
              {accepted(a.privacy_accepted_at) ?? "Not recorded"}
            </Item>
            <Item label="Terms">
              {accepted(a.terms_accepted_at) ?? "Not recorded"}
            </Item>
            {a.reviewed_at ? (
              <Item label="Reviewed by">{a.reviewed_by_name}</Item>
            ) : null}
            {a.reviewed_at ? (
              <Item label="Reviewed on">{formatDate(a.reviewed_at)}</Item>
            ) : null}
            {a.status === "rejected" ? (
              <Item label="Rejection reason (administrators only)" wide>
                {a.rejection_reason}
              </Item>
            ) : null}
          </Section>

          <FeePanel status={a.status} />
        </div>
      ) : null}
    </ModalShell>
  );
}
