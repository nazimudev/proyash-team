function Group({ label, options, counts, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      {options.map((opt) => {
        const selected = value === opt.id;

        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              selected
                ? "border-forest bg-forest text-white"
                : "border-forest/20 bg-white text-ink hover:border-forest/50 hover:text-forest"
            }`}
          >
            {opt.name || opt.label}

            <span
              className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                selected ? "bg-white/20 text-white" : "bg-mist text-forest"
              }`}
            >
              {counts[opt.id] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectFilters({
  categories,
  statuses,
  categoryCounts,
  statusCounts,
  category,
  status,
  onCategory,
  onStatus,
  totalProjects = 0,
}) {
  const categoryOptions = [
    { id: "all", name: "All Categories" },
    ...categories,
  ];

  const statusOptions = [{ id: "all", name: "All Statuses" }, ...statuses];

  return (
    <div className="space-y-4">
      <Group
        label="Filter projects by category"
        options={categoryOptions}
        counts={{
          ...categoryCounts,
          all: totalProjects,
        }}
        value={category}
        onChange={onCategory}
      />
    </div>
  );
}
