import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry, title = 'We could not load this page' }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl border border-red-100 bg-white px-6 py-14 text-center shadow-sm">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600"><AlertCircle className="h-7 w-7" aria-hidden="true" /></span>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{error?.message || 'Something went wrong. Please try again.'}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  );
}
