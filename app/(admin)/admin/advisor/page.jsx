/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// src/app/admin/advisors/page.jsx
// Place inside your existing admin layout so it inherits the sidebar, auth guard and <Toaster />.
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import AdvisorFormModal from "@/components/admin/advisor/AdvisorFormModal";
import { deleteAdvisor, getAdvisors } from "@/lib/advisorsApi";

const PER_PAGE = 10;

export default function AdminAdvisorsPage() {
  const [advisors, setAdvisors] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async (targetPage) => {
    setLoading(true);
    try {
      const res = await getAdvisors({
        page: targetPage,
        perPage: PER_PAGE,
        cache: "no-store",
      });
      // If the last item of the last page was deleted, step back one page.
      if (res.data.length === 0 && targetPage > 1) {
        setPage(targetPage - 1);
        return;
      }
      setAdvisors(res.data);
      setMeta(res.meta);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(advisor) {
    setEditing(advisor);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    load(page);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await deleteAdvisor(toDelete.id);
      toast.success(res.message || "Advisor deleted.");
      setToDelete(null);
      load(page);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advisors</h1>
          <p className="text-sm text-gray-500">{meta.total} total</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus className="h-4 w-4" /> Add advisor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : advisors.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 p-14 text-center">
          <Users className="mb-3 h-10 w-10 text-gray-400" />
          <p className="font-medium text-gray-800">No advisors yet</p>
          <p className="mb-4 text-sm text-gray-500">
            Add the first advisor to show them on the public Advisors page.
          </p>
          <button
            onClick={openAdd}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Add advisor
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {advisors.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
            >
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-emerald-50">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.image_url}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-lg font-semibold text-emerald-700/70">
                    {a.name.slice(0, 1)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{a.name}</p>
                <p className="text-sm text-emerald-700">{a.designation}</p>
                <div className="mt-1 space-y-0.5 text-sm text-gray-600">
                  {a.address && (
                    <p className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />{" "}
                      {a.address}
                    </p>
                  )}
                  {a.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />{" "}
                      {a.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => setToDelete(a)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
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

      <AdvisorFormModal
        open={modalOpen}
        advisor={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />

      {toDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Delete {toDelete.name}?</h2>
            <p className="mt-2 text-sm text-gray-600">
              This removes the advisor and their photo from the website. This
              can’t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete advisor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
