import { fieldAria } from "@/components/ui/FormField";

/** A required/optional checkbox with a visible label and an inline error. */
export default function CheckField({ id, checked, onChange, error, children }) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-ink">
        <input {...fieldAria(id, error)} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-5 shrink-0 accent-[#166534]" />
        <span>{children}</span>
      </label>
      {error && <p id={`${id}-error`} className="mt-1.5 pl-8 text-sm font-semibold text-[#b42318]">{error}</p>}
    </div>
  );
}
