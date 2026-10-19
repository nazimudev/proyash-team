"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import Modal, { btnPrimary, btnSecondary, btnDanger, inputCls } from "./Modal";
import { formatCurrency, donorLabel } from "@/lib/donationUtils";
import { methodLabel } from "@/lib/donationConfig";

const copy = {
  verify: { title: "Verify this donation?", confirm: "Verify Donation", busy: "Verifying…", cls: btnPrimary,
    note: "Confirm only after checking the payment against your records." },
  reject: { title: "Reject this donation?", confirm: "Reject Donation", busy: "Rejecting…", cls: btnDanger,
    note: "The submission stays in the list with a Rejected status. It is not deleted." },
  delete: { title: "Delete this donation record?", confirm: "Delete Donation", busy: "Deleting…", cls: btnDanger,
    note: "Deleting a donation record affects financial reporting." },
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function Body({ action, donation, busy, onCancel, onConfirm }) {
  const c = copy[action];
  const [reason, setReason] = useState("");
  return (
    <Modal open onClose={onCancel} busy={busy} title={c.title}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>Cancel</button>
          <button type="button" onClick={() => onConfirm(reason)} disabled={busy} className={c.cls}>{busy ? c.busy : c.confirm}</button>
        </>
      }>
      <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 px-3">
        <Row label="Donation ID" value={donation.id} />
        <Row label="Donor" value={donorLabel(donation.donor)} />
        <Row label="Amount" value={formatCurrency(donation.amount)} />
        {action === "verify" ? (
          <>
            <Row label="Payment method" value={methodLabel(donation.method)} />
            <Row label="Transaction ID" value={donation.transactionId ?? "None provided"} />
          </>
        ) : null}
      </dl>
      <p className="mt-3 text-sm text-gray-600">{c.note}</p>
      {action === "reject" ? (
        <label className="mt-3 block text-sm font-medium text-gray-700">
          Rejection reason (optional)
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={`${inputCls} mt-1 font-normal`} />
        </label>
      ) : null}
      {action === "delete" ? (
        <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Prototype only: this hides the record from the list and totals in this session. No server deletion happens.
            For real financial records, use archiving or voiding with an audit trail instead of permanent deletion.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}

export default function DonationConfirmDialog({ action, donation, busy, onCancel, onConfirm }) {
  if (!action || !donation) return null;
  return <Body key={`${action}-${donation.id}`} action={action} donation={donation} busy={busy} onCancel={onCancel} onConfirm={onConfirm} />;
}
