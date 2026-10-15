/** Presentational category selector; state lives in GalleryBrowser. Counts come from the real dataset. */
export default function GalleryFilters({
  categories,
  counts,
  value,
  onChange,
}) {
  return (
    <div
      role="group"
      aria-label="Filter photos by category"
      className="flex flex-wrap gap-2"
    >
      {categories.map((cat) => {
        const selected = value === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(cat.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              selected
                ? "border-forest bg-forest text-white"
                : "border-forest/20 bg-white text-ink hover:border-forest/50 hover:text-forest"
            }`}
          >
            {cat.label}
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${selected ? "bg-white/20 text-white" : "bg-mist text-forest"}`}
            >
              {counts[cat.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
