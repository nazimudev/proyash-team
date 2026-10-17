import MembershipField from "@/components/membership/MembershipField";
import CheckField from "@/components/membership/CheckField";
import { addressParts, sameAddressLabel } from "@/data/membership";

function Group({ legend, prefix, values, errors, onChange, disabled }) {
  return (
    <fieldset>
      <legend className="text-lg font-extrabold text-ink">{legend}</legend>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {addressParts.map(({ part, label, placeholder }) => (
          <MembershipField
            key={part}
            def={{ name: `${prefix}_${part}`, label, type: "text", required: true, placeholder, autoComplete: "off" }}
            value={values[`${prefix}_${part}`]}
            onChange={onChange}
            error={errors[`${prefix}_${part}`]}
            disabled={disabled}
          />
        ))}
      </div>
    </fieldset>
  );
}

/** While "same as permanent" is checked the present fields mirror the permanent ones (synced in the form's setter). */
export default function AddressInformationForm({ values, errors, onChange, onSameChange }) {
  return (
    <div className="space-y-10">
      <Group legend="Permanent address" prefix="permanent" values={values} errors={errors} onChange={onChange} />
      <div className="rounded-xl bg-mist p-4">
        <CheckField id="same_address" checked={values.same_address} onChange={onSameChange}>{sameAddressLabel}</CheckField>
      </div>
      <Group legend="Present address" prefix="present" values={values} errors={errors} onChange={onChange} disabled={values.same_address} />
    </div>
  );
}
