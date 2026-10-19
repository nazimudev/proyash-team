"use client";

import { FormSection, Grid, Field, ctl, controlCls } from "./MemberFormFields";
import { ADDRESS_PARTS } from "@/lib/memberFormUtils";

const LABELS = {
  village: "Village",
  post_office: "Post office",
  upazila: "Upazila",
  district: "District",
};

function AddressGroup({ kind, title, values, errors, onChange, disabled }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-gray-900">
        {title}
      </legend>
      <Grid>
        {ADDRESS_PARTS.map((part) => {
          const name = `${kind}_${part}`;
          return (
            <Field
              key={name}
              name={name}
              label={LABELS[part]}
              required={!disabled}
              error={errors[name]}
            >
              <input
                {...ctl(name, errors)}
                value={values[name]}
                disabled={disabled}
                onChange={(e) => onChange(name, e.target.value)}
                className={controlCls}
              />
            </Field>
          );
        })}
      </Grid>
    </fieldset>
  );
}

export default function MemberAddressSection({
  values,
  errors,
  onChange,
  onSameChange,
}) {
  return (
    <FormSection
      title="Address Information"
      description="Permanent and present address of the member."
    >
      <div className="space-y-8">
        <AddressGroup
          kind="permanent"
          title="Permanent address"
          values={values}
          errors={errors}
          onChange={onChange}
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.sameAddress}
            onChange={(e) => onSameChange(e.target.checked)}
            className="h-4 w-4 accent-green-600"
          />
          Present address is the same as permanent address
        </label>
        <AddressGroup
          kind="present"
          title="Present address"
          values={values}
          errors={errors}
          onChange={onChange}
          disabled={values.sameAddress}
        />
      </div>
    </FormSection>
  );
}
