export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p> : null}
      </div>
      {action ?? null}
    </div>
  );
}
