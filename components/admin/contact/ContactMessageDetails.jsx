'use client';

// src/components/admin/contact/ContactMessageDetails.jsx
import { Archive, CheckCheck, Mail, MailOpen, Trash2, X } from 'lucide-react';
import { StatusBadge } from './ContactMessageTable';

export default function ContactMessageDetails({ message, busy, onClose, onStatus, onDelete }) {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="msg-subject">
      <div className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="msg-subject" className="text-lg font-semibold text-gray-900">{message.subject}</h2>
            <div className="mt-1"><StatusBadge status={message.status} /></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-gray-500">Name</dt><dd className="font-medium">{message.name}</dd></div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd><a className="font-medium text-[#166534] hover:underline" href={`mailto:${message.email}`}>{message.email}</a></dd>
          </div>
          {message.phone && (
            <div><dt className="text-gray-500">Phone</dt><dd><a className="font-medium hover:underline" href={`tel:${message.phone.replace(/[^\d+]/g, '')}`}>{message.phone}</a></dd></div>
          )}
          <div><dt className="text-gray-500">Received</dt><dd className="font-medium">{new Date(message.created_at).toLocaleString('en-GB')}</dd></div>
          {message.ip_address && <div><dt className="text-gray-500">IP address</dt><dd className="font-medium">{message.ip_address}</dd></div>}
        </dl>

        {/* React escapes the text, so whitespace-pre-wrap is safe here. */}
        <p className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-4 text-sm text-gray-800">{message.message}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {message.status !== 'read' && (
            <button disabled={busy} onClick={() => onStatus('read')} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60">
              <MailOpen className="h-4 w-4" aria-hidden="true" /> Mark as read
            </button>
          )}
          {message.status !== 'unread' && (
            <button disabled={busy} onClick={() => onStatus('unread')} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60">
              <Mail className="h-4 w-4" aria-hidden="true" /> Mark as unread
            </button>
          )}
          {message.status !== 'replied' && (
            <button disabled={busy} onClick={() => onStatus('replied')} className="inline-flex items-center gap-1.5 rounded-lg bg-[#166534] px-3 py-2 text-sm text-white hover:bg-[#14532d] disabled:opacity-60">
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark as replied
            </button>
          )}
          {message.status !== 'archived' && (
            <button disabled={busy} onClick={() => onStatus('archived')} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60">
              <Archive className="h-4 w-4" aria-hidden="true" /> Archive
            </button>
          )}
          <button disabled={busy} onClick={onDelete} className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
