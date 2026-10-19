export const controlCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 disabled:bg-gray-50 disabled:text-gray-500 aria-invalid:border-red-500";

// Shared id and ARIA wiring so each control and its message stay linked.
export const ctl = (name, errors) => ({
  id: `mf-${name}`,
  "aria-invalid": errors[name] ? true : undefined,
  "aria-describedby": errors[name] ? `mf-${name}-err` : undefined,
});

export function FormSection({ title, description, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export const Grid = ({ children }) => (
  <div className="grid gap-5 sm:grid-cols-2">{children}</div>
);

export function Field({ name, label, required, error, hint, wide, children }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label
        htmlFor={`mf-${name}`}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
      {error ? (
        <p id={`mf-${name}-err`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
