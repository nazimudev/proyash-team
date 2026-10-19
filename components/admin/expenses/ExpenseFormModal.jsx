/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import Modal, { btnPrimary, btnSecondary, inputCls } from "@/components/admin/donation/Modal";
import { EXPENSE_CATEGORIES, EXPENSE_TYPES, EXPENSE_PAYMENT_METHODS } from "@/data/expenseOptions";
import { validateExpenseForm, RECEIPT_MAX_BYTES } from "@/lib/expenseUtils";
import Image from "next/image";

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

function FormBody({ mode, initialValues, expense, projects, onCancel, onSubmit }) {
  const [v, setV] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const submitting = useRef(false); // blocks double submits even before state updates
  const fileRef = useRef(null);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const a11y = (k) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `ex-${k}-err` : undefined });

  useEffect(() => {
    const f = v.receiptFile;
    if (!f || !f.type.startsWith("image/")) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [v.receiptFile]);

  const changeType = (e) => {
    const type = e.target.value;
    setV((p) => ({ ...p, type, projectId: type === "general" ? "" : p.projectId })); // general expenses never keep a project
  };
  const pickFile = (e) => {
    const f = e.target.files?.[0] ?? null;
    setV((p) => ({ ...p, receiptFile: f, receiptName: f ? f.name : p.receiptName }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (submitting.current) return;
    const errs = validateExpenseForm(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    submitting.current = true;
    setSaving(true);
    onSubmit(v);
  };

  return (
    <Modal open onClose={onCancel} busy={saving} size="lg" title={mode === "edit" ? `Edit ${expense.id}` : "Add Expense"}
      description={mode === "edit" ? "Update this expense." : "Record a new expense."}
      footer={
        <>
          <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
          <button type="submit" form="expense-form" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save Expense"}</button>
        </>
      }>
      <form id="expense-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field id="ex-title" label="Expense title" required error={errors.title}>
            <input id="ex-title" value={v.title} onChange={set("title")} className={inputCls} {...a11y("title")} />
          </Field>
        </div>
        <Field id="ex-category" label="Category" required error={errors.category}>
          <select id="ex-category" value={v.category} onChange={set("category")} className={inputCls} {...a11y("category")}>
            <option value="">Select a category</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field id="ex-type" label="Expense type" required>
          <select id="ex-type" value={v.type} onChange={changeType} className={inputCls}>
            {EXPENSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
        {v.type === "project" ? (
          <div className="sm:col-span-2">
            <Field id="ex-projectId" label="Project" required error={errors.projectId} hint="Sample project options.">
              <select id="ex-projectId" value={v.projectId} onChange={set("projectId")} className={inputCls} {...a11y("projectId")}>
                <option value="">Select a project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
          </div>
        ) : null}
        <Field id="ex-amount" label="Amount (৳ BDT)" required error={errors.amount}>
          <input id="ex-amount" inputMode="decimal" value={v.amount} onChange={set("amount")} placeholder="0" className={inputCls} {...a11y("amount")} />
        </Field>
        <Field id="ex-date" label="Expense date" required error={errors.date}>
          <input id="ex-date" type="date" value={v.date} onChange={set("date")} className={inputCls} {...a11y("date")} />
        </Field>
        <Field id="ex-paymentMethod" label="Payment method" required error={errors.paymentMethod}>
          <select id="ex-paymentMethod" value={v.paymentMethod} onChange={set("paymentMethod")} className={inputCls} {...a11y("paymentMethod")}>
            <option value="">Select a method</option>
            {EXPENSE_PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field id="ex-paidTo" label="Paid to" hint="Optional.">
          <input id="ex-paidTo" value={v.paidTo} onChange={set("paidTo")} className={inputCls} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="ex-description" label="Description" error={errors.description} hint="Optional.">
            <textarea id="ex-description" rows={3} value={v.description} onChange={set("description")} className={inputCls} {...a11y("description")} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="ex-receipt" label="Receipt or invoice" error={errors.receipt}
            hint={`Optional. JPG, PNG, WebP, or PDF up to ${RECEIPT_MAX_BYTES / 1024 / 1024} MB. Only the file name is kept in this prototype; the file itself is not uploaded or stored.`}>
            <div className="flex flex-wrap items-center gap-3">
              <input ref={fileRef} id="ex-receipt" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={pickFile} className="sr-only" {...a11y("receipt")} />
              <button type="button" onClick={() => fileRef.current?.click()} className={btnSecondary}><Paperclip className="h-4 w-4" aria-hidden="true" /> Choose file</button>
              <span className="text-sm text-gray-600">{v.receiptName ?? "No file selected"}</span>
            </div>
            {previewUrl ? <Image src={previewUrl} alt="Selected receipt preview" className="mt-3 max-h-40 rounded-lg border border-gray-200" /> : null}
          </Field>
        </div>
      </form>
    </Modal>
  );
}

export default function ExpenseFormModal({ open, mode, ...rest }) {
  if (!open) return null;
  return <FormBody key={`${mode}-${rest.expense?.id ?? "new"}`} mode={mode} {...rest} />;
}
