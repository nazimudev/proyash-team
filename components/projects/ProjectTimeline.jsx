/** Verified milestones only: start date, documented milestones, completion date. */
export default function ProjectTimeline({ project: p }) {
  const items = [
    p.startLabel && { key: "start", title: "Project start", dateLabel: p.startLabel },
    ...p.milestones.map((m, i) => ({ key: `m${i}`, ...m })),
    p.completionLabel && { key: "end", title: "Project completed", dateLabel: p.completionLabel },
  ].filter(Boolean);
  if (items.length === 0) return null;

  return (
    <ol className="border-l-2 border-forest/20">
      {items.map((item) => (
        <li key={item.key} className="relative pb-8 pl-8 last:pb-0">
          <span aria-hidden="true" className="absolute -left-[9px] top-1.5 size-4 rounded-full border-4 border-white bg-forest" />
          <p className="text-sm font-semibold text-muted">{item.dateLabel}</p>
          <h3 className="mt-0.5 font-extrabold text-ink">{item.title}</h3>
          {item.description && <p className="mt-1 text-muted">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
