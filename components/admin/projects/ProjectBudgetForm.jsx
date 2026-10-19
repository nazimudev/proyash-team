"use client";

import { Info } from "lucide-react";
import { FormSection, Field, ctl, controlCls } from "./ProjectFormFields";
import { FUNDING_SOURCES } from "@/data/projectOptions";
import { formatCurrency } from "@/lib/donationUtils";
import { LIMITS } from "@/lib/projectFormUtils";

export default function ProjectBudgetForm({ values, errors, onChange }) {
  const set = (k) => (e) => onChange(k, e.target.value);
  const n = Number(values.budget);
  const preview = values.budget.trim() && Number.isFinite(n) && n > 0 ? formatCurrency(n) : null;
  return (
    <FormSection title="Budget & Funding" description="The planned budget. Actual spending is recorded separately.">
      <Field name="budget" label="Allocated budget (৳ BDT)" required error={errors.budget} hint={preview ? `Budget: ${preview}` : "Enter the amount in Taka."}>
        <input {...ctl("budget", errors)} inputMode="decimal" value={values.budget} onChange={set("budget")} placeholder="0" className={controlCls} />
      </Field>
      <Field name="fundingSource" label="Funding source" hint="Optional.">
        <select {...ctl("fundingSource", errors)} value={values.fundingSource} onChange={set("fundingSource")} className={controlCls}>
          <option value="">Select a funding source</option>
          {FUNDING_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field name="fundingDetails" label="Funding details" wide error={errors.fundingDetails}
        hint={`Optional. ${values.fundingDetails.length} / ${LIMITS.fundingDetails}`}>
        <input {...ctl("fundingDetails", errors)} value={values.fundingDetails} onChange={set("fundingDetails")} className={controlCls} />
      </Field>
      <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 sm:col-span-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <p>Recorded expenses start at {formatCurrency(0)}. No expense is created with the project. Expenses are added in Expenses Management and linked to this project.</p>
      </div>
    </FormSection>
  );
}
