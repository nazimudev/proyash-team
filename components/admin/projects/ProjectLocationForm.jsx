"use client";

import { FormSection, Field, ctl, controlCls } from "./ProjectFormFields";

export default function ProjectLocationForm({ values, errors, onChange }) {
  const set = (k) => (e) => onChange(k, e.target.value);
  return (
    <FormSection title="Location & Responsibility" description="Where the project happens and who is in charge.">
      <Field name="location" label="Project location" required error={errors.location} wide>
        <input {...ctl("location", errors)} value={values.location} onChange={set("location")} placeholder="For example, Madhupur, Tangail" className={controlCls} />
      </Field>
      <Field name="responsiblePerson" label="Responsible person" hint="Optional. Type a name; there is no members list to choose from yet.">
        <input {...ctl("responsiblePerson", errors)} value={values.responsiblePerson} onChange={set("responsiblePerson")} className={controlCls} />
      </Field>
      <Field name="contact" label="Contact phone" error={errors.contact} hint="Optional.">
        <input {...ctl("contact", errors)} type="tel" value={values.contact} onChange={set("contact")} className={controlCls} />
      </Field>
    </FormSection>
  );
}
