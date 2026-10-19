"use client";

import Modal, { btnSecondary } from "./Modal";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, donorLabel } from "@/lib/donationUtils";
import { methodLabel } from "@/lib/donationConfig";

function Item({ label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">{children || <span className="text-gray-400">Not provided</span>}</dd>
    </div>
  );
}

export default function DonationDetailsDialog({ donation, projectName, onClose }) {
  const d = donation;
  return (
    <Modal open={!!d} onClose={onClose} size="lg" title={d ? `Donation ${d.id}` : ""}
      description="Sample prototype record"
      footer={<button type="button" onClick={onClose} className={btnSecondary}>Close</button>}>
      {d ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label="Donor">{donorLabel(d.donor)}{d.donor.isAnonymous ? " (anonymous)" : ""}</Item>
          <Item label="Status"><StatusBadge status={d.status} /></Item>
          <Item label="Phone">{d.donor.phone}</Item>
          <Item label="Email">{d.donor.email}</Item>
          <Item label="Amount"><span className="font-semibold">{formatCurrency(d.amount)}</span></Item>
          <Item label="Payment method">{methodLabel(d.method)}</Item>
          <Item label="Transaction ID">{d.transactionId}</Item>
          <Item label="Project / purpose">{projectName ?? "General Donation"}</Item>
          <Item label="Donation date">{formatDate(d.donationDate)}</Item>
          <Item label="Verification date">{d.verifiedAt ? formatDate(d.verifiedAt) : null}</Item>
          <Item label="Verified by">{d.verifiedBy}</Item>
          {d.status === "rejected" ? <Item label="Rejection reason">{d.rejectionReason}</Item> : null}
          <Item label="Donor message" wide>{d.message}</Item>
          <Item label="Internal administrator note" wide>{d.adminNote}</Item>
          <Item label="Receipt / payment proof" wide>
            {d.proofFileName ? `${d.proofFileName} (preview needs backend file storage)` : null}
          </Item>
        </dl>
      ) : null}
    </Modal>
  );
}
