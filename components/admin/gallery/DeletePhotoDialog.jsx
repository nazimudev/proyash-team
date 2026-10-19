"use client";

import { AlertTriangle, AlertCircle } from "lucide-react";
import ModalShell, { btnSecondary, btnDanger } from "./ModalShell";
import GalleryImage from "./GalleryImage";
import { PhotoStatusBadge } from "./GalleryImageCard";

export default function DeletePhotoDialog({ photo, busy, error, onCancel, onConfirm }) {
  return (
    <ModalShell open={!!photo} onClose={onCancel} busy={busy} title="Delete this photo?"
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={busy} className={btnSecondary}>Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={btnDanger}>{busy ? "Deleting…" : "Delete Photo"}</button>
        </>
      }>
      {photo ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
            <GalleryImage photo={photo} className="h-16 w-20 shrink-0 rounded-md" />
            <div className="min-w-0"><p className="truncate text-sm font-medium text-gray-900">{photo.title}</p><div className="mt-1 flex items-center gap-2"><span className="text-xs text-gray-500">{photo.category}</span><PhotoStatusBadge status={photo.status} /></div></div>
          </div>
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Deleting this photo may remove it from the public website. Only continue if you are sure.</p>
          </div>
          {error ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{error}</p> : null}
        </div>
      ) : null}
    </ModalShell>
  );
}
