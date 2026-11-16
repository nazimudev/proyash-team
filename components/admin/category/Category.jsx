/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  RotateCcw,
  Pencil,
  Trash2,
  AlertCircle,
  SearchX,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/projectCategoryService";

const PAGE_SIZE = 10;

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  status: "active",
};

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CategoryModal({ category, busy, onClose, onSubmit }) {
  const editing = Boolean(category);

  const [form, setForm] = useState(
    category
      ? {
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
          status: category.status || "active",
        }
      : emptyForm,
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(editing);
  const [error, setError] = useState("");

  const handleNameChange = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      ...(!slugManuallyEdited ? { slug: createSlug(value) } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Category slug is required.");
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        status: form.status,
      });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2
              id="category-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {editing ? "Edit Category" : "Add New Category"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {editing
                ? "Update category information."
                : "Create a new project category."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close modal"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Education"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setForm((current) => ({
                  ...current,
                  slug: createSlug(e.target.value),
                }));
              }}
              placeholder="e.g. education"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-gray-400">
              Used in project category URLs.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              placeholder="Write a short category description..."
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  status: e.target.value,
                }))
              }
              className={inputCls}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className={btnSecondary}
            >
              Cancel
            </button>

            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy
                ? "Saving..."
                : editing
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteDialog({ category, busy, onClose, onConfirm }) {
  if (!category) return null;

  const projectCount = Number(category.projects_count || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 className="h-6 w-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Delete Category?
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Are you sure you want to delete{" "}
          <strong className="text-gray-800">{category.name}</strong>? This
          action cannot be undone.
        </p>

        {projectCount > 0 && (
          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            This category has {projectCount} assigned project(s). Reassign those
            projects before deleting this category.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className={btnSecondary}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || projectCount > 0}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {busy ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoadState("loading");

    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
      setLoadState("ready");
    } catch (error) {
      console.error("Category loading error:", error);
      setLoadState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const summary = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      inactive: categories.filter((c) => c.status === "inactive").length,
    };
  }, [categories]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categories.filter((category) => {
      const matchesSearch =
        !query ||
        [category.name, category.slug, category.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!busy) {
      setModalOpen(false);
      setEditingCategory(null);
    }
  };

  const handleSave = async (formData) => {
    setBusy(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        setToast({ text: "Category updated successfully." });
      } else {
        await createCategory(formData);
        setToast({ text: "Category created successfully." });
      }

      setModalOpen(false);
      setEditingCategory(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || busy) return;

    setBusy(true);

    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      setToast({ text: "Category deleted successfully." });
      await load();
    } catch (error) {
      setToast({
        text: error.message || "Failed to delete category.",
        tone: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const hasFilters = search.trim() !== "" || statusFilter !== "all";

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> Projects{" "}
        <span aria-hidden="true">/</span>{" "}
        <span className="text-gray-900">Categories</span>
      </nav>

      <PageHeader
        title="Project Categories"
        description="Manage categories used to organize Proyash projects."
      />

      <div className="mb-6 flex justify-end">
        <button type="button" onClick={openCreateModal} className={btnPrimary}>
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Categories"
          icon={Layers}
          value={summary.total}
          note="All categories"
        />
        <StatCard
          label="Active Categories"
          icon={CheckCircle}
          value={summary.active}
          note="Available for projects"
        />
        <StatCard
          label="Inactive Categories"
          icon={XCircle}
          value={summary.inactive}
          note="Currently disabled"
        />
      </div>

      <section
        aria-label="Project categories"
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        <div className="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by category name or slug..."
              aria-label="Search categories"
              className={`${inputCls} pl-9`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            className={`${inputCls} md:w-44`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className={btnSecondary}
          >
            <RotateCcw className="h-4 w-4" />
            Clear Filters
          </button>
        </div>

        {loadState === "loading" ? (
          <div className="space-y-3 p-4" role="status">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : loadState === "error" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertCircle className="h-7 w-7 text-red-600" />
            <p className="text-sm text-gray-700">
              We couldn&apos;t load the categories.
            </p>
            <button type="button" onClick={load} className={btnSecondary}>
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              {categories.length === 0 ? (
                <FolderKanban className="h-6 w-6" />
              ) : (
                <SearchX className="h-6 w-6" />
              )}
            </span>

            <h2 className="mt-4 text-base font-medium text-gray-900">
              {categories.length === 0
                ? "No categories yet"
                : "No categories found"}
            </h2>

            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {categories.length === 0
                ? "Create your first project category to get started."
                : "Try changing your search or filters."}
            </p>

            {categories.length === 0 ? (
              <button
                type="button"
                onClick={openCreateModal}
                className={`${btnPrimary} mt-4`}
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className={`${btnSecondary} mt-4`}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Slug</th>
                    <th className="px-4 py-3 font-medium">Projects</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created At</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {rows.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50/70">
                      <td className="px-4 py-4 text-gray-500">
                        {start + index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                            {category.description}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {category.slug || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          N/A
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            category.status === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-500">
                        {formatDate(category.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            title="Edit category"
                            aria-label={`Edit ${category.name}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-green-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(category)}
                            title="Delete category"
                            aria-label={`Delete ${category.name}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {start + 1}–{start + rows.length} of {filtered.length}{" "}
                categories
              </p>

              <div className="flex items-center gap-3">
                <span>
                  Page {safePage} of {totalPages}
                </span>

                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {modalOpen && (
        <CategoryModal
          key={editingCategory?.id || "new"}
          category={editingCategory}
          busy={busy}
          onClose={closeModal}
          onSubmit={handleSave}
        />
      )}

      <DeleteDialog
        category={deleteTarget}
        busy={busy}
        onClose={() => !busy && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-60"
      >
        {toast && (
          <div
            className={`pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 shadow-lg ${
              toast.tone === "error" ? "border-red-200" : "border-green-200"
            }`}
          >
            {toast.tone === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            )}
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
