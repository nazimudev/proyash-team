"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Modal, {
  btnPrimary,
  btnSecondary,
  btnDanger,
  inputCls,
} from "../donation/Modal";
import { PAYMENT_TYPES, typeInfo, defaultRequiresTransactionId, validateMethodForm, newStep } from "@/lib/paymentMethodUtils";

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}{required ? <span className="text-red-600"> *</span> : null}</label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
      {error ? <p id={`${id}-err`} className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function Switch({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p id={`${id}-l`} className="text-sm font-medium text-gray-700">{label}</p>
        {description ? <p className="text-xs text-gray-500">{description}</p> : null}
      </div>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={`${id}-l`} onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600 ${checked ? "bg-green-600" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-5.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function FormBody({ mode, initialValues, methods, method, saving, onCancel, onSubmit }) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [txLocked, setTxLocked] = useState(mode === "edit"); // stop auto-defaults once the admin sets it or when editing
  const info = typeInfo(v.type);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const a11y = (k) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `pm-${k}-err` : undefined });

  const changeType = (e) => {
    const type = e.target.value;
    setV((p) => ({ ...p, type, ...(txLocked ? {} : { requiresTransactionId: defaultRequiresTransactionId(type) }) }));
  };
  const setStep = (key, text) => setV((p) => ({ ...p, steps: p.steps.map((s) => (s.key === key ? { ...s, text } : s)) }));
  const removeStep = (key) => setV((p) => ({ ...p, steps: p.steps.filter((s) => s.key !== key) }));
  const moveStep = (i, dir) => setV((p) => {
    const steps = [...p.steps];
    const j = i + dir;
    if (j < 0 || j >= steps.length) return p;
    [steps[i], steps[j]] = [steps[j], steps[i]];
    return { ...p, steps };
  });

  const submit = (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = validateMethodForm(v, methods, method?.id);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSubmit(v);
  };

  return (
    <Modal open onClose={onCancel} busy={saving} size="lg"
      title={mode === "edit" ? `Edit ${method.name}` : "Add Payment Method"}
      description={mode === "edit" ? "Update how this payment option works for donors." : "Configure a payment option for donors."}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
          <button type="submit" form="pm-form" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save Payment Method"}</button>
        </>
      }>
      <form id="pm-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field id="pm-name" label="Payment method name" required error={errors.name}>
          <input id="pm-name" value={v.name} onChange={set("name")} placeholder="For example, bKash" className={inputCls} {...a11y("name")} />
        </Field>
        <Field id="pm-type" label="Payment type" required error={errors.type}>
          <select id="pm-type" value={v.type} onChange={changeType} className={inputCls}>
            {PAYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
        <Field id="pm-accountNumber" label={info.accountLabel} error={errors.accountNumber} hint={info.accountHint}>
          <input id="pm-accountNumber" value={v.accountNumber} onChange={set("accountNumber")} className={inputCls} {...a11y("accountNumber")} />
        </Field>
        {v.type !== "cash" ? (
          <Field id="pm-accountHolder" label="Account holder name" hint="Optional.">
            <input id="pm-accountHolder" value={v.accountHolder} onChange={set("accountHolder")} className={inputCls} />
          </Field>
        ) : null}
        <div className="sm:col-span-2">
          <Field id="pm-description" label="Payment instructions" required error={errors.description}>
            <textarea id="pm-description" rows={3} value={v.description} onChange={set("description")} className={inputCls} {...a11y("description")}
              placeholder="Send your donation to the configured account and submit the transaction ID for verification." />
          </Field>
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1 text-sm font-medium text-gray-700">Instruction steps shown to donors</legend>
          <ol className="space-y-2">
            {v.steps.map((s, i) => (
              <li key={s.key} className="flex items-center gap-2">
                <span className="w-5 text-right text-sm text-gray-500" aria-hidden="true">{i + 1}.</span>
                <input aria-label={`Step ${i + 1}`} value={s.text} onChange={(e) => setStep(s.key, e.target.value)} className={inputCls} />
                <button type="button" aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => moveStep(i, -1)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" aria-label={`Move step ${i + 1} down`} disabled={i === v.steps.length - 1} onClick={() => moveStep(i, 1)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" aria-label={`Remove step ${i + 1}`} onClick={() => removeStep(s.key)}
                  className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setV((p) => ({ ...p, steps: [...p.steps, newStep()] }))} className={`${btnSecondary} mt-2`}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add step
          </button>
        </fieldset>

        <div className="space-y-4 rounded-lg border border-gray-200 p-4 sm:col-span-2">
          <Switch id="pm-tx" label="Require Transaction ID" description="Donors must enter a transaction reference, subject to your verification policy."
            checked={v.requiresTransactionId} onChange={(c) => { setTxLocked(true); setV((p) => ({ ...p, requiresTransactionId: c })); }} />
          <Switch id="pm-phone" label="Require Donor Phone Number" description="The donation form will ask for the donor's phone number."
            checked={v.requiresPhone} onChange={(c) => setV((p) => ({ ...p, requiresPhone: c }))} />
          <Switch id="pm-proof" label="Require Payment Proof" description="Donors must attach a screenshot, receipt, or other proof."
            checked={v.requiresPaymentProof} onChange={(c) => setV((p) => ({ ...p, requiresPaymentProof: c }))} />
        </div>

        <Field id="pm-displayOrder" label="Display order" required error={errors.displayOrder} hint="Lower numbers appear first.">
          <input id="pm-displayOrder" inputMode="numeric" value={v.displayOrder} onChange={set("displayOrder")} className={inputCls} {...a11y("displayOrder")} />
        </Field>
        <div className="self-end pb-1">
          <Switch id="pm-active" label="Active" description="Inactive methods are hidden from donors."
            checked={v.isActive} onChange={(c) => setV((p) => ({ ...p, isActive: c }))} />
        </div>
      </form>
    </Modal>
  );
}

export default function PaymentMethodFormDialog({ open, mode, ...rest }) {
  if (!open) return null;
  return <FormBody key={`${mode}-${rest.method?.id ?? "new"}`} mode={mode} {...rest} />;
}
