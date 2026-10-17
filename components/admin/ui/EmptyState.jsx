import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-base font-medium text-gray-900">{title}</h2>
      {description ? <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p> : null}
    </div>
  );
}
