"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, CheckCircle2, AlertCircle, Info, Images, Globe, FileText } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import GalleryToolbar from "./GalleryToolbar";
import GalleryGrid from "./GalleryGrid";
import GalleryImageModal from "./GalleryImageModal";
import GalleryImageForm from "./GalleryImageForm";
import DeletePhotoDialog from "./DeletePhotoDialog";
import GalleryEmptyState from "./GalleryEmptyState";
import { btnPrimary, btnSecondary } from "./ModalShell";
import { EMPTY_GALLERY_FILTERS, PAGE_STEP, filterPhotos, calculateGallerySummary, photoToForm, emptyPhotoForm, formToFields } from "@/lib/galleryUtils";
import { fetchGalleryPhotos, createPhoto, updatePhoto, setPhotoStatus, deletePhoto } from "@/services/galleryService";

const NOT_CONNECTED = "Not saved. The gallery API isn't connected yet, so nothing was changed.";
const isNotConnected = (e) => e?.name === "BackendNotConnectedError";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [filters, setFilters] = useState(EMPTY_GALLERY_FILTERS);
  const [view, setView] = useState("grid");
  const [visible, setVisible] = useState(PAGE_STEP);
  const [dialog, setDialog] = useState(null); // { type: view | add | edit | delete, id? }
  const [savingAs, setSavingAs] = useState(null);
  const [formNotice, setFormNotice] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toast, setToast] = useState(null);
  const inFlight = useRef(false);
  const pendingStatus = useRef(new Set());

  const load = useCallback(async () => {
    setLoadState("loading");
    try { setPhotos(await fetchGalleryPhotos()); setLoadState("ready"); } catch { setLoadState("error"); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const byId = useMemo(() => Object.fromEntries(photos.map((p) => [p.id, p])), [photos]);
  const summary = useMemo(() => calculateGallerySummary(photos), [photos]);
  const filtered = useMemo(() => filterPhotos(photos, filters), [photos, filters]);
  const shown = filtered.slice(0, visible);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_GALLERY_FILTERS);
  const current = dialog?.id ? byId[dialog.id] ?? null : null;

  const changeFilter = (k, v) => { setFilters((f) => ({ ...f, [k]: v })); setVisible(PAGE_STEP); };
  const clearFilters = () => { setFilters(EMPTY_GALLERY_FILTERS); setVisible(PAGE_STEP); };
  const closeDialog = () => { if (!savingAs && !deleteBusy) { setDialog(null); setFormNotice(null); setDeleteError(null); } };
  const openAdd = () => { setFormNotice(null); setDialog({ type: "add" }); };

  const onAction = (key, photo) => {
    if (key === "view") return setDialog({ type: "view", id: photo.id });
    if (key === "edit") { setFormNotice(null); return setDialog({ type: "edit", id: photo.id }); }
    if (key === "delete") { setDeleteError(null); return setDialog({ type: "delete", id: photo.id }); }
    if (key === "toggle") return togglePublish(photo);
  };

  // Nothing changes locally unless the service resolves (i.e. the backend confirmed).
  const togglePublish = async (photo) => {
    if (pendingStatus.current.has(photo.id)) return;
    pendingStatus.current.add(photo.id);
    const next = photo.status === "published" ? "draft" : "published";
    try {
      const res = await setPhotoStatus(photo.id, next);
      setPhotos((l) => l.map((p) => (p.id === photo.id ? { ...p, ...(res?.photo ?? {}), status: res?.photo?.status ?? next } : p)));
      setToast({ tone: "success", text: next === "published" ? "Photo published." : "Photo unpublished." });
    } catch (e) {
      setToast(isNotConnected(e) ? { tone: "info", text: NOT_CONNECTED } : { tone: "error", text: "The status change failed. Please try again." });
    } finally { pendingStatus.current.delete(photo.id); }
  };

  const submitForm = async (values, status) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSavingAs(status);
    setFormNotice(null);
    const editing = dialog.type === "edit";
    try {
      const fields = formToFields(values, status);
      const res = editing ? await updatePhoto(dialog.id, { fields, imageFile: values.imageFile }) : await createPhoto({ fields, imageFile: values.imageFile });
      if (editing) setPhotos((l) => l.map((p) => (p.id === dialog.id ? { ...p, ...(res?.photo ?? fields) } : p)));
      else if (res?.photo) setPhotos((l) => [res.photo, ...l]);
      setToast({ tone: "success", text: editing ? "Photo details saved." : status === "published" ? "Photo published." : "Photo saved as a draft." });
      setDialog(null);
    } catch (e) {
      setFormNotice(isNotConnected(e) ? `${NOT_CONNECTED} Your entries and the selected image are still here.` : "Something went wrong and the photo was not saved. Please try again.");
    } finally { inFlight.current = false; setSavingAs(null); }
  };

  const confirmDelete = async () => {
    if (inFlight.current || !current) return;
    inFlight.current = true;
    setDeleteBusy(true);
    setDeleteError(null);
    const id = current.id;
    try {
      await deletePhoto(id);
      setPhotos((l) => l.filter((p) => p.id !== id));
      setToast({ tone: "success", text: "Photo deleted." });
      setDialog(null);
    } catch (e) {
      setDeleteError(isNotConnected(e) ? NOT_CONNECTED : "Something went wrong and the photo was not deleted. Please try again.");
    } finally { inFlight.current = false; setDeleteBusy(false); }
  };

  const tone = { success: "border-green-200 bg-white text-gray-900", info: "border-amber-200 bg-amber-50 text-amber-900", error: "border-red-200 bg-red-50 text-red-800" };
  const ToastIcon = ({ t }) => (t === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" /> : t === "info" ? <Info className="h-4 w-4 shrink-0" aria-hidden="true" /> : <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />);

  return (
    <div>
      <PageHeader
        title="Gallery Management"
        description="Manage and showcase photos from Proyash Songgothon's activities."
        action={<button type="button" onClick={openAdd} disabled={loadState !== "ready"} className={btnPrimary}><Plus className="h-4 w-4" aria-hidden="true" /> Add New Photo</button>}
      />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Sample data only. The pictures are generated placeholders and the counts are sample counts. Upload, edit, publish, and delete are awaiting API integration, so they can&rsquo;t save changes yet.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Photos" icon={Images} value={summary.total} />
        <StatCard label="Published Photos" icon={Globe} value={summary.published} note="Visible on the public gallery once connected" />
        <StatCard label="Draft Photos" icon={FileText} value={summary.draft} note="Visible to administrators only" />
      </div>

      <div className="space-y-4">
        {loadState === "loading" ? (
          <div role="status" aria-label="Loading photos" className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="aspect-[4/3] animate-pulse bg-gray-100" /><div className="space-y-2 p-3"><div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" /><div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" /></div></div>)}
          </div>
        ) : loadState === "error" ? (
          <GalleryEmptyState variant="error" onRetry={load} />
        ) : photos.length === 0 ? (
          <GalleryEmptyState variant="empty" onAdd={openAdd} />
        ) : (
          <>
            <GalleryToolbar filters={filters} onChange={changeFilter} onClear={clearFilters} hasFilters={hasFilters} view={view} onViewChange={setView} matchCount={filtered.length} totalCount={photos.length} />
            {filtered.length === 0 ? <GalleryEmptyState variant="noResults" onClear={clearFilters} /> : (
              <>
                <GalleryGrid photos={shown} view={view} onAction={onAction} />
                <div className="flex flex-col items-center gap-2 pt-2">
                  <p className="text-sm text-gray-600">Showing {shown.length} of {filtered.length} photo{filtered.length === 1 ? "" : "s"}</p>
                  {shown.length < filtered.length ? <button type="button" onClick={() => setVisible((n) => n + PAGE_STEP)} className={btnSecondary}>Load More</button> : null}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <GalleryImageModal photo={dialog?.type === "view" ? current : null} onClose={closeDialog} onEdit={(p) => { setFormNotice(null); setDialog({ type: "edit", id: p.id }); }} />
      <GalleryImageForm open={dialog?.type === "add" || dialog?.type === "edit"} mode={dialog?.type} photo={current}
        initialValues={dialog?.type === "edit" && current ? photoToForm(current) : emptyPhotoForm()} savingAs={savingAs} notice={formNotice} onCancel={closeDialog} onSubmit={submitForm} />
      <DeletePhotoDialog photo={dialog?.type === "delete" ? current : null} busy={deleteBusy} error={deleteError} onCancel={closeDialog} onConfirm={confirmDelete} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60]">
        {toast ? <div className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg ${tone[toast.tone]}`}><ToastIcon t={toast.tone} />{toast.text}</div> : null}
      </div>
    </div>
  );
}
