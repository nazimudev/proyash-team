"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, RotateCcw, Inbox, SearchX, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, MessageSquare, MailPlus, MailOpen, CheckCheck } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import MessagesTable from "./MessagesTable";
import MessageDetailDialog from "./MessageDetailDialog";
import DeleteMessageDialog from "./DeleteMessageDialog";
import { btnSecondary, inputCls } from "./ModalShell";
import { PAGE_SIZE, STATUS_FILTERS, EMPTY_MESSAGE_FILTERS, filterMessages, summarizeMessages } from "@/lib/contactMessageUtils";
import { fetchContactMessages, fetchContactMessage, updateMessageStatus, deleteContactMessage } from "@/services/contactMessageService";

const NOT_CONNECTED = "Not saved. The contact message API isn't connected yet, so nothing was changed.";
const isNotConnected = (e) => e?.name === "BackendNotConnectedError";
const SUCCESS = { read: "Marked as read.", replied: "Marked as replied.", archived: "Message archived.", restore: "Message restored." };

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [filters, setFilters] = useState(EMPTY_MESSAGE_FILTERS);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null); // { type: "view" | "delete", id }
  const [detail, setDetail] = useState(null);
  const [detailState, setDetailState] = useState("loading"); // loading | ready | error
  const [detailTick, setDetailTick] = useState(0);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [toast, setToast] = useState(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    setLoadState("loading");
    try { setMessages(await fetchContactMessages()); setLoadState("ready"); } catch { setLoadState("error"); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Loads the full message whenever a details view opens (the list endpoint may only return previews).
  const viewId = dialog?.type === "view" ? dialog.id : null;
  useEffect(() => {
    if (!viewId) return;
    let cancelled = false;
    setDetail(null);
    setDetailState("loading");
    fetchContactMessage(viewId).then((d) => { if (!cancelled) { setDetail(d); setDetailState("ready"); } }).catch(() => { if (!cancelled) setDetailState("error"); });
    return () => { cancelled = true; };
  }, [viewId, detailTick]);

  const byId = useMemo(() => Object.fromEntries(messages.map((x) => [x.id, x])), [messages]);
  const summary = useMemo(() => summarizeMessages(messages), [messages]);
  const filtered = useMemo(() => filterMessages(messages, filters), [messages, filters]);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_MESSAGE_FILTERS);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);
  const current = dialog?.id ? byId[dialog.id] ?? null : null;

  const setFilter = (k) => (e) => { setFilters((f) => ({ ...f, [k]: e.target.value })); setPage(1); };
  const clear = () => { setFilters(EMPTY_MESSAGE_FILTERS); setPage(1); };
  const closeDialog = () => { if (!busy && !deleteBusy) { setDialog(null); setNotice(null); setDeleteError(null); } };
  const openView = (m) => { setNotice(null); setDialog({ type: "view", id: m.id }); };

  // Nothing changes locally unless the service resolves (the backend confirmed).
  const changeStatus = async (action) => {
    if (inFlight.current || !current) return;
    inFlight.current = true;
    setBusy(action);
    setNotice(null);
    const id = current.id;
    const next = action === "restore" ? "read" : action; // ASSUMPTION: restoring returns a message to "read"
    try {
      const res = await updateMessageStatus(id, action);
      setMessages((l) => l.map((x) => (x.id === id ? { ...x, ...(res?.message ?? {}), status: res?.message?.status ?? next } : x)));
      setToast({ tone: "success", text: SUCCESS[action] });
    } catch (e) {
      setNotice(isNotConnected(e) ? NOT_CONNECTED : "Something went wrong and the status was not changed. Please try again.");
    } finally { inFlight.current = false; setBusy(null); }
  };

  const confirmDelete = async () => {
    if (inFlight.current || !current) return;
    inFlight.current = true;
    setDeleteBusy(true);
    setDeleteError(null);
    const id = current.id;
    try {
      await deleteContactMessage(id);
      setMessages((l) => l.filter((x) => x.id !== id));
      setToast({ tone: "success", text: "Message deleted." });
      setDialog(null);
    } catch (e) {
      setDeleteError(isNotConnected(e) ? NOT_CONNECTED : "Something went wrong and the message was not deleted. Please try again.");
    } finally { inFlight.current = false; setDeleteBusy(false); }
  };

  const noMessages = loadState === "ready" && messages.length === 0;

  return (
    <div>
      <PageHeader title="Contact Messages" description="View and manage messages submitted through the Proyash Songgothon website." />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Sample data only: fictional senders with fake contact details, and sample counts. The contact message API isn&rsquo;t connected yet, so status changes and deletion can&rsquo;t be saved.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Messages" icon={MessageSquare} value={summary.total} />
        <StatCard label="New Messages" icon={MailPlus} value={summary.new} />
        <StatCard label="Read Messages" icon={MailOpen} value={summary.read} />
        <StatCard label="Replied Messages" icon={CheckCheck} value={summary.replied} />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white" aria-label="Contact messages">
        <div className="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input type="search" aria-label="Search messages" value={filters.search} onChange={setFilter("search")} placeholder="Search by name, phone, email, or subject" className={`${inputCls} pl-9`} />
          </div>
          <select aria-label="Status" value={filters.status} onChange={setFilter("status")} className={`${inputCls} md:w-44`}>
            {STATUS_FILTERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select aria-label="Sort" value={filters.sort} onChange={setFilter("sort")} className={`${inputCls} md:w-40`}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button type="button" onClick={clear} disabled={!hasFilters} className={btnSecondary}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters</button>
        </div>

        {loadState === "loading" ? (
          <div className="space-y-3 p-4" role="status" aria-label="Loading messages">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />)}</div>
        ) : loadState === "error" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-700">We couldn&rsquo;t load the messages.</p>
            <button type="button" onClick={load} className={btnSecondary}>Retry</button>
          </div>
        ) : noMessages || filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">{noMessages ? <Inbox className="h-6 w-6" aria-hidden="true" /> : <SearchX className="h-6 w-6" aria-hidden="true" />}</span>
            <h2 className="mt-4 text-base font-medium text-gray-900">{noMessages ? "No messages received yet" : "No messages found"}</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">{noMessages ? "Messages sent through the website contact form will appear here." : "No messages match the current search or filters."}</p>
            {!noMessages ? <button type="button" onClick={clear} className={`${btnSecondary} mt-4`}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters</button> : null}
          </div>
        ) : (
          <>
            <MessagesTable messages={rows} onView={openView} />
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {start + 1}–{start + rows.length} of {filtered.length} message{filtered.length === 1 ? "" : "s"}</p>
              <div className="flex items-center gap-3">
                <span>Page {safePage} of {totalPages}</span>
                <button type="button" className={btnSecondary} onClick={() => setPage(safePage - 1)} disabled={safePage <= 1}><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous</button>
                <button type="button" className={btnSecondary} onClick={() => setPage(safePage + 1)} disabled={safePage >= totalPages}>Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
              </div>
            </div>
          </>
        )}
      </section>

      <MessageDetailDialog message={dialog?.type === "view" ? current : null} detail={detail} detailState={detailState} onRetry={() => setDetailTick((t) => t + 1)}
        busy={busy} notice={notice} onStatus={changeStatus} onDelete={() => { setDeleteError(null); setDialog((d) => ({ ...d, type: "delete" })); }} onClose={closeDialog} />
      <DeleteMessageDialog message={dialog?.type === "delete" ? current : null} busy={deleteBusy} error={deleteError} onCancel={() => { if (!deleteBusy) setDialog((d) => ({ ...d, type: "view" })); }} onConfirm={confirmDelete} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60]">
        {toast ? <div className="pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />{toast.text}</div> : null}
      </div>
    </div>
  );
}
