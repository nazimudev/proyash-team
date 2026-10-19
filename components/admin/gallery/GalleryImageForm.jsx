"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary, inputCls } from "./ModalShell";
import { GALLERY_CATEGORIES, PHOTO_MAX_BYTES, validatePhotoForm, todayIso } from "@/lib/galleryUtils";

const FIELD_ORDER = ["image", "title", "category", "description", "activity_date", "alt_text"];
const ctl = (name, errors) => ({ id: `gf-${name}`, "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `gf-${name}-err` : undefined });

function Field({ name, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={`gf-${name}`} className="mb-1 block text-sm font-medium text-gray-700">{label}{required ? <span className="text-red-600"> *</span> : null}</label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p id={`gf-${name}-err`} className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function FormBody({ mode, photo, initialValues, savingAs, notice, onCancel, onSubmit }) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBroken, setPreviewBroken] = useState(false);
  const inputRef = useRef(null);
  const isEdit = mode === "edit";
  const saving = savingAs !== null;
  const set = (k) => (e) => { setV((p) => ({ ...p, [k]: e.target.value })); setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er)); };

  useEffect(() => {
    setPreviewBroken(false);
    if (!v.imageFile || !v.imageFile.type.startsWith("image/")) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(v.imageFile); // client-only; revoked when the file changes or the form closes
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [v.imageFile]);

  const chooseFile = (file) => { setV((p) => ({ ...p, imageFile: file })); setErrors((er) => ({ ...er, image: undefined })); };
  const onDrop = (e) => { e.preventDefault(); setDragging(false); if (saving) return; const f = e.dataTransfer.files?.[0]; if (f) chooseFile(f); };

  const submit = (status) => (e) => {
    e?.preventDefault();
    if (saving) return;
    const found = validatePhotoForm(v, { today: todayIso(), requireImage: !isEdit });
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) { document.getElementById(`gf-${first}`)?.focus(); return; }
    onSubmit(v, isEdit ? v.status : status);
  };

  const shownSrc = previewUrl ?? (isEdit && !v.imageFile ? photo.image_url : null);

  return (
    <ModalShell open onClose={onCancel} busy={saving} size="lg" title={isEdit ? "Edit Photo Details" : "Add New Photo"}
      description={isEdit ? "Change the details. The image is only replaced if you choose a new one." : "Upload a photo of a Proyash activity."}
      footer={
        isEdit ? (
          <>
            <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
            <button type="submit" form="gallery-form" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save Changes"}</button>
          </>
        ) : (
          <>
            <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
            <button type="button" onClick={submit("draft")} disabled={saving} className={btnSecondary}>{savingAs === "draft" ? "Saving…" : "Save as Draft"}</button>
            <button type="button" onClick={submit("published")} disabled={saving} className={btnPrimary}>{savingAs === "published" ? "Publishing…" : "Publish Photo"}</button>
          </>
        )
      }>
      <form id="gallery-form" onSubmit={submit(v.status)} noValidate className="space-y-5">
        <Field name="image" label="Image" required={!isEdit} error={errors.image} hint={`JPG, PNG, or WebP up to ${PHOTO_MAX_BYTES / 1024 / 1024} MB.${isEdit ? " Leave empty to keep the current image." : ""}`}>
          <label htmlFor="gf-image" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm focus-within:ring-2 focus-within:ring-green-600/40 ${dragging ? "border-green-600 bg-green-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}>
            <UploadCloud className="h-6 w-6 text-gray-400" aria-hidden="true" />
            <span className="text-gray-700"><span className="font-medium text-green-700">Choose an image</span> or drag and drop it here</span>
            <input {...ctl("image", errors)} ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" disabled={saving} className="sr-only"
              onChange={(e) => { chooseFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
          </label>
          {shownSrc ? (
            <div className="mt-3 flex flex-wrap items-start gap-4">
              {!previewBroken ? <img src={shownSrc} alt="Image preview" onError={() => setPreviewBroken(true)} className="h-32 w-44 rounded-lg border border-gray-200 object-cover" />
                : <p className="flex items-center gap-2 text-sm text-red-700"><AlertCircle className="h-4 w-4" aria-hidden="true" />This file can&rsquo;t be previewed as an image.</p>}
              <div className="space-y-2">
                <p className="break-all text-sm text-gray-700">{v.imageFile ? v.imageFile.name : "Current image"}</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => inputRef.current?.click()} disabled={saving} className={`${btnSecondary} px-3 py-1.5`}>Replace</button>
                  {v.imageFile ? <button type="button" onClick={() => chooseFile(null)} disabled={saving} className={`${btnSecondary} px-3 py-1.5`}>Remove</button> : null}
                </div>
              </div>
            </div>
          ) : null}
        </Field>

        <Field name="title" label="Title" required error={errors.title}>
          <input {...ctl("title", errors)} value={v.title} onChange={set("title")} disabled={saving} className={inputCls} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="category" label="Category" required error={errors.category}>
            <select {...ctl("category", errors)} value={v.category} onChange={set("category")} disabled={saving} className={inputCls}>
              <option value="">Select a category</option>
              {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field name="activity_date" label="Activity date" error={errors.activity_date} hint="Optional.">
            <input {...ctl("activity_date", errors)} type="date" value={v.activity_date} onChange={set("activity_date")} disabled={saving} className={inputCls} />
          </Field>
        </div>
        <Field name="description" label="Description" error={errors.description} hint={`Optional. ${v.description.length} / 1000`}>
          <textarea {...ctl("description", errors)} rows={3} value={v.description} onChange={set("description")} disabled={saving} className={inputCls} />
        </Field>
        <Field name="alt_text" label="Alt text" error={errors.alt_text} hint="Recommended. Describe what the photo shows for people using screen readers.">
          <input {...ctl("alt_text", errors)} value={v.alt_text} onChange={set("alt_text")} disabled={saving} className={inputCls} />
        </Field>
        {isEdit ? (
          <Field name="status" label="Publication status">
            <select id="gf-status" value={v.status} onChange={set("status")} disabled={saving} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        ) : null}
        {notice ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{notice}</p> : null}
      </form>
    </ModalShell>
  );
}

export default function GalleryImageForm({ open, mode, ...rest }) {
  if (!open) return null;
  return <FormBody key={`${mode}-${rest.photo?.id ?? "new"}`} mode={mode} {...rest} />;
}
