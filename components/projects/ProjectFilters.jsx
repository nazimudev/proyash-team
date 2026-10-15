function Group({ label, options, counts, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              selected ? "border-forest bg-forest text-white" : "border-forest/20 bg-white text-ink hover:border-forest/50 hover:text-forest"
            }`}
          >
            {opt.label}
            <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${selected ? "bg-white/20 text-white" : "bg-mist text-forest"}`}>
              {counts[opt.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Category row + (optional) status row. Counts are the real number of results
 * if that option were chosen while the other filter stays as it is.
 */
export default function ProjectFilters({ categories, statuses, categoryCounts, statusCounts, category, status, onCategory, onStatus }) {
  if (categories.length === 0 && statuses.length === 0) return null;
  return (
    <div className="space-y-4">
      {categories.length > 0 && (
        <Group label="Filter projects by category" options={categories} counts={categoryCounts} value={category} onChange={onCategory} />
      )}
      {statuses.length > 0 && (
        <Group label="Filter projects by status" options={statuses} counts={statusCounts} value={status} onChange={onStatus} />
      )}
    </div>
  );
}
