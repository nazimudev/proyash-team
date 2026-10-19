"use client";

import Modal, {
  btnSecondary,
  btnDanger,
} from "@/components/admin/donation/Modal";
import { formatCurrency } from "@/lib/donationUtils";

export default function DeleteExpenseDialog({ expense, onCancel, onConfirm }) {
  return (
    <Modal
      open={!!expense}
      onClose={onCancel}
      title="Delete this expense?"
      footer={
        <>
          <button type="button" onClick={onCancel} className={btnSecondary}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={btnDanger}>
            Delete Expense
          </button>
        </>
      }
    >
      {expense ? (
        <div className="space-y-3 text-sm text-gray-700">
          <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 px-3">
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-gray-500">ID</dt>
              <dd className="font-medium text-gray-900">{expense.id}</dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-gray-500">Title</dt>
              <dd className="text-right font-medium text-gray-900">
                {expense.title}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-gray-500">Amount</dt>
              <dd className="font-medium text-gray-900">
                {formatCurrency(expense.amount)}
              </dd>
            </div>
          </dl>
          <p>
            This removes the expense from the list and the summary totals. This
            prototype keeps data in memory only, so reloading the page restores
            the demo records.
          </p>
        </div>
      ) : null}
    </Modal>
  );
}
