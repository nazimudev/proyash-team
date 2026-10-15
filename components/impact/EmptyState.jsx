/** Calm placeholder used wherever verified records are not yet available. */
export default function EmptyState({
  icon: Icon,
  title,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-12 text-center ${className}`}
    >
      {Icon && (
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      {title && (
        <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
      )}
      <p className="mx-auto mt-2 max-w-xl text-muted">{children}</p>
    </div>
  );
}
