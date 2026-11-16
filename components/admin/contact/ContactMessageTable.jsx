'use client';

// src/components/admin/contact/ContactMessageTable.jsx
import { Eye, Trash2 } from 'lucide-react';

export const STATUS_STYLES = {
  unread: 'bg-amber-100 text-amber-800',
  read: 'bg-gray-100 text-gray-700',
  replied: 'bg-green-100 text-green-800',
  archived: 'bg-slate-100 text-slate-600',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[status] || STATUS_STYLES.read}`}>
      {status}
    </span>
  );
}

const fmt = (iso) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export default function ContactMessageTable({ messages, onView, onDelete }) {
  return (
    <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {messages.map((m) => (
        <li key={m.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <button type="button" onClick={() => onView(m)} className="min-w-0 flex-1 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className={m.status === 'unread' ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}>{m.name}</span>
              <StatusBadge status={m.status} />
            </div>
            <p className={`mt-0.5 truncate text-sm ${m.status === 'unread' ? 'font-semibold' : ''}`}>{m.subject}</p>
            <p className="truncate text-sm text-gray-500">{m.email} · {fmt(m.created_at)}</p>
          </button>

          <div className="flex gap-2">
            <button type="button" onClick={() => onView(m)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50">
              <Eye className="h-4 w-4" aria-hidden="true" /> View
            </button>
            <button type="button" onClick={() => onDelete(m)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
