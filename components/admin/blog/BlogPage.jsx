"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  RotateCcw,
  Newspaper,
  CheckCircle2,
  Clock,
  AlertCircle,
  Inbox,
  SearchX,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
} from "lucide-react";
import BlogList from "./BlogList";
import BlogFormModal from "./BlogFormModal";
import {
  fetchBlogs,
  fetchBlogById,
  fetchBlogCategories,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
} from "@/services/blogService";
import { getBlogErrorMessage } from "@/utils/blogUtils";

const PER_PAGE = 10;
const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-60";
const btnPrimary = `${btnBase} bg-green-600 text-white hover:bg-green-700`;
const btnSecondary = `${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
const btnDanger = `${btnBase} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600`;

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-gray-900">
        {value ?? "—"}
      </p>
    </div>
  );
}

function DeleteDialog({ state, onCancel, onConfirm }) {
  const ref = useRef(null);
  const open = !!state;
  useEffect(() => {
    const d = ref.current;
    if (d && open && !d.open) d.showModal();
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      aria-labelledby="blog-delete-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!state.busy) onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !state.busy) onCancel();
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-md rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-gray-900/50"
    >
      <div className="space-y-4 p-5">
        <h2
          id="blog-delete-title"
          className="text-base font-semibold text-gray-900"
        >
          Delete this post?
        </h2>
        <p className="wrap-break-word rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-900">
          {state.post.title}
        </p>
        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <p>
            This removes the post from the website once the server confirms. It
            may not be reversible.
          </p>
        </div>
        {state.error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            {state.error}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={state.busy}
            className={btnSecondary}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={state.busy}
            className={btnDanger}
          >
            {state.busy ? "Deleting…" : "Delete Post"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: PER_PAGE,
    total: 0,
  });
  const [listState, setListState] = useState("loading"); // loading | ready | error
  const [listError, setListError] = useState(null);
  const [stats, setStats] = useState({
    total: null,
    published: null,
    draft: null,
  });
  const [categories, setCategories] = useState([]);
  const [catState, setCatState] = useState("loading"); // loading | ready | error
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState(null); // { mode, id?, post?, loading?, loadError? }
  const [del, setDel] = useState(null); // { post, busy, error }
  const [pendingIds, setPendingIds] = useState([]);
  const editToken = useRef(0);
  const apiConfigured = !!process.env.NEXT_PUBLIC_API_URL;

  const refresh = () => setTick((t) => t + 1);

  const loadCategories = useCallback(async () => {
    setCatState("loading");
    try {
      setCategories(await fetchBlogCategories());
      setCatState("ready");
    } catch {
      setCatState("error");
    }
  }, []);
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const ctrl = new AbortController();
    setListState("loading");
    fetchBlogs(
      {
        page,
        per_page: PER_PAGE,
        search: debounced,
        status,
        category_id: categoryId,
      },
      { signal: ctrl.signal },
    )
      .then(({ items, meta: m }) => {
        if (items.length === 0 && page > 1 && m.lastPage < page) {
          setPage(Math.max(1, m.lastPage));
          return;
        } // last item on a page was removed
        setPosts(items);
        setMeta(m);
        setListError(null);
        setListState("ready");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setListError(getBlogErrorMessage(err, "We couldn't load the posts."));
        setListState("error");
      });
    return () => ctrl.abort();
  }, [page, debounced, status, categoryId, tick]);

  // The totals come from the list endpoint's own `total` (one small request per status), not from a separate stats endpoint.
  useEffect(() => {
    let live = true;
    Promise.allSettled([
      fetchBlogs({ per_page: 1 }),
      fetchBlogs({ per_page: 1, status: "published" }),
      fetchBlogs({ per_page: 1, status: "draft" }),
    ]).then(([a, b, c]) => {
      if (live)
        setStats({
          total: a.value?.meta.total ?? null,
          published: b.value?.meta.total ?? null,
          draft: c.value?.meta.total ?? null,
        });
    });
    return () => {
      live = false;
    };
  }, [tick]);

  const hasFilters = search !== "" || status !== "all" || categoryId !== "all";
  const clearFilters = () => {
    setSearch("");
    setDebounced("");
    setStatus("all");
    setCategoryId("all");
    setPage(1);
  };

  const openCreate = () => setForm({ mode: "create" });
  const loadForEdit = useCallback(async (id) => {
    const token = ++editToken.current;
    setForm({ mode: "edit", id, post: null, loading: true, loadError: null });
    try {
      const post = await fetchBlogById(id);
      if (editToken.current === token)
        setForm({ mode: "edit", id, post, loading: false, loadError: null });
    } catch (err) {
      if (editToken.current === token)
        setForm({
          mode: "edit",
          id,
          post: null,
          loading: false,
          loadError: getBlogErrorMessage(err, "We couldn't load this post."),
        });
    }
  }, []);
  const openEdit = (post) => loadForEdit(post.id);
  const closeForm = () => {
    editToken.current++;
    setForm(null);
  };

  // Resolves only after the API confirms; the modal shows any error and keeps the entries.
  const submitForm = async (formData) => {
    const editing = form.mode === "edit";
    if (editing) await updateBlog(form.id, formData);
    else await createBlog(formData);
    toast.success(editing ? "Post updated." : "Post created.");
    setForm(null);
    if (!editing) setPage(1);
    refresh();
  };

  const togglePublish = async (post) => {
    if (pendingIds.includes(post.id)) return;
    const publishing = post.status !== "published";
    setPendingIds((l) => [...l, post.id]);
    try {
      if (publishing) await publishBlog(post.id);
      else await unpublishBlog(post.id);
      toast.success(publishing ? "Post published." : "Post unpublished.");
      refresh();
    } catch (err) {
      toast.error(
        getBlogErrorMessage(
          err,
          publishing
            ? "The post was not published."
            : "The post was not unpublished.",
        ),
      );
    } finally {
      setPendingIds((l) => l.filter((x) => x !== post.id));
    }
  };

  const confirmDelete = async () => {
    if (!del || del.busy) return;
    setDel((d) => ({ ...d, busy: true, error: null }));
    try {
      await deleteBlog(del.post.id);
      toast.success("Post deleted.");
      setDel(null);
      refresh();
    } catch (err) {
      setDel((d) => ({
        ...d,
        busy: false,
        error: getBlogErrorMessage(
          err,
          "The post was not deleted. Please try again.",
        ),
      }));
    }
  };

  const noPosts = listState === "ready" && meta.total === 0 && !hasFilters;
  const from = meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1;
  const to = Math.min(meta.currentPage * meta.perPage, meta.total);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Blog &amp; News
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create, edit, and publish the blog and news posts shown on the
            Proyash website.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={btnPrimary}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add New Post
        </button>
      </div>

      {!apiConfigured ? (
        <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          NEXT_PUBLIC_API_URL isn&rsquo;t set, so no request can be made yet.
        </p>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Posts" value={stats.total} icon={Newspaper} />
        <StatCard
          label="Published Posts"
          value={stats.published}
          icon={CheckCircle2}
        />
        <StatCard label="Draft Posts" value={stats.draft} icon={Clock} />
      </div>

      <section
        className="rounded-xl border border-gray-200 bg-white"
        aria-label="Blog posts"
      >
        <div className="grid gap-3 border-b border-gray-100 p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title"
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            aria-label="Status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={`${inputCls} md:w-40`}
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select
            aria-label="Category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className={`${inputCls} md:w-48`}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className={btnSecondary}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear Filters
          </button>
        </div>
        {catState === "error" ? (
          <p className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-2 text-xs text-amber-900">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Categories couldn&rsquo;t be loaded, so the category filter is empty
            and posts can&rsquo;t be created yet.{" "}
            <button
              type="button"
              onClick={loadCategories}
              className="font-medium underline"
            >
              Retry
            </button>
          </p>
        ) : null}

        {listState === "loading" ? (
          <div
            className="space-y-3 p-4"
            role="status"
            aria-label="Loading posts"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : listState === "error" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            <p className="max-w-md text-sm text-gray-700">{listError}</p>
            <button type="button" onClick={refresh} className={btnSecondary}>
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              {noPosts ? (
                <Inbox className="h-6 w-6" aria-hidden="true" />
              ) : (
                <SearchX className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
            <h2 className="mt-4 text-base font-medium text-gray-900">
              {noPosts ? "No posts yet" : "No posts found"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              {noPosts
                ? "Add your first blog or news post."
                : "No posts match the current search or filters."}
            </p>
            <div className="mt-4">
              {noPosts ? (
                <button
                  type="button"
                  onClick={openCreate}
                  className={btnPrimary}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add New Post
                </button>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={btnSecondary}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" /> Clear
                  Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <BlogList
              posts={posts}
              pendingIds={pendingIds}
              onEdit={openEdit}
              onDelete={(p) => setDel({ post: p, busy: false, error: null })}
              onTogglePublish={togglePublish}
            />
            <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {from}–{to} of {meta.total} post
                {meta.total === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-3">
                <span>
                  Page {meta.currentPage} of {meta.lastPage}
                </span>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(meta.currentPage - 1)}
                  disabled={meta.currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />{" "}
                  Previous
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => setPage(meta.currentPage + 1)}
                  disabled={meta.currentPage >= meta.lastPage}
                >
                  Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <BlogFormModal
        open={!!form}
        mode={form?.mode}
        post={form?.post ?? null}
        loading={!!form?.loading}
        loadError={form?.loadError ?? null}
        onRetryLoad={() => form?.id != null && loadForEdit(form.id)}
        categories={categories}
        categoriesState={catState}
        onRetryCategories={loadCategories}
        onSubmit={submitForm}
        onClose={closeForm}
      />
      <DeleteDialog
        state={del}
        onCancel={() => setDel(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
