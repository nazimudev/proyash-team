'use client';
import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({ label, value, onChange, error, autoComplete, hint, className = '' }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
          className={`w-full rounded-xl border bg-white py-2.5 pl-3.5 pr-11 text-sm text-slate-900 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/15 ${error ? 'border-red-400' : 'border-slate-200'}`} />
        <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-700">
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
