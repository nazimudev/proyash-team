export default function StatCard({ label, value, icon: Icon, note }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold text-gray-900">{value}</p>
      {note ? <p className="mt-1 text-xs text-gray-400">{note}</p> : null}
    </div>
  );
}
