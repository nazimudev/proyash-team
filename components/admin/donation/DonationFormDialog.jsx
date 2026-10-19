"use client";

import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import Modal, { btnPrimary, btnSecondary, inputCls } from "./Modal";
import { DONATION_METHODS, TRANSACTION_ID_REQUIRED_METHODS, PROOF_MAX_BYTES } from "@/lib/donationConfig";
import { validateDonationForm, todayIso } from "@/lib/donationUtils";

function Field({ label, error, hint, required, id, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}{required ? <span className="text-red-600"> *</span> : null}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p id={`${id}-err`} className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function FormBody({ mode, initialValues, projects, saving, donation, onCancel, onSubmit }) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [ack, setAck] = useState(false);
  const fileRef = useRef(null);
  const isEdit = mode === "edit";
  const anon = v.donorType === "anonymous";
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const a11y = (k) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `f-${k}-err` : undefined });
  const requireAck = isEdit && donation?.status === "verified";
  const txRequired = TRANSACTION_ID_REQUIRED_METHODS.includes(v.method);

  const submit = (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = validateDonationForm(v, { today: todayIso(), requireAck, ack });
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(v);
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0] ?? null;
    setV((p) => ({ ...p, proofFile: f, proofFileName: f ? f.name : p.proofFileName }));
  };

  return (
    <Modal open onClose={onCancel} busy={saving} size="lg"
      title={isEdit ? `Edit ${donation.id}` : "Add Donation"}
      description={isEdit ? "Changes keep the donation ID and verification status." : "Record a donation received by the organization."}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
          <button type="submit" form="donation-form" disabled={saving} className={btnPrimary}>
            {saving ? "Saving…" : isEdit ? "Save changes" : "Save Donation"}
          </button>
        </>
      }>
      <form id="donation-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-gray-700">Donor type</legend>
          <div className="flex gap-4 text-sm">
            {[["named", "Named Donor"], ["anonymous", "Anonymous Donor"]].map(([val, label]) => (
              <label key={val} className="flex items-center gap-2">
                <input type="radio" name="donorType" value={val} checked={v.donorType === val} onChange={set("donorType")} className="accent-green-600" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {!anon ? (
          <>
            <div className="sm:col-span-2">
              <Field id="f-name" label="Donor name" required error={errors.name}>
                <input id="f-name" value={v.name} onChange={set("name")} className={inputCls} {...a11y("name")} />
              </Field>
            </div>
            <Field id="f-phone" label="Phone number" error={errors.phone}>
              <input id="f-phone" type="tel" value={v.phone} onChange={set("phone")} className={inputCls} {...a11y("phone")} />
            </Field>
            <Field id="f-email" label="Email address" error={errors.email}>
              <input id="f-email" type="email" value={v.email} onChange={set("email")} className={inputCls} {...a11y("email")} />
            </Field>
          </>
        ) : null}

        <Field id="f-amount" label="Donation amount (৳ BDT)" required error={errors.amount}>
          <input id="f-amount" inputMode="decimal" value={v.amount} onChange={set("amount")} placeholder="0" className={inputCls} {...a11y("amount")} />
        </Field>
        <Field id="f-method" label="Payment method" required error={errors.method}>
          <select id="f-method" value={v.method} onChange={set("method")} className={inputCls}>
            {DONATION_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </Field>
        <Field id="f-transactionId" label="Transaction ID" required={txRequired} error={errors.transactionId}
          hint={txRequired ? undefined : "Optional for this payment method."}>
          <input id="f-transactionId" value={v.transactionId} onChange={set("transactionId")} className={inputCls} {...a11y("transactionId")} />
        </Field>
        <Field id="f-donationDate" label="Donation date" required error={errors.donationDate}>
          <input id="f-donationDate" type="date" value={v.donationDate} onChange={set("donationDate")} className={inputCls} {...a11y("donationDate")} />
        </Field>
        <Field id="f-purpose" label="Donation purpose">
          <select id="f-purpose" value={v.purpose} onChange={set("purpose")} className={inputCls}>
            <option value="general">General Donation</option>
            <option value="project">Project Donation</option>
          </select>
        </Field>
        {v.purpose === "project" ? (
          <Field id="f-projectId" label="Project" required error={errors.projectId}>
            <select id="f-projectId" value={v.projectId} onChange={set("projectId")} className={inputCls} {...a11y("projectId")}>
              <option value="">Select a project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        ) : null}

        {!isEdit ? (
          <div className="sm:col-span-2">
            <Field id="f-recordStatus" label="Verification status"
              hint="Choose Verified only if an authorized administrator has already confirmed the payment.">
              <select id="f-recordStatus" value={v.recordStatus} onChange={set("recordStatus")} className={inputCls}>
                <option value="pending">Pending verification</option>
                <option value="verified">Verified (payment already confirmed)</option>
              </select>
            </Field>
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <Field id="f-message" label="Donor message / note">
            <textarea id="f-message" rows={2} value={v.message} onChange={set("message")} className={inputCls} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="f-adminNote" label="Internal administrator note" hint="Only visible to administrators.">
            <textarea id="f-adminNote" rows={2} value={v.adminNote} onChange={set("adminNote")} className={inputCls} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field id="f-proof" label="Receipt or payment proof" error={errors.proof}
            hint={`JPG, PNG, WebP, or PDF, up to ${PROOF_MAX_BYTES / 1024 / 1024} MB. Prototype: only the file name is kept. Permanent storage needs backend support.`}>
            <div className="flex flex-wrap items-center gap-3">
              <input ref={fileRef} id="f-proof" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={pickFile} className="sr-only" {...a11y("proof")} />
              <button type="button" onClick={() => fileRef.current?.click()} className={btnSecondary}>
                <Paperclip className="h-4 w-4" aria-hidden="true" /> Choose file
              </button>
              <span className="text-sm text-gray-600">{v.proofFileName ?? "No file selected"}</span>
            </div>
          </Field>
        </div>

        {requireAck ? (
          <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <label className="flex items-start gap-2">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 accent-green-600" />
              This donation is verified. Editing it changes a confirmed financial record and may affect reporting. The status stays Verified.
            </label>
            {errors.ack ? <p className="mt-1 text-xs text-red-700">{errors.ack}</p> : null}
          </div>
        ) : null}
      </form>
    </Modal>
  );
}

export default function DonationFormDialog({ open, mode, initialValues, ...rest }) {
  if (!open) return null;
  return <FormBody key={`${mode}-${rest.donation?.id ?? "new"}`} mode={mode} initialValues={initialValues} {...rest} />;
}
