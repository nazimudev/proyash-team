"use client";

import { FormSection, Field, ctl, controlCls } from "./ProjectFormFields";
import { PROJECT_STATUSES } from "@/data/projectOptions";
import { progressLocked, LIMITS } from "@/lib/projectFormUtils";

export default function ProjectStatusForm({ values, errors, onChange }) {
  const set = (k) => (e) => onChange(k, e.target.value);
  const locked = progressLocked(values.status);
  const pct = Math.min(100, Math.max(0, Number(values.progress) || 0));
  return (
    <>
      <FormSection
        title="Project Status"
        description="New projects usually start as Planned at 0% progress."
      >
        <Field
          name="status"
          label="Initial status"
          required
          error={errors.status}
        >
          <select
            {...ctl("status", errors)}
            value={values.status}
            onChange={set("status")}
            className={controlCls}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field
          name="progress"
          label="Progress (%)"
          required
          error={errors.progress}
          hint={
            values.status === "Planned"
              ? "Fixed at 0% for planned projects."
              : values.status === "Completed"
                ? "Fixed at 100% for completed projects."
                : "Whole number from 0 to 100."
          }
        >
          <input
            {...ctl("progress", errors)}
            inputMode="numeric"
            value={values.progress}
            onChange={set("progress")}
            disabled={locked}
            className={controlCls}
          />
          <div
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress preview"
            className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className="h-full rounded-full bg-green-600"
              style={{ width: `${pct}%` }}
            />
          </div>
        </Field>
      </FormSection>

      <FormSection
        title="Additional Notes"
        description="For administrators only. Never shown on the public website."
      >
        <Field
          name="notes"
          label="Internal notes"
          wide
          error={errors.notes}
          hint={`Optional. ${values.notes.length} / ${LIMITS.notes}`}
        >
          <textarea
            {...ctl("notes", errors)}
            rows={4}
            value={values.notes}
            onChange={set("notes")}
            className={controlCls}
          />
        </Field>
      </FormSection>
    </>
  );
}
