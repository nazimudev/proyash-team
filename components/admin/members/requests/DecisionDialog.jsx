"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import ModalShell, {
  btnPrimary,
  btnSecondary,
  btnDanger,
  inputCls,
} from "./ModalShell";
import {
  validateRejectionReason,
  formatBdt,
  MEMBERSHIP_FEE_BDT,
} from "@/lib/memberRequestUtils";

function Body({
  type,
  application,
  busy,
  error,
  serverReasonError,
  onCancel,
  onConfirm,
}) {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(null);
  const approve = type === "approve";

  const submit = () => {
    if (!approve) {
      const msg = validateRejectionReason(reason);
      setReasonError(msg);
      if (msg) {
        document.getElementById("rq-reason")?.focus();
        return;
      }
    }
    onConfirm(reason.trim());
  };
  const shownReasonError = reasonError ?? serverReasonError;

  return (
    <ModalShell
      open
      onClose={onCancel}
      busy={busy}
      title={approve ? "Approve this application?" : "Reject this application?"}
      description={`${application.full_name_en} · ${application.id}`}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className={approve ? btnPrimary : btnDanger}
          >
            {busy
              ? approve
                ? "Approving…"
                : "Rejecting…"
              : approve
                ? "Approve Application"
                : "Reject Application"}
          </button>
        </>
      }
    >
      {approve ? (
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            Approving means this applicant has passed the initial membership
            information review.
          </p>
          <p>
            They then become eligible to pay the {formatBdt(MEMBERSHIP_FEE_BDT)}{" "}
            membership fee. Approval does <strong>not</strong> give member login
            access: access depends on the fee being confirmed through the
            separate payment verification.
          </p>
          <p className="text-gray-500">
            Notifying the applicant about the next step is handled by the
            backend. This page doesn&rsquo;t send messages itself.
          </p>
        </div>
      ) : (
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            A rejected applicant cannot become a member. The reason is stored
            privately and is visible only to authorized administrators.
          </p>
          <div>
            <label
              htmlFor="rq-reason"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Rejection reason <span className="text-red-600">*</span>
            </label>
            <textarea
              id="rq-reason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setReasonError(null);
              }}
              aria-invalid={shownReasonError ? true : undefined}
              aria-describedby={shownReasonError ? "rq-reason-err" : undefined}
              className={inputCls}
            />
            {shownReasonError ? (
              <p id="rq-reason-err" className="mt-1 text-xs text-red-700">
                {shownReasonError}
              </p>
            ) : null}
          </div>
        </div>
      )}
      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </ModalShell>
  );
}

export default function DecisionDialog({ decision, application, ...rest }) {
  if (!decision || !application) return null;
  return (
    <Body
      key={`${decision}-${application.id}`}
      type={decision}
      application={application}
      {...rest}
    />
  );
}
