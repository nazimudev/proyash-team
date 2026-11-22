import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-800"><Icon className="h-7 w-7" aria-hidden="true" /></span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
