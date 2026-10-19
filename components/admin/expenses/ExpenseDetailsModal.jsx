"use client";

import Modal, { btnSecondary } from "@/components/admin/donation/Modal";
import { TypeBadge, CategoryBadge } from "./ExpensesTable";
import { formatCurrency, formatDate } from "@/lib/donationUtils";

function Item({ label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">{children || <span className="text-gray-400">Not provided</span>}</dd>
    </div>
  );
}

export default function ExpenseDetailsModal({ expense, projectName, onClose }) {
  const x = expense;
  return (
    <Modal open={!!x} onClose={onClose} size="lg" title={x ? x.title : ""} description={x ? x.id : ""}
      footer={<button type="button" onClick={onClose} className={btnSecondary}>Close</button>}>
      {x ? (
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label="Category"><CategoryBadge category={x.category} /></Item>
          <Item label="Expense type"><TypeBadge type={x.type} /></Item>
          <Item label="Linked project">{x.projectId ? projectName ?? x.projectId : "General Expense (no project)"}</Item>
          <Item label="Amount"><span className="font-semibold">{formatCurrency(x.amount)}</span></Item>
          <Item label="Expense date">{formatDate(x.date)}</Item>
          <Item label="Payment method">{x.paymentMethod}</Item>
          <Item label="Paid to">{x.paidTo}</Item>
          <Item label="Receipt or invoice">{x.receiptName ? `${x.receiptName} (file not stored in this prototype)` : null}</Item>
          <Item label="Description" wide>{x.description}</Item>
        </dl>
      ) : null}
    </Modal>
  );
}
