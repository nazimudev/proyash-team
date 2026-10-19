"use client";

import { Pencil } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary } from "./ModalShell";
import GalleryImage from "./GalleryImage";
import { PhotoStatusBadge } from "./GalleryImageCard";
import { formatDate } from "@/lib/galleryUtils";

function Item({ label, children }) {
  return <div><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-0.5 break-words text-sm text-gray-900">{children || <span className="text-gray-400">Not provided</span>}</dd></div>;
}

export default function GalleryImageModal({ photo, onClose, onEdit }) {
  return (
    <ModalShell open={!!photo} onClose={onClose} size="xl" title={photo?.title ?? ""}
      footer={photo ? (
        <>
          <button type="button" onClick={onClose} className={btnSecondary}>Close</button>
          <button type="button" onClick={() => onEdit(photo)} className={btnPrimary}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</button>
        </>
      ) : null}>
      {photo ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <GalleryImage photo={photo} fit="object-contain" className="max-h-[60vh] min-h-[10rem] w-full" />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Item label="Category">{photo.category}</Item>
            <Item label="Status"><PhotoStatusBadge status={photo.status} /></Item>
            <Item label="Activity date">{formatDate(photo.activity_date)}</Item>
            <Item label="Alt text">{photo.alt_text}</Item>
            <div className="sm:col-span-2"><Item label="Description">{photo.description}</Item></div>
          </dl>
        </div>
      ) : null}
    </ModalShell>
  );
}
