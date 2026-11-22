'use client';
import { useId } from 'react';
import { Lock } from 'lucide-react';
import { formatDate } from '../../lib/member/format';

const inputBase = 'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-700 focus:ring-4 focus:ring-green-700/15 disabled:bg-slate-50';

// One field that works in view mode (plain text), edit mode (input/select) and locked mode (read-only + lock icon).
export default function FormField({ label, name, value, onChange, error, hint, required, editing = true, locked = false, type = 'text', options, placeholder, autoComplete, inputMode, maxLength, className = '' }) {
  const id = useId();
  const readOnly = !editing || locked;
  const display = type === 'date' ? formatDate(value) : value || '—';

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {label}{required && editing && !locked && <span className="text-red-600" aria-hidden="true">*</span>}
        {locked && editing && <Lock className="h-3.5 w-3.5 text-slate-400" aria-label="Managed by the organisation" />}
      </label>
      {readOnly ? (
        <div id={id} className="min-h-[42px] rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800">{display}</div>
      ) : options ? (
        <select id={id} name={name} value={value || ''} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${inputBase} ${error ? 'border-red-400' : 'border-slate-200'}`}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={id} name={name} type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${inputBase} ${error ? 'border-red-400' : 'border-slate-200'}`} />
      )}
      {locked && editing && <p className="mt-1 text-xs text-slate-500">Contact the organisation office to change this.</p>}
      {hint && !error && !locked && editing && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
