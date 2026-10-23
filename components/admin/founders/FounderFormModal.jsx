"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, AlertCircle, Loader2 } from "lucide-react";
import ModalShell, { btnPrimary, btnSecondary, inputCls } from "./ModalShell";
import FounderPhoto from "./FounderPhoto";
import { LIMITS, PHOTO_MAX_BYTES, validateFounderForm } from "@/lib/founderUtils";

const ORDER = ["full_name_en", "full_name_bn", "designation", "photo", "biography", "education", "professional_experience", "community_involvement", "message_heading", "message", "status", "display_order", "confirmed"];
const ctl = (name, errors) => ({ id: `ff-${name}`, "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `ff-${name}-err` : undefined });

function Field({ name, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={`ff-${name}`} className="mb-1 block text-sm font-medium text-gray-700">{label} {required ? <span className="text-red-600" aria-hidden="true">*</span> : <span className="font-normal text-gray-400">(optional)</span>}</label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p id={`ff-${name}-err`} className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

const Group = ({ title, children }) => (
  <fieldset className="space-y-4"><legend className="mb-1 border-b border-gray-100 pb-1 text-sm font-semibold text-gray-900 w-full">{title}</legend>{children}</fieldset>
);

function FormBody({ mode, founder, initialValues, takenOrders, saving, notice, onCancel, onSubmit }) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);
  const isEdit = mode === "edit";
  const set = (k) => (e) => { setV((p) => ({ ...p, [k]: e.target.value })); setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er)); };

  useEffect(() => {
    if (!v.photoFile || !v.photoFile.type.startsWith("image/")) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(v.photoFile); // client-only; revoked when the file changes or the form closes
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [v.photoFile]);

  const existingPhoto = isEdit && !v.removePhoto ? founder.photo_url : null;
  const shownPhoto = previewUrl ?? existingPhoto;
  const hasPhoto = !!(v.photoFile || existingPhoto);

  const submit = (e) => {
    e.preventDefault();
    if (saving) return;
    const found = validateFounderForm(v, { takenOrders });
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) { document.getElementById(`ff-${first}`)?.focus(); return; }
    onSubmit(v);
  };

  const count = (k, max) => `${v[k].length} / ${max.toLocaleString("en-US")}`;

  return (
    <ModalShell open onClose={onCancel} busy={saving} size="xl" title={isEdit ? "Edit Founder Profile" : "Add Founder"}
      description="Enter only information that has been verified by the founder."
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
          <button type="submit" form="founder-form" disabled={saving} className={btnPrimary}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{v.photoFile ? "Uploading and saving…" : "Saving…"}</> : isEdit ? "Save Changes" : "Save Founder"}
          </button>
        </>
      }>
      <form id="founder-form" onSubmit={submit} noValidate className="space-y-7">
        <p className="text-xs text-gray-500"><span className="text-red-600">*</span> marks required fields. Everything else is optional.</p>

        <Group title="Personal Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="full_name_en" label="Full name (English)" required error={errors.full_name_en}>
              <input {...ctl("full_name_en", errors)} value={v.full_name_en} onChange={set("full_name_en")} disabled={saving} autoComplete="off" className={inputCls} />
            </Field>
            <Field name="full_name_bn" label="Full name (Bangla)" error={errors.full_name_bn}>
              <input {...ctl("full_name_bn", errors)} lang="bn" value={v.full_name_bn} onChange={set("full_name_bn")} disabled={saving} autoComplete="off" className={inputCls} />
            </Field>
          </div>
          <Field name="designation" label="Official designation" required error={errors.designation} hint="Enter only a verified designation, such as Founder or Co-Founder.">
            <input {...ctl("designation", errors)} list="founder-designations" value={v.designation} onChange={set("designation")} disabled={saving} className={inputCls} />
            <datalist id="founder-designations"><option value="Founder" /><option value="Co-Founder" /></datalist>
          </Field>

          <Field name="photo" label="Profile photo" error={errors.photo} hint={`JPG, PNG, or WebP up to ${PHOTO_MAX_BYTES / 1024 / 1024} MB. Leave it out until a verified photo is available.`}>
            <input {...ctl("photo", errors)} ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" disabled={saving} className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0] ?? null; if (f) { setV((p) => ({ ...p, photoFile: f, removePhoto: false })); setErrors((er) => ({ ...er, photo: undefined })); } e.target.value = ""; }} />
            <div className="flex flex-wrap items-center gap-4">
              {hasPhoto ? <FounderPhoto founder={founder ?? {}} src={shownPhoto} className="h-24 w-24 rounded-xl border border-gray-200" /> : null}
              <div className="space-y-2">
                {v.photoFile ? <p className="break-all text-sm text-gray-700">{v.photoFile.name}</p> : null}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={saving} className={`${btnSecondary} px-3 py-1.5`}>
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />{hasPhoto ? "Replace photo" : "Choose photo"}
                  </button>
                  {hasPhoto ? <button type="button" disabled={saving} className={`${btnSecondary} px-3 py-1.5`}
                    onClick={() => { setV((p) => ({ ...p, photoFile: null, removePhoto: true })); setErrors((er) => ({ ...er, photo: undefined })); }}>Remove photo</button> : null}
                </div>
              </div>
            </div>
          </Field>

          <Field name="biography" label="Short biography" error={errors.biography} hint={count("biography", LIMITS.biography)}>
            <textarea {...ctl("biography", errors)} rows={4} value={v.biography} onChange={set("biography")} disabled={saving} className={inputCls} />
          </Field>
          <Field name="education" label="Education" error={errors.education} hint={count("education", LIMITS.education)}>
            <textarea {...ctl("education", errors)} rows={2} value={v.education} onChange={set("education")} disabled={saving} className={inputCls} />
          </Field>
          <Field name="professional_experience" label="Professional experience" error={errors.professional_experience} hint={count("professional_experience", LIMITS.experience)}>
            <textarea {...ctl("professional_experience", errors)} rows={3} value={v.professional_experience} onChange={set("professional_experience")} disabled={saving} className={inputCls} />
          </Field>
          <Field name="community_involvement" label="Community involvement" error={errors.community_involvement} hint={count("community_involvement", LIMITS.community)}>
            <textarea {...ctl("community_involvement", errors)} rows={3} value={v.community_involvement} onChange={set("community_involvement")} disabled={saving} className={inputCls} />
          </Field>
        </Group>

        <Group title="Founder’s Message">
          <p className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">Write or paste only a message the founder supplied or approved, in their own voice. Do not publish a message that hasn&rsquo;t been verified.</p>
          <Field name="message_heading" label="Message heading" error={errors.message_heading}>
            <input {...ctl("message_heading", errors)} value={v.message_heading} onChange={set("message_heading")} disabled={saving} className={inputCls} />
          </Field>
          <Field name="message" label="Founder’s message" error={errors.message} hint={count("message", LIMITS.message)}>
            <textarea {...ctl("message", errors)} rows={6} value={v.message} onChange={set("message")} disabled={saving} className={inputCls} />
          </Field>
        </Group>

        <Group title="Publication Settings">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="status" label="Publication status" required>
              <select id="ff-status" value={v.status} onChange={set("status")} disabled={saving} className={inputCls}>
                <option value="draft">Draft (hidden from the public website)</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field name="display_order" label="Display order" required error={errors.display_order} hint="1 appears first.">
              <input {...ctl("display_order", errors)} inputMode="numeric" value={v.display_order} onChange={set("display_order")} disabled={saving} className={inputCls} />
            </Field>
          </div>
          {v.status === "published" ? (
            <div>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input {...ctl("confirmed", errors)} type="checkbox" checked={v.confirmed} onChange={(e) => { setV((p) => ({ ...p, confirmed: e.target.checked })); setErrors((er) => ({ ...er, confirmed: undefined })); }} disabled={saving} className="mt-0.5 h-4 w-4 accent-green-600" />
                I confirm that the founder supplied or approved this content.
              </label>
              {errors.confirmed ? <p id="ff-confirmed-err" className="mt-1 text-xs text-red-700">{errors.confirmed}</p> : null}
            </div>
          ) : null}
        </Group>

        {notice ? <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{notice}</p> : null}
      </form>
    </ModalShell>
  );
}

export default function FounderFormModal({ open, mode, ...rest }) {
  if (!open) return null;
  return <FormBody key={`${mode}-${rest.founder?.id ?? "new"}`} mode={mode} {...rest} />;
}
