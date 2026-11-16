/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// src/app/admin/contact-messages/page.jsx
// Place inside your existing admin layout so it inherits the sidebar, auth guard and <Toaster />.
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ContactMessageFilters from "./ContactMessageFilters";
import ContactMessageTable from "./ContactMessageTable";
import ContactMessageDetails from "./ContactMessageDetails";
import {
  deleteContactMessage,
  getContactMessages,
  updateContactMessageStatus,
} from "@/services/contactMessagesApi";

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    unread_count: 0,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(null);

  // Debounce search input and go back to page 1 when filters change.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getContactMessages({
        page,
        search: debouncedSearch,
        status,
      });
      if (res.data.length === 0 && page > 1) {
        setPage(page - 1);
        return;
      }
      setMessages(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(message, next, { silent = false } = {}) {
    setBusy(true);
    try {
      const res = await updateContactMessageStatus(message.id, next);
      setSelected((cur) => (cur && cur.id === message.id ? res.data : cur));
      if (!silent) toast.success("Status updated.");
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  function openMessage(message) {
    setSelected(message);
    if (message.status === "unread")
      changeStatus(message, "read", { silent: true });
  }

  async function confirmDelete() {
    setBusy(true);
    try {
      await deleteContactMessage(confirming.id);
      toast.success("Message deleted.");
      if (selected?.id === confirming.id) setSelected(null);
      setConfirming(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        {meta.unread_count > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            {meta.unread_count} unread
          </span>
        )}
      </div>

      <ContactMessageFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={(s) => {
          setStatus(s);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 p-14 text-center">
          <Inbox className="mb-3 h-10 w-10 text-gray-400" />
          <p className="font-medium text-gray-800">No messages found</p>
          <p className="text-sm text-gray-500">
            Try a different search or status filter.
          </p>
        </div>
      ) : (
        <ContactMessageTable
          messages={messages}
          onView={openMessage}
          onDelete={setConfirming}
        />
      )}

      {meta.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <ContactMessageDetails
        message={selected}
        busy={busy}
        onClose={() => setSelected(null)}
        onStatus={(next) => changeStatus(selected, next)}
        onDelete={() => setConfirming(selected)}
      />

      {confirming && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Delete this message?</h2>
            <p className="mt-2 text-sm text-gray-600">
              The message from {confirming.name} will be permanently removed.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirming(null)}
                disabled={busy}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Delete
                message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
