"use client";

import { FormSection, Field, ctl, controlCls } from "./ProjectFormFields";

export default function ProjectTimelineForm({ values, errors, onChange }) {
  const set = (k) => (e) => onChange(k, e.target.value);
  return (
    <FormSection title="Project Timeline" description="Planned dates. A project is never marked completed automatically because a date has passed.">
      <Field name="startDate" label="Start date" required error={errors.startDate}>
        <input {...ctl("startDate", errors)} type="date" value={values.startDate} onChange={set("startDate")} className={controlCls} />
      </Field>
      <Field name="endDate" label="Expected end date" required error={errors.endDate}>
        <input {...ctl("endDate", errors)} type="date" value={values.endDate} min={values.startDate || undefined} onChange={set("endDate")} className={controlCls} />
      </Field>
      {values.status === "Completed" ? (
        <Field name="actualCompletionDate" label="Actual completion date" error={errors.actualCompletionDate} hint="Optional.">
          <input {...ctl("actualCompletionDate", errors)} type="date" value={values.actualCompletionDate} onChange={set("actualCompletionDate")} className={controlCls} />
        </Field>
      ) : null}
    </FormSection>
  );
}
