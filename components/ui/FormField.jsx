/** Label + control slot + hint + inline error, wired with aria-describedby by the caller via `id`. */
export default function FormField({ id, label, required = false, optional = false, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-ink">
        {label}
        {required && <span aria-hidden="true" className="text-forest"> *</span>}
        {optional && <span className="font-semibold text-muted"> (optional)</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-[#b42318]">{error}</p>}
    </div>
  );
}

export const inputClass = (invalid) =>
  `block min-h-12 w-full rounded-lg border bg-white px-4 py-2.5 text-ink placeholder:text-muted/70 transition-colors focus:border-forest ${
    invalid ? "border-[#b42318]" : "border-forest/25"
  }`;

/** aria props for a control that has an optional hint and error. */
export const fieldAria = (id, error, hasHint = false) => ({
  id,
  "aria-invalid": error ? "true" : undefined,
  "aria-describedby": [hasHint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined,
});
