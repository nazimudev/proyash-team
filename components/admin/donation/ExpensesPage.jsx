/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/refs */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, ChevronLeft, ChevronRight,
  Eye, FileText, Loader2, MoreVertical, Paperclip, Pencil, Plus, Receipt, Search,
  Trash2, X, XCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Configuration (move to @/data/expenseConfig when the API exists)    */
/* ------------------------------------------------------------------ */
const CATEGORIES = [
  "Food & Relief", "Education Assistance", "Medical Support", "Tree Plantation",
  "Transportation", "Project Supplies", "Event & Program", "Office & Administration", "Other",
];
const PAYMENT_METHODS = ["Cash", "bKash", "Nagad", "Rocket", "Bank Transfer", "Other"];
const PAGE_SIZE = 8;
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;
const RECEIPT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

/* ------------------------------------------------------------------ */
/* Sample data + data layer. Every function below is a local stand-in  */
/* for a future Laravel endpoint. Nothing here talks to a server.      */
/* ------------------------------------------------------------------ */
const SAMPLE_PROJECTS = [
  { id: "prj-education", name: "Education Assistance Project" },
  { id: "prj-trees", name: "Tree Plantation Project" },
  { id: "prj-relief", name: "Community Relief Project" },
  { id: "prj-health", name: "Healthcare Support Project" },
];

const isoDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const today = () => isoDaysAgo(0);

// [title, category, projectId|null, amount, daysAgo, method, paidTo]
const SEED_ROWS = [
  ["Food Distribution", "Food & Relief", null, 8500, 2, "Cash", "Local food supplier"],
  ["Student Educational Support", "Education Assistance", "prj-education", 5000, 4, "bKash", "Student guardians"],
  ["Tree Saplings Purchase", "Project Supplies", "prj-trees", 3200, 6, "Cash", "Tree nursery"],
  ["Medical Assistance", "Medical Support", null, 4000, 9, "Bank Transfer", "City clinic"],
  ["School Supplies for 20 Students", "Education Assistance", "prj-education", 6400, 18, "Nagad", "Book shop"],
  ["Volunteer Transport", "Transportation", "prj-trees", 1200, 22, "Cash", ""],
  ["Winter Blanket Distribution", "Food & Relief", "prj-relief", 12500, 35, "Bank Transfer", "Wholesale supplier"],
  ["Office Internet Bill", "Office & Administration", null, 1500, 41, "Rocket", "ISP"],
  ["Health Camp Medicines", "Medical Support", "prj-health", 9800, 55, "Cash", "Pharmacy"],
  ["Awareness Event Banner", "Event & Program", null, 2300, 70, "bKash", "Print shop"],
];

const SEED_EXPENSES = SEED_ROWS.map(([title, category, projectId, amount, ago, paymentMethod, paidTo], i) => ({
  id: `EXP-${String(i + 1).padStart(4, "0")}`,
  title, category, projectId, amount, paymentMethod, paidTo,
  expenseDate: isoDaysAgo(ago),
  description: "", reference: "", receipt: null,
  recordedBy: "Admin",
  isSample: true,
}));

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const nextId = (list) =>
  `EXP-${String(Math.max(0, ...list.map((e) => Number(e.id.split("-")[1]) || 0)) + 1).padStart(4, "0")}`;

const expenseApi = {
  // TODO(Laravel): GET /expenses
  fetchExpenses: async () => SEED_EXPENSES,
  // TODO(Laravel): GET /projects
  fetchProjects: async () => SAMPLE_PROJECTS,
  // TODO(Laravel): GET /expenses/{id}
  fetchExpenseDetails: async (id, list) => list.find((e) => e.id === id) ?? null,
  // TODO(Laravel): POST /expenses (multipart when a receipt is attached)
  createExpense: async (payload, list) => {
    await delay();
    return { ...payload, id: nextId(list), recordedBy: "Admin", isSample: false };
  },
  // TODO(Laravel): PUT /expenses/{id}
  updateExpense: async (id, payload) => {
    await delay();
    return { ...payload, id };
  },
  // TODO(Laravel): DELETE /expenses/{id}
  deleteExpense: async () => {
    await delay(400);
  },
  // TODO(Laravel): POST /expenses/{id}/receipt. Prototype keeps metadata + a session-only preview URL.
  uploadReceipt: async (receipt) => receipt,
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const formatBDT = (n) =>
  `৳${Number(n).toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const formatBytes = (b) => (b < 1048576 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(1)} MB`);

