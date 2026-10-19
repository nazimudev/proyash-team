/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, RotateCcw, MoreVertical, Pencil, Power, Trash2, AlertCircle, CheckCircle2, Info, Layers, ToggleRight, ToggleLeft, Inbox } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import EmptyState from "@/components/admin/ui/EmptyState";
import Modal, {
  btnPrimary,
  btnSecondary,
  btnDanger,
  inputCls,
} from "../donation/Modal";
import PaymentMethodFormDialog from "./PaymentMethodFormDialog";
import PaymentMethodConfirmDialog from "./PaymentMethodConfirmDialog";
import PublicPreview from "./PublicPreview";
import { PAYMENT_TYPES, typeInfo, calculateSummary, filterMethods, EMPTY_FILTERS, activationIssues, emptyMethodValues, methodToValues, formValuesToMethod, NOT_CONFIGURED } from "@/lib/paymentMethodUtils";
import { formatDate } from "@/lib/donationUtils";
import * as api from "@/services/paymentMethodService";

function RowMenu({ method, onAction }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); wrap.current?.querySelector("button")?.focus(); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    wrap.current?.querySelector('[role="menuitem"]')?.focus();
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const items = [
    { key: "edit", label: "Edit", Icon: Pencil },
    { key: "toggle", label: method.isActive ? "Deactivate" : "Activate", Icon: Power },
    { key: "delete", label: "Delete", Icon: Trash2, danger: true },
  ];
  const onMenuKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = [...wrap.current.querySelectorAll('[role="menuitem"]')];
    const i = btns.indexOf(document.activeElement);
    btns[(i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length].focus();
  };
  return (
    <div ref={wrap} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={`Actions for ${method.name}`} onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div role="menu" onKeyDown={onMenuKey} className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map(({ key, label, Icon, danger }) => (
            <button key={key} type="button" role="menuitem" onClick={() => { setOpen(false); onAction(key, method); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none ${danger ? "text-red-700" : "text-gray-700"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Pill({ children }) {
  return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{children}</span>;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [dialog, setDialog] = useState(null); // { type: add|edit|toggle|delete, method?, formValues? }
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoadState("loading");
    try { setMethods(await api.fetchPaymentMethods()); setLoadState("ready"); } catch { setLoadState("error"); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const summary = useMemo(() => calculateSummary(methods), [methods]);
  const visible = useMemo(() => filterMethods(methods, filters), [methods, filters]);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const notify = (message, tone = "success") => setToast({ message, tone });
  const patchLocal = (id, patch) => setMethods((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const closeDialog = () => { if (!busy) setDialog(null); };
  const setFilter = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value }));

  const run = async (fn, okMessage) => {
    setBusy(true);
    try { await fn(); notify(okMessage); setDialog(null); }
    catch { notify("Something went wrong. Please try again.", "error"); }
    finally { setBusy(false); }
  };

  const openAdd = () => setDialog({ type: "add", formValues: emptyMethodValues(methods.reduce((m, x) => Math.max(m, x.displayOrder), 0) + 1) });

  const onRowAction = async (key, method) => {
    if (key === "edit") return setDialog({ type: "edit", method, formValues: methodToValues(method) });
    if (key === "delete") return setDialog({ type: "delete", method });
    if (method.isActive) return setDialog({ type: "toggle", method }); // deactivation asks for confirmation
    const issues = activationIssues(method);
    if (issues.length) return notify(`${method.name} can't be activated yet. Please ${issues.join(" and ")}.`, "error");
    try { patchLocal(method.id, await api.activatePaymentMethod(method.id)); notify(`${method.name} activated (local preview only).`); }
    catch { notify("Something went wrong. Please try again.", "error"); }
  };

  const saveForm = (values) => {
    const { type, method } = dialog;
    return run(async () => {
      const data = formValuesToMethod(values);
      if (type === "edit") {
        const res = await api.updatePaymentMethod(method.id, data); // keeps the existing id
        patchLocal(method.id, { ...data, ...res });
      } else {
        const created = await api.createPaymentMethod(data);
        setMethods((l) => [...l, created]);
      }
    }, type === "edit" ? "Payment method updated (local preview only)." : "Payment method saved (local preview only).");
  };

  const confirmToggle = () => {
    const { method } = dialog;
    return run(async () => patchLocal(method.id, await api.deactivatePaymentMethod(method.id)), `${method.name} deactivated (local preview only).`);
  };
  const confirmDelete = () => {
    const { method } = dialog;
    return run(async () => {
      await api.deletePaymentMethod(method.id);
      setMethods((l) => l.filter((x) => x.id !== method.id));
    }, `${method.name} deleted (local preview only).`);
  };

  const dm = dialog?.method;

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> Finance <span aria-hidden="true">/</span> <span className="text-gray-900">Donation Settings</span>
      </nav>
      <PageHeader
        title="Donation Settings"
        description="Manage the payment methods donors can use to contribute to Proyash Songgothon."
        action={
          <button type="button" className={btnPrimary} onClick={openAdd} disabled={loadState !== "ready"}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add Payment Method
          </button>
        }
      />

      <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          Active payment methods can appear on the public donation page once settings are saved and connected to the backend.
          Right now changes exist only in this browser session. The public website has not been updated, and the data shown is sample data.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Methods" icon={Layers} value={summary.total} />
        <StatCard label="Active Methods" icon={ToggleRight} value={summary.active} />
        <StatCard label="Inactive Methods" icon={ToggleLeft} value={summary.inactive} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-gray-200 bg-white lg:col-span-2" aria-label="Payment methods">
          <div className="grid gap-3 border-b border-gray-100 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
              <input type="search" aria-label="Search payment methods" placeholder="Search by name" value={filters.search} onChange={setFilter("search")} className={`${inputCls} pl-9`} />
            </div>
            <select aria-label="Payment type" value={filters.type} onChange={setFilter("type")} className={inputCls}>
              <option value="all">All Types</option>
              {PAYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select aria-label="Status" value={filters.status} onChange={setFilter("status")} className={inputCls}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} disabled={!hasFilters} className={btnSecondary}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </button>
          </div>

          {loadState === "error" ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
              <p className="text-sm text-gray-700">{`We couldn't load payment methods.`}</p>
              <button type="button" onClick={load} className={btnSecondary}>Try again</button>
            </div>
          ) : loadState === "loading" ? (
            <div className="space-y-3 p-4" role="status" aria-label="Loading payment methods">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded bg-gray-100" />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={Inbox} title={methods.length === 0 ? "No payment methods yet" : "No payment methods match these filters"}
                description={methods.length === 0 ? "Add a payment method to get started." : "Try a different search or reset the filters."} />
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {visible.map((m) => {
                const Icon = typeInfo(m.type).icon;
                const configured = m.accountNumber.trim().length > 0;
                return (
                  <li key={m.id} className="flex flex-wrap items-start gap-x-4 gap-y-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-40 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-gray-900">{m.name}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${m.isActive ? "bg-green-50 text-green-800 ring-green-200" : "bg-gray-100 text-gray-700 ring-gray-200"}`}>
                          {m.isActive ? <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> : <Power className="h-3 w-3" aria-hidden="true" />}
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{typeInfo(m.type).label} · Order {m.displayOrder}</p>
                      <p className={`mt-1 text-sm ${configured ? "text-gray-800" : "text-gray-400"}`}>{configured ? m.accountNumber : NOT_CONFIGURED}</p>
                      {m.accountHolder ? <p className="text-xs text-gray-500">Account holder: {m.accountHolder}</p> : null}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Pill>{m.requiresTransactionId ? "Transaction ID required" : "Transaction ID optional"}</Pill>
                        {m.requiresPhone ? <Pill>Phone required</Pill> : null}
                        {m.requiresPaymentProof ? <Pill>Payment proof required</Pill> : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-gray-500">Updated {m.updatedAt ? formatDate(m.updatedAt) : "—"}</p>
                      <RowMenu method={m} onAction={onRowAction} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="lg:sticky lg:top-20">
          <PublicPreview methods={methods} />
        </div>
      </div>

      <PaymentMethodFormDialog open={dialog?.type === "add" || dialog?.type === "edit"} mode={dialog?.type} initialValues={dialog?.formValues}
        methods={methods} method={dm} saving={busy} onCancel={closeDialog} onSubmit={saveForm} />
      <PaymentMethodConfirmDialog action={dialog?.type === "toggle" ? "deactivate" : dialog?.type === "delete" ? "delete" : null}
        method={dm} busy={busy} onCancel={closeDialog} onConfirm={dialog?.type === "delete" ? confirmDelete : confirmToggle} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-60">
        {toast ? (
          <div className={`pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
            toast.tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-white text-gray-900"}`}>
            {toast.tone === "error" ? <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />}
            {toast.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
