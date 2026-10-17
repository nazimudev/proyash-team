import FormField, { inputClass, fieldAria } from "@/components/ui/FormField";

/** Renders one field from its definition in data/membership.js (text, date, tel, email or select). */
export default function MembershipField({ def, value, onChange, error, disabled = false }) {
  const aria = fieldAria(def.name, error, Boolean(def.hint));
  return (
    <FormField id={def.name} label={def.label} required={def.required} optional={!def.required} hint={def.hint} error={error}>
      {def.type === "select" ? (
        <select {...aria} value={value} disabled={disabled} onChange={(e) => onChange(def.name, e.target.value)} className={inputClass(error)}>
          <option value="">Select</option>
          {def.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          {...aria}
          type={def.type}
          value={value}
          disabled={disabled}
          lang={def.lang}
          autoComplete={def.autoComplete}
          placeholder={def.placeholder}
          onChange={(e) => onChange(def.name, e.target.value)}
          className={`${inputClass(error)} disabled:bg-paper disabled:text-muted`}
        />
      )}
    </FormField>
  );
}
