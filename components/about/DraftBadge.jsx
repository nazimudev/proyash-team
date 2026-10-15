export default function DraftBadge({ children, tone = "light" }) {
  const styles =
    tone === "dark"
      ? "bg-amber-300/20 text-amber-200 ring-amber-300/40"
      : "bg-amber-100 text-amber-900 ring-amber-300 dark:bg-amber-400/15 dark:text-amber-200 dark:ring-amber-400/30";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ring-1 ring-inset ${styles}`}
    >
      {children}
    </span>
  );
}
