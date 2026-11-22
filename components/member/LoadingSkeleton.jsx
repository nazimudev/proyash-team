export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-green-900/10 ${className}`} aria-hidden="true" />;
}

export function SkeletonCards({ count = 5, className = 'grid-cols-2 md:grid-cols-3 xl:grid-cols-5' }) {
  return (
    <div className={`grid gap-4 ${className}`} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-green-100 bg-white p-5">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="mt-4 h-4 w-24" />
          <Skeleton className="mt-2 h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3 p-5" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );
}

export function SkeletonBlock({ className = 'h-64' }) {
  return <Skeleton className={`w-full rounded-2xl ${className}`} />;
}
