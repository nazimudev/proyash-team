"use client";

import { AlertTriangle, AlertCircle } from "lucide-react";
import ModalShell, { btnSecondary, btnDanger } from "./ModalShell";

export default function DeleteMessageDialog({ message, busy, error, onCancel, onConfirm }) {
  return (
    <ModalShell open={!!message} onClose={onCancel} busy={busy} title="Delete Contact Message?"
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={btnDanger}>{busy ? "Deleting…" : "Delete Message"}</button>
        </>
      }>
      {message ? (
        <div className="space-y-4 text-sm text-gray-700">
          <p className="rounded-lg border border-gray-200 p-3"><span className="font-medium text-gray-900">{message.subject}</span><br /><span className="text-gray-500">From {message.name}</span></p>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>This message will be permanently deleted if the backend implements permanent deletion. This action may not be reversible. To keep it, use Archive instead.</p>
          </div>
          {error ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</p> : null}
        </div>
      ) : null}
    </ModalShell>
  );
}
