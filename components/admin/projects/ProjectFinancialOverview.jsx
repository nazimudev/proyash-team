import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/donationUtils";

export default function ProjectFinancialOverview({ financials: f }) {
  const over = f.overspend > 0;
  const width = Math.min(100, f.spentPercent);
  return (
    <section
      aria-labelledby="fin-title"
      className="rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="fin-title" className="text-sm font-semibold text-gray-900">
          Budget and Expense Overview
        </h2>
        <p className="text-xs text-gray-500">Project-linked expenses only</p>
      </div>

      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-gray-500">Total allocated budget</dt>
          <dd className="mt-0.5 text-lg font-semibold text-gray-900">
            {formatCurrency(f.budget)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">Total expenses</dt>
          <dd className="mt-0.5 text-lg font-semibold text-gray-900">
            {formatCurrency(f.expenses)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500">
            {over ? "Over budget by" : "Remaining budget"}
          </dt>
          <dd
            className={`mt-0.5 text-lg font-semibold ${over ? "text-red-700" : "text-green-700"}`}
          >
            {formatCurrency(over ? f.overspend : f.remaining)}
          </dd>
        </div>
      </dl>

      {f.budget > 0 ? (
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs text-gray-600">
            <span>{f.spentPercent.toFixed(1)}% of budget spent</span>
            {over ? (
              <span className="font-medium text-red-700">Budget exceeded</span>
            ) : null}
          </div>
          <div
            role="progressbar"
            aria-valuenow={Math.round(width)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Budget spent"
            className="h-3 overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className={`h-full rounded-full ${over ? "bg-red-600" : "bg-green-600"}`}
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-gray-500">
          No budget has been allocated yet, so there is no percentage to show.
        </p>
      )}
      {over ? (
        <p className="mt-3 flex items-start gap-2 text-xs text-red-700">
          <AlertTriangle
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          Expenses exceed the allocated budget. No remaining budget is
          available.
        </p>
      ) : null}
    </section>
  );
}
