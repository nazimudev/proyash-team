"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserPlus, CheckCircle2, AlertCircle, Info } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import FounderCard, { FounderEmptyCard } from "./FounderCard";
import FounderFormModal from "./FounderFormModal";
import FounderPreviewModal from "./FounderPreviewModal";
import FounderConfirmDialog from "./FounderConfirmDialog";
import { btnPrimary, btnSecondary } from "./ModalShell";
import { MAX_FOUNDERS, sortFounders, nextFreeOrder, emptyFounderForm, founderToForm, formToFields } from "@/lib/founderUtils";
import { fetchFounders, createFounder, updateFounder, setFounderStatus, deleteFounder } from "@/services/founderService";
import { demoFounders } from "@/data/founderDemoData";

const NOT_CONNECTED = "Not saved. The founder API isn't connected yet, so nothing was changed.";
const isNotConnected = (e) => e?.name === "BackendNotConnectedError";

export default function FounderManagementPage() {
  const [founders, setFounders] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [demoOn, setDemoOn] = useState(false);
  const [dialog, setDialog] = useState(null); // { type: add | edit | preview | delete | publish | unpublish, id? }
  const [saving, setSaving] = useState(false);
  const [formNotice, setFormNotice] = useState(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState(null);
  const [toast, setToast] = useState(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    setLoadState("loading");
    try { setFounders(await fetchFounders()); setLoadState("ready"); } catch { setLoadState("error"); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Real data comes from the service. Demo profiles are opt-in, local, fictional, and never saved.
  const all = useMemo(() => sortFounders(demoOn ? [...founders, ...demoFounders] : founders), [founders, demoOn]);
  const byId = useMemo(() => Object.fromEntries(all.map((f) => [f.id, f])), [all]);
  const current = dialog?.id ? byId[dialog.id] ?? null : null;
  const canAdd = all.length < MAX_FOUNDERS;
  const slots = Array.from({ length: Math.max(MAX_FOUNDERS, all.length) }, (_, i) => all[i] ?? null);
  const takenOrders = all.filter((f) => f.id !== current?.id).map((f) => f.display_order);

  const closeDialog = () => { if (!saving && !confirmBusy) { setDialog(null); setFormNotice(null); setConfirmError(null); } };
  const openAdd = () => { setFormNotice(null); setDialog({ type: "add" }); };
  const openEdit = (f) => { setFormNotice(null); setDialog({ type: "edit", id: f.id }); };
  const openConfirm = (type) => (f) => { setConfirmError(null); setDialog({ type, id: f.id }); };

  const submitForm = async (values) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setFormNotice(null);
    const editing = dialog.type === "edit";
    try {
      const fields = formToFields(values);
      const photoFile = values.photoFile;
      const res = editing ? await updateFounder(dialog.id, { fields, photoFile, removePhoto: values.removePhoto }) : await createFounder({ fields, photoFile });
      if (editing) setFounders((l) => l.map((f) => (f.id === dialog.id ? { ...f, ...(res?.founder ?? fields) } : f)));
      else if (res?.founder) setFounders((l) => [...l, res.founder]);
      setToast({ tone: "success", text: editing ? "Founder profile saved." : "Founder added." });
      setDialog(null);
    } catch (e) {
      setFormNotice(isNotConnected(e) ? `${NOT_CONNECTED} Your entries and the selected photo are still here.` : "Something went wrong and the profile was not saved. Please try again.");
    } finally { inFlight.current = false; setSaving(false); }
  };

  const confirmAction = async () => {
    if (inFlight.current || !current) return;
    inFlight.current = true;
    setConfirmBusy(true);
    setConfirmError(null);
    const { type } = dialog;
    const id = current.id;
    try {
      if (type === "delete") {
        await deleteFounder(id);
        setFounders((l) => l.filter((f) => f.id !== id));
      } else {
        const next = type === "publish" ? "published" : "draft";
        const res = await setFounderStatus(id, next);
        setFounders((l) => l.map((f) => (f.id === id ? { ...f, ...(res?.founder ?? {}), status: res?.founder?.status ?? next } : f)));
      }
      setToast({ tone: "success", text: type === "delete" ? "Founder profile deleted." : type === "publish" ? "Profile published." : "Profile unpublished." });
      setDialog(null);
    } catch (e) {
      setConfirmError(isNotConnected(e) ? NOT_CONNECTED : "Something went wrong and nothing was changed. Please try again.");
    } finally { inFlight.current = false; setConfirmBusy(false); }
  };

  const tone = { success: "border-green-200 bg-white text-gray-900", info: "border-amber-200 bg-amber-50 text-amber-900", error: "border-red-200 bg-red-50 text-red-800" };
  const confirmType = ["delete", "publish", "unpublish"].includes(dialog?.type) ? dialog.type : null;

  return (
    <div>
      <PageHeader
        title="Founder Management"
        description="Manage the official founder profiles and messages displayed on the Proyash website."
        action={
          <button type="button" onClick={openAdd} disabled={loadState !== "ready" || !canAdd} title={canAdd ? undefined : "Two founder profiles already exist"} className={btnPrimary}>
            <UserPlus className="h-4 w-4" aria-hidden="true" /> + Add Founder
          </button>
        }
      />

      <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>The founder API isn&rsquo;t connected yet. No founder information has been entered, and adding, editing, publishing, or deleting can&rsquo;t save changes until it is. Only verified information supplied by the founders should be entered here.</span>
      </p>

      {loadState === "loading" ? (
        <div role="status" aria-label="Loading founder profiles" className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => <div key={i} className="h-72 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />)}
        </div>
      ) : loadState === "error" ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
          <h2 className="mt-3 text-base font-medium text-gray-900">We couldn&rsquo;t load the founder profiles</h2>
          <p className="mt-1 text-sm text-gray-500">Something went wrong while loading. Please try again.</p>
          <button type="button" onClick={load} className={`${btnSecondary} mt-4`}>Retry</button>
        </div>
      ) : (
        <div className="space-y-4">
          {all.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <h2 className="font-medium text-gray-900">No founder information has been added yet</h2>
              <p className="mt-1">Add verified information for the two founders: their names, designations, optional photos, biographies, and messages. Nothing is invented for you.</p>
            </div>
          ) : null}
          {all.length > MAX_FOUNDERS ? <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">More than {MAX_FOUNDERS} founder profiles exist. This setup expects exactly {MAX_FOUNDERS}.</p> : null}
          <div className="grid gap-6 lg:grid-cols-2">
            {slots.map((f, i) => f
              ? <FounderCard key={f.id} founder={f} onEdit={openEdit} onPreview={(x) => setDialog({ type: "preview", id: x.id })} onToggle={openConfirm(f.status === "published" ? "unpublish" : "publish")} onDelete={openConfirm("delete")} />
              : <FounderEmptyCard key={`slot-${i}`} slot={i + 1} canAdd={canAdd} onAdd={openAdd} />)}
          </div>
          <div className="flex items-center justify-end gap-3 text-xs text-gray-500">
            <span>Layout check only:</span>
            <button type="button" onClick={() => setDemoOn((x) => !x)} aria-pressed={demoOn} className="rounded-md border border-gray-300 bg-white px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
              {demoOn ? "Hide fictional demo profiles" : "Show fictional demo profiles"}
            </button>
          </div>
        </div>
      )}

      <FounderFormModal open={dialog?.type === "add" || dialog?.type === "edit"} mode={dialog?.type} founder={current}
        initialValues={dialog?.type === "edit" && current ? founderToForm(current) : emptyFounderForm(nextFreeOrder(all))}
        takenOrders={takenOrders} saving={saving} notice={formNotice} onCancel={closeDialog} onSubmit={submitForm} />
      <FounderPreviewModal founder={dialog?.type === "preview" ? current : null} onClose={closeDialog} />
      <FounderConfirmDialog type={confirmType} founder={current} busy={confirmBusy} error={confirmError} onCancel={closeDialog} onConfirm={confirmAction} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60]">
        {toast ? <div className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${tone[toast.tone]}`}>
          {toast.tone === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" /> : <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}{toast.text}</div> : null}
      </div>
    </div>
  );
}