const inputCls =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30";
const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50";

/* ------------------------------------------------------------------ */
/* Small UI primitives                                                 */
/* ------------------------------------------------------------------ */
function Modal({ title, description, onClose, children, wide = false }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement;
    const node = ref.current;
    const focusables = () =>
      node.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])');
    (node.querySelector("[data-autofocus]") || focusables()[0])?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return closeRef.current();
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl ${wide ? "sm:max-w-2xl" : "sm:max-w-md"}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4 sm:px-6">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toasts({ toasts, dismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex max-w-sm flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} role="status"
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3 text-sm shadow-lg ${t.type === "error" ? "border-red-200" : "border-green-200"}`}>
          {t.type === "error"
            ? <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />}
          <p className="text-gray-700">{t.message}</p>
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-gray-400 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-900">
        {label}{required && <span className="text-red-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error
        ? <p id={`${id}-error`} role="alert" className="mt-1 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{error}</p>
        : hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function RowMenu({ expense, onView, onEdit, onDelete }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const close = useCallback(() => setPos(null), []);

  useEffect(() => {
    if (!pos) return;
    const onDoc = (e) => { if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) close(); };
    const onKey = (e) => { if (e.key === "Escape") { close(); btnRef.current?.focus(); } };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menuRef.current?.querySelector("button")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [pos, close]);

  const open = () => {
    const r = btnRef.current.getBoundingClientRect();
    const flip = window.innerHeight - r.bottom < 170;
    setPos({ right: window.innerWidth - r.right, ...(flip ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }) });
  };
  const item = "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none";

  return (
    <>
      <button ref={btnRef} type="button" onClick={() => (pos ? close() : open())} aria-haspopup="menu" aria-expanded={Boolean(pos)}
        aria-label={`Actions for ${expense.title}`}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600">
        <MoreVertical className="h-4 w-4" />
      </button>
      {pos && (
        <div ref={menuRef} role="menu" style={{ position: "fixed", ...pos }}
          className="z-40 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button role="menuitem" type="button" className={`${item} text-gray-700`} onClick={() => { close(); onView(expense); }}>
            <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />View Details
          </button>
          <button role="menuitem" type="button" className={`${item} text-gray-700`} onClick={() => { close(); onEdit(expense); }}>
            <Pencil className="h-4 w-4 text-gray-400" aria-hidden="true" />Edit Expense
          </button>
          <button role="menuitem" type="button" className={`${item} text-red-600`} onClick={() => { close(); onDelete(expense); }}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />Delete Expense
          </button>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Expense form (add + edit)                                           */
/* ------------------------------------------------------------------ */
function ExpenseForm({ initial, projects, onCancel, onSubmit }) {
  const editing = Boolean(initial);
  const [v, setV] = useState(() => ({
    title: initial?.title ?? "",
    category: initial?.category ?? "",
    type: initial ? (initial.projectId ? "project" : "general") : "general",
    projectId: initial?.projectId ?? "",
    amount: initial ? String(initial.amount) : "",
    expenseDate: initial?.expenseDate ?? today(),
    paymentMethod: initial?.paymentMethod ?? "Cash",
    paidTo: initial?.paidTo ?? "",
    description: initial?.description ?? "",
    reference: initial?.reference ?? "",
  }));
  const [receipt, setReceipt] = useState(initial?.receipt ?? null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const newUrl = useRef(null); // object URL created in this form session

  useEffect(() => () => {
    // Revoke an unsaved preview if the dialog closes without saving.
    if (newUrl.current && !savedRef.current) URL.revokeObjectURL(newUrl.current);
  }, []);
  const savedRef = useRef(false);

  const set = (k, val) => { setV((p) => ({ ...p, [k]: val })); setErrors((p) => ({ ...p, [k]: undefined })); };
  const cls = (k) => `${inputCls} ${errors[k] ? "border-red-400" : "border-gray-300 focus:border-green-600"}`;
  const aria = (k) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-error` : undefined });

  function pickFile(file) {
    if (!file) return;
    if (!RECEIPT_TYPES.includes(file.type)) return setErrors((p) => ({ ...p, receipt: "Upload a PDF, JPG, JPEG, or PNG file." }));
    if (file.size > MAX_RECEIPT_BYTES) return setErrors((p) => ({ ...p, receipt: `File is ${formatBytes(file.size)}. Maximum size is ${formatBytes(MAX_RECEIPT_BYTES)}.` }));
    if (newUrl.current) URL.revokeObjectURL(newUrl.current);
    newUrl.current = URL.createObjectURL(file);
    setErrors((p) => ({ ...p, receipt: undefined }));
    setReceipt({ name: file.name, size: file.size, type: file.type, url: newUrl.current });
  }
  function removeFile() {
    if (newUrl.current) { URL.revokeObjectURL(newUrl.current); newUrl.current = null; }
    setReceipt(null);
    setErrors((p) => ({ ...p, receipt: undefined }));
  }

  function validate() {
    const e = {};
    if (!v.title.trim()) e.title = "Enter an expense title.";
    if (!v.category) e.category = "Choose a category.";
    if (v.type === "project" && !v.projectId) e.projectId = "Choose a project for this expense.";
    const amt = Number(v.amount);
    if (!v.amount.trim()) e.amount = "Enter an amount.";
    else if (!/^\d+(\.\d{1,2})?$/.test(v.amount.trim()) || !Number.isFinite(amt)) e.amount = "Enter a valid positive number (up to 2 decimals).";
    else if (amt <= 0) e.amount = "Amount must be greater than zero.";
    if (!v.expenseDate) e.expenseDate = "Choose the expense date.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (saving) return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const stored = receipt ? await expenseApi.uploadReceipt(receipt) : null;
      await onSubmit({
        title: v.title.trim(),
        category: v.category,
        projectId: v.type === "project" ? v.projectId : null, // general expenses have no project
        amount: Number(v.amount),
        expenseDate: v.expenseDate,
        paymentMethod: v.paymentMethod,
        paidTo: v.paidTo.trim(),
        description: v.description.trim(),
        reference: v.reference.trim(),
        receipt: stored,
      });
      savedRef.current = true;
    } catch {
      setErrors({ form: "Couldn't save this expense. Try again." });
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="grid gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6">
        <div className="sm:col-span-2">
          <Field id="title" label="Expense Title" required error={errors.title}>
            <input id="title" data-autofocus value={v.title} onChange={(e) => set("title", e.target.value)}
              placeholder="Food Distribution for 30 Families" className={cls("title")} {...aria("title")} />
          </Field>
        </div>

        <Field id="category" label="Expense Category" required error={errors.category}>
          <select id="category" value={v.category} onChange={(e) => set("category", e.target.value)} className={cls("category")} {...aria("category")}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-gray-900">Expense Type <span className="text-red-600" aria-hidden="true">*</span></legend>
          <div className="grid grid-cols-2 gap-2">
            {[["project", "Project Expense"], ["general", "General Expense"]].map(([val, label]) => (
              <label key={val} className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium has-focus-visible:ring-2 has-focus-visible:ring-green-600/40 ${v.type === val ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                <input type="radio" name="type" value={val} checked={v.type === val} className="sr-only"
                  onChange={() => { set("type", val); if (val === "general") set("projectId", ""); }} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        {v.type === "project" && (
          <div className="sm:col-span-2">
            <Field id="projectId" label="Project" required error={errors.projectId}>
              {projects.length === 0 ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  No projects are available yet. Create a project first, or record this as a General Expense.
                </p>
              ) : (
                <select id="projectId" value={v.projectId} onChange={(e) => set("projectId", e.target.value)} className={cls("projectId")} {...aria("projectId")}>
                  <option value="">Select a project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
            </Field>
          </div>
        )}

        <Field id="amount" label="Amount" required error={errors.amount}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500" aria-hidden="true">৳</span>
            <input id="amount" inputMode="decimal" value={v.amount} onChange={(e) => set("amount", e.target.value)}
              placeholder="0.00" className={`${cls("amount")} pl-7 pr-14`} {...aria("amount")} />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-gray-400">BDT</span>
          </div>
        </Field>

        <Field id="expenseDate" label="Expense Date" required error={errors.expenseDate}>
          <input id="expenseDate" type="date" value={v.expenseDate} onChange={(e) => set("expenseDate", e.target.value)} className={cls("expenseDate")} {...aria("expenseDate")} />
        </Field>

        <Field id="paymentMethod" label="Payment Method">
          <select id="paymentMethod" value={v.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={cls("paymentMethod")}>
            {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>

        <Field id="paidTo" label="Paid To / Recipient">
          <input id="paidTo" value={v.paidTo} onChange={(e) => set("paidTo", e.target.value)} placeholder="Local food supplier" className={cls("paidTo")} />
        </Field>

        <div className="sm:col-span-2">
          <Field id="description" label="Expense Description" hint="Explain what was purchased or why it was necessary.">
            <textarea id="description" rows={3} value={v.description} onChange={(e) => set("description", e.target.value)} className={`${cls("description")} resize-y`} />
          </Field>
        </div>

        <Field id="reference" label="Reference / Receipt Number">
          <input id="reference" value={v.reference} onChange={(e) => set("reference", e.target.value)} placeholder="INV-2041 or bKash TrxID" className={cls("reference")} />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-900">Receipt Attachment</span>
          <input ref={fileRef} type="file" id="receipt" className="sr-only" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            onChange={(e) => { pickFile(e.target.files?.[0]); e.target.value = ""; }} />
          {receipt ? (
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2">
              <Paperclip className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-900">{receipt.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(receipt.size)}</p>
              </div>
              <button type="button" onClick={removeFile} aria-label="Remove receipt" className="rounded p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className={`${btnSecondary} w-full border-dashed`}>
              <Paperclip className="h-4 w-4" aria-hidden="true" />Attach receipt
            </button>
          )}
          {errors.receipt
            ? <p role="alert" className="mt-1 flex items-center gap-1.5 text-xs text-red-600"><AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />{errors.receipt}</p>
            : <p className="mt-1 text-xs text-gray-500">PDF, JPG, JPEG, or PNG, up to {formatBytes(MAX_RECEIPT_BYTES)}. Permanent receipt storage needs backend support; in this prototype the file is kept for this session only.</p>}
        </div>

        {errors.form && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{errors.form}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6">
        <button type="button" onClick={onCancel} disabled={saving} className={btnSecondary}>Cancel</button>
        <button type="submit" disabled={saving} aria-busy={saving} className={btnPrimary}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {saving ? "Saving..." : editing ? "Save Changes" : "Save Expense"}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Details dialog                                                      */
/* ------------------------------------------------------------------ */
function DetailItem({ label, children, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">{children || <span className="text-gray-400">Not provided</span>}</dd>
    </div>
  );
}

function ExpenseDetails({ expense, projectName, onClose }) {
  const r = expense.receipt;
  return (
    <Modal wide title={expense.title} description={`${expense.id}${expense.isSample ? " · Sample record" : ""}`} onClose={onClose}>
      <dl className="grid gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6">
        <DetailItem label="Project">{projectName(expense.projectId)}</DetailItem>
        <DetailItem label="Category">{expense.category}</DetailItem>
        <DetailItem label="Amount"><span className="text-base font-semibold">{formatBDT(expense.amount)}</span></DetailItem>
        <DetailItem label="Expense date">{formatDate(expense.expenseDate)}</DetailItem>
        <DetailItem label="Payment method">{expense.paymentMethod}</DetailItem>
        <DetailItem label="Paid to">{expense.paidTo}</DetailItem>
        <DetailItem label="Reference / receipt number">{expense.reference}</DetailItem>
        <DetailItem label="Recorded by">{expense.recordedBy}</DetailItem>
        <DetailItem label="Description" full>{expense.description}</DetailItem>
        <DetailItem label="Receipt" full>
          {r && (
            <div className="space-y-2">
              <p className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" aria-hidden="true" />{r.name} ({formatBytes(r.size)})</p>
              {r.url && r.type?.startsWith("image/") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.url} alt={`Receipt: ${r.name}`} className="max-h-60 rounded-lg border border-gray-200 object-contain" />
              )}
              {r.url && r.type === "application/pdf" && (
                <a href={r.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-green-700 underline">Open PDF</a>
              )}
              {!r.url && <p className="text-xs text-gray-500">Preview is available once receipts are stored by the backend.</p>}
            </div>
          )}
        </DetailItem>
      </dl>
      <div className="flex justify-end border-t border-gray-200 px-5 py-4 sm:px-6">
        <button type="button" onClick={onClose} className={btnSecondary}>Close</button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const EMPTY_FILTERS = { q: "", project: "all", category: "all", type: "all", from: "", to: "" };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState({ key: "expenseDate", dir: "desc" });
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null); // { kind: "form" | "details" | "delete", expense? }
  const [deleting, setDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let alive = true;
    Promise.all([expenseApi.fetchExpenses(), expenseApi.fetchProjects()]).then(([e, p]) => {
      if (!alive) return;
      setExpenses(e); setProjects(p); setLoading(false);
    });
    return () => { alive = false; };
  }, []);

  const toast = useCallback((message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const projectName = useCallback(
    (id) => (id ? projects.find((p) => p.id === id)?.name ?? "Unknown project" : "General Expense"),
    [projects]
  );

  // Summary cards: always computed from the full dataset, never from filters.
  const summary = useMemo(() => {
    const month = today().slice(0, 7);
    const sum = (list) => list.reduce((s, e) => s + e.amount, 0);
    return {
      total: sum(expenses),
      month: sum(expenses.filter((e) => e.expenseDate.startsWith(month))),
      project: sum(expenses.filter((e) => e.projectId)),
      general: sum(expenses.filter((e) => !e.projectId)),
    };
  }, [expenses]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const list = expenses.filter((e) =>
      (!q || e.title.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)) &&
      (filters.project === "all" || e.projectId === filters.project) &&
      (filters.category === "all" || e.category === filters.category) &&
      (filters.type === "all" || (filters.type === "project" ? Boolean(e.projectId) : !e.projectId)) &&
      (!filters.from || e.expenseDate >= filters.from) &&
      (!filters.to || e.expenseDate <= filters.to)
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return list.sort((a, b) =>
      sort.key === "amount" ? (a.amount - b.amount) * dir : a.expenseDate.localeCompare(b.expenseDate) * dir || b.id.localeCompare(a.id)
    );
  }, [expenses, filters, sort]);

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  const setFilter = (k, val) => { setFilters((f) => ({ ...f, [k]: val })); setPage(1); };
  const toggleSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  const closeDialog = () => setDialog(null);

  async function handleSave(payload) {
    const editing = dialog?.expense;
    if (editing) {
      const updated = await expenseApi.updateExpense(editing.id, { ...editing, ...payload });
      setExpenses((list) => list.map((e) => (e.id === editing.id ? updated : e)));
      toast(`${updated.id} updated in this session. Not saved to a server yet.`);
    } else {
      const created = await expenseApi.createExpense(payload, expenses);
      setExpenses((list) => [created, ...list]);
      setPage(1);
      toast(`${created.id} added in this session. Not saved to a server yet.`);
    }
    closeDialog();
  }

  async function handleDelete() {
    if (deleting) return;
    const target = dialog.expense;
    setDeleting(true);
    try {
      await expenseApi.deleteExpense(target.id);
      if (target.receipt?.url) URL.revokeObjectURL(target.receipt.url);
      setExpenses((list) => list.filter((e) => e.id !== target.id));
      toast(`${target.id} removed from this session's list.`);
      closeDialog();
    } catch {
      toast("Couldn't delete this expense. Try again.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const openDetails = async (expense) => {
    const full = await expenseApi.fetchExpenseDetails(expense.id, expenses);
    if (full) setDialog({ kind: "details", expense: full });
  };

  const SortIcon = ({ k }) =>
    sort.key !== k ? <ArrowUpDown className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
      : sort.dir === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />
      : <ArrowDown className="h-3.5 w-3.5 text-green-700" aria-hidden="true" />;

  const sortableTh = (k, label, right) => (
    <th scope="col" aria-sort={sort.key === k ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`px-4 py-3 ${right ? "text-right" : "text-left"}`}>
      <button type="button" onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1.5 font-medium hover:text-gray-900 focus-visible:outline focus-visible:outline-green-600 ${right ? "flex-row-reverse" : ""}`}>
        {label}<SortIcon k={k} />
      </button>
    </th>
  );

  const cards = [
    ["Total Expenses", summary.total, "All records"],
    ["This Month", summary.month, new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })],
    ["Project Expenses", summary.project, "Linked to a project"],
    ["General Expenses", summary.general, "No project"],
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <header>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li><Link href="/admin" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-green-600">Dashboard</Link></li>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
            <li>Donations</li>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
            <li aria-current="page" className="font-medium text-gray-900">Expenses</li>
          </ol>
        </nav>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Expenses</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Track organizational spending, project expenses, and how donation funds are being used.</p>
          </div>
          <button type="button" onClick={() => setDialog({ kind: "form" })} className={btnPrimary}>
            <Plus className="h-4 w-4" aria-hidden="true" />Add Expense
          </button>
        </div>
      </header>

      <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Prototype mode: records marked Sample are demo data, and changes live in this browser session only. Nothing is recorded as spent on a server.
      </p>

      {/* Summary (all records, unaffected by filters) */}
      <section aria-label="Expense summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, note]) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">{loading ? "…" : formatBDT(value)}</p>
            <p className="mt-1 text-xs text-gray-400">{note}</p>
          </div>
        ))}
      </section>

      {/* Table */}
      <section aria-label="Expense records" className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="space-y-3 border-b border-gray-200 p-4 sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <label htmlFor="expense-search" className="sr-only">Search expenses by title or ID</label>
            <input id="expense-search" type="search" value={filters.q} onChange={(e) => setFilter("q", e.target.value)}
              placeholder="Search by title or expense ID" className={`${inputCls} border-gray-300 pl-9 focus:border-green-600`} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="f-project" className="sr-only">Filter by project</label>
              <select id="f-project" value={filters.project} onChange={(e) => setFilter("project", e.target.value)} className={`${inputCls} border-gray-300`}>
                <option value="all">All projects</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-category" className="sr-only">Filter by category</label>
              <select id="f-category" value={filters.category} onChange={(e) => setFilter("category", e.target.value)} className={`${inputCls} border-gray-300`}>
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="f-type" className="sr-only">Filter by expense type</label>
              <select id="f-type" value={filters.type} onChange={(e) => setFilter("type", e.target.value)} className={`${inputCls} border-gray-300`}>
                <option value="all">Project and general</option>
                <option value="project">Project expenses</option>
                <option value="general">General expenses</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-from" className="sr-only">From date</label>
              <input id="f-from" type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => setFilter("from", e.target.value)} className={`${inputCls} border-gray-300`} title="From date" />
            </div>
            <div>
              <label htmlFor="f-to" className="sr-only">To date</label>
              <input id="f-to" type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => setFilter("to", e.target.value)} className={`${inputCls} border-gray-300`} title="To date" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500" aria-live="polite">
            <span>
              {hasFilters ? "Filtered results: " : "Showing "}
              <strong className="font-medium text-gray-900">{filtered.length}</strong> of {expenses.length} records ·
              {" "}<strong className="font-medium text-gray-900">{formatBDT(filteredTotal)}</strong>
            </span>
            {hasFilters && (
              <button type="button" onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }} className="font-medium text-green-700 hover:underline focus-visible:outline focus-visible:outline-green-600">
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-250 text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium">Expense ID</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Expense Title</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Project</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Category</th>
                {sortableTh("expenseDate", "Expense Date")}
                {sortableTh("amount", "Amount", true)}
                <th scope="col" className="px-4 py-3 text-left font-medium">Payment Method</th>
                <th scope="col" className="px-4 py-3 text-left font-medium">Recorded By</th>
                <th scope="col" className="px-4 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-500">Loading expenses…</td></tr>}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-14 text-center">
                    <Receipt className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
                    <p className="mt-2 font-medium text-gray-900">{expenses.length ? "No expenses match these filters" : "No expenses recorded yet"}</p>
                    <p className="mt-1 text-sm text-gray-500">{expenses.length ? "Try a different search or clear the filters." : "Add your first expense to start tracking spending."}</p>
                  </td>
                </tr>
              )}
              {rows.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50/60">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600">
                    {e.id}
                    {e.isSample && <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 font-sans text-[10px] font-medium text-gray-500">Sample</span>}
                  </td>
                  <td className="max-w-55 px-4 py-3 font-medium text-gray-900">{e.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {e.projectId ? projectName(e.projectId) : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">General</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.category}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(e.expenseDate)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-gray-900">{formatBDT(e.amount)}</td>
                  <td className="px-4 py-3 text-gray-600">{e.paymentMethod}</td>
                  <td className="px-4 py-3 text-gray-600">{e.recordedBy}</td>
                  <td className="px-4 py-3 text-right">
                    <RowMenu expense={e} onView={openDetails} onEdit={(x) => setDialog({ kind: "form", expense: x })} onDelete={(x) => setDialog({ kind: "delete", expense: x })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > PAGE_SIZE && (
          <nav aria-label="Pagination" className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-500 sm:px-5">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} className={btnSecondary}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous
              </button>
              <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages} className={btnSecondary}>
                Next<ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </section>

      {/* Dialogs */}
      {dialog?.kind === "form" && (
        <Modal wide onClose={closeDialog}
          title={dialog.expense ? "Edit Expense" : "Add Expense"}
          description={dialog.expense ? dialog.expense.id : "Record spending paid from donation funds."}>
          <ExpenseForm initial={dialog.expense} projects={projects} onCancel={closeDialog} onSubmit={handleSave} />
        </Modal>
      )}
      {dialog?.kind === "details" && <ExpenseDetails expense={dialog.expense} projectName={projectName} onClose={closeDialog} />}
      {dialog?.kind === "delete" && (
        <Modal title="Delete this expense?" onClose={deleting ? () => {} : closeDialog}>
          <div className="px-5 py-5 text-sm text-gray-600 sm:px-6">
            <p><strong className="text-gray-900">{dialog.expense.title}</strong> ({dialog.expense.id}, {formatBDT(dialog.expense.amount)}) {`will be removed and the summary totals will update. This can't be undone.`}</p>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4 sm:px-6">
            <button type="button" data-autofocus onClick={closeDialog} disabled={deleting} className={btnSecondary}>Cancel</button>
            <button type="button" onClick={handleDelete} disabled={deleting} aria-busy={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-50">
              {deleting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              Delete Expense
            </button>
          </div>
        </Modal>
      )}

      <Toasts toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}
