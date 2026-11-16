"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import {
  generateSlug,
  validateBlogForm,
  emptyBlogForm,
  postToFormValues,
  buildBlogFormData,
  getBlogImageUrl,
  getBlogErrorMessage,
  BLOG_LIMITS,
  IMAGE_MAX_BYTES,
} from "@/utils/blogUtils";
import Image from "next/image";

const ORDER = [
  "title",
  "slug",
  "excerpt",
  "content",
  "featured_image",
  "category_id",
  "author_name",
  "status",
  "published_at",
];
const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 disabled:bg-gray-50 aria-invalid:border-red-500";
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-60";
const btnPrimary = `${btnBase} bg-green-600 text-white hover:bg-green-700`;
const btnSecondary = `${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
const ctl = (name, errors) => ({
  id: `bf-${name}`,
  "aria-invalid": errors[name] ? true : undefined,
  "aria-describedby": errors[name] ? `bf-${name}-err` : undefined,
});

function Field({ name, label, required, error, hint, children }) {
  return (
    <div>
      <label
        htmlFor={`bf-${name}`}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}{" "}
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-normal text-gray-400">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
      {error ? (
        <p id={`bf-${name}-err`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FormBody({ mode, post, categories, onSubmit, onClose, onBusyChange }) {
  const [v, setV] = useState(() =>
    mode === "edit" ? postToFormValues(post) : emptyBlogForm(),
  );
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit"); // never rewrite an existing post's slug automatically
  const [previewUrl, setPreviewUrl] = useState(null);
  const inFlight = useRef(false);
  const fileRef = useRef(null);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!v.imageFile || !v.imageFile.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(v.imageFile); // client-only; revoked when the file changes or the form closes
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [v.imageFile]);

  const clearErr = (k) =>
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er));
  const set = (k) => (e) => {
    const value = e.target.value;
    setV((p) => ({ ...p, [k]: value }));
    clearErr(k);
  };
  const onTitle = (e) => {
    const title = e.target.value;
    setV((p) => ({
      ...p,
      title,
      ...(slugTouched ? {} : { slug: generateSlug(title) }),
    }));
    clearErr("title");
    if (!slugTouched) clearErr("slug");
  };

  const existingUrl =
    isEdit && !v.removeImage ? getBlogImageUrl(post?.featured_image) : null;
  const shownImage = previewUrl ?? existingUrl;

  const submit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    setBanner(null);
    const found = validateBlogForm(v);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`bf-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSaving(true);
    onBusyChange(true);
    try {
      await onSubmit(buildBlogFormData(v)); // the page closes the dialog (which resets this form) only after the API confirms
    } catch (err) {
      if (err?.fieldErrors) {
        setErrors(err.fieldErrors);
        const f = ORDER.find((k) => err.fieldErrors[k]);
        if (f) document.getElementById(`bf-${f}`)?.focus();
      }
      setBanner(
        err?.fieldErrors
          ? "The server rejected some entries. Please correct the highlighted fields."
          : getBlogErrorMessage(
              err,
              "The post was not saved. Please try again.",
            ),
      );
    } finally {
      inFlight.current = false;
      setSaving(false);
      onBusyChange(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-5 overflow-y-auto px-5 py-4">
        <p className="text-xs text-gray-500">
          <span className="text-red-600">*</span> marks required fields.
        </p>
        <Field name="title" label="Title" required error={errors.title}>
          <input
            {...ctl("title", errors)}
            value={v.title}
            onChange={onTitle}
            disabled={saving}
            className={inputCls}
          />
        </Field>
        <Field
          name="slug"
          label="Slug"
          required
          error={errors.slug}
          hint="Filled in from the title. You can edit it."
        >
          <div className="flex gap-2">
            <input
              {...ctl("slug", errors)}
              value={v.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug")(e);
              }}
              disabled={saving}
              className={inputCls}
            />
            <button
              type="button"
              disabled={saving || !v.title.trim()}
              onClick={() => {
                setSlugTouched(false);
                setV((p) => ({ ...p, slug: generateSlug(p.title) }));
                clearErr("slug");
              }}
              className={`${btnSecondary} shrink-0 px-3`}
            >
              Regenerate
            </button>
          </div>
        </Field>
        <Field
          name="excerpt"
          label="Excerpt"
          required
          error={errors.excerpt}
          hint={`${v.excerpt.length} / ${BLOG_LIMITS.excerpt}`}
        >
          <textarea
            {...ctl("excerpt", errors)}
            rows={3}
            value={v.excerpt}
            onChange={set("excerpt")}
            disabled={saving}
            className={inputCls}
          />
        </Field>
        <Field name="content" label="Content" required error={errors.content}>
          <textarea
            {...ctl("content", errors)}
            rows={10}
            value={v.content}
            onChange={set("content")}
            disabled={saving}
            className={inputCls}
          />
        </Field>

        <Field
          name="featured_image"
          label="Featured image"
          error={errors.featured_image}
          hint={`JPG, PNG, or WebP up to ${IMAGE_MAX_BYTES / 1024 / 1024} MB.${isEdit ? " Leave it unchanged to keep the current image." : ""}`}
        >
          <input
            {...ctl("featured_image", errors)}
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={saving}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              if (f) {
                setV((p) => ({ ...p, imageFile: f, removeImage: false }));
                clearErr("featured_image");
              }
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap items-center gap-4">
            {shownImage ? (
              <Image
                src={shownImage}
                width={500}
                height={500}
                alt="Featured image preview"
                className="h-24 w-36 rounded-lg border border-gray-200 object-cover"
              />
            ) : null}
            <div className="space-y-2">
              {v.imageFile ? (
                <p className="break-all text-sm text-gray-700">
                  {v.imageFile.name}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={saving}
                  className={`${btnSecondary} px-3 py-1.5`}
                >
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  {shownImage ? "Replace image" : "Choose image"}
                </button>
                {shownImage ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setV((p) => ({
                        ...p,
                        imageFile: null,
                        removeImage: true,
                      }));
                      clearErr("featured_image");
                    }}
                    className={`${btnSecondary} px-3 py-1.5`}
                  >
                    Remove image
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="category_id"
            label="Category"
            required
            error={errors.category_id}
          >
            <select
              {...ctl("category_id", errors)}
              value={v.category_id}
              onChange={set("category_id")}
              disabled={saving}
              className={inputCls}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field
            name="author_name"
            label="Author name"
            error={errors.author_name}
          >
            <input
              {...ctl("author_name", errors)}
              value={v.author_name}
              onChange={set("author_name")}
              disabled={saving}
              className={inputCls}
            />
          </Field>
          <Field name="status" label="Status" required error={errors.status}>
            <select
              {...ctl("status", errors)}
              value={v.status}
              onChange={set("status")}
              disabled={saving}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field
            name="published_at"
            label="Published at"
            error={errors.published_at}
            hint="Leave empty to let the system set it when published."
          >
            <input
              {...ctl("published_at", errors)}
              type="datetime-local"
              value={v.published_at}
              onChange={set("published_at")}
              disabled={saving}
              className={inputCls}
            />
          </Field>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={v.is_featured}
            onChange={(e) =>
              setV((p) => ({ ...p, is_featured: e.target.checked }))
            }
            disabled={saving}
            className="mt-0.5 h-4 w-4 accent-green-600"
          />
          <span>
            <span className="font-medium">Featured post</span>
            <br />
            <span className="text-xs text-gray-500">
              Marks the post for highlighted placement.
            </span>
          </span>
        </label>

        {banner ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            {banner}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className={btnSecondary}
        >
          Cancel
        </button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {isEdit ? "Saving…" : "Creating…"}
            </>
          ) : isEdit ? (
            "Save Changes"
          ) : (
            "Create Post"
          )}
        </button>
      </div>
    </form>
  );
}

// open: dialog visible. For edit, `post` is the freshly fetched record; `loading`/`loadError` describe that fetch.
export default function BlogFormModal({
  open,
  mode = "create",
  post = null,
  loading = false,
  loadError = null,
  onRetryLoad,
  categories = [],
  categoriesState = "ready",
  onRetryCategories,
  onSubmit,
  onClose,
}) {
  const ref = useRef(null);
  const titleId = useId();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (d && open && !d.open) d.showModal();
  }, [open]);
  if (!open) return null;

  const catBlocked = categoriesState !== "ready";
  const showForm = !loading && !loadError && !catBlocked;

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onClose();
      }}
      className="m-auto w-[calc(100%-1.5rem)] max-w-3xl rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-gray-900/50"
    >
      <div className="flex max-h-[92vh] flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-gray-900">
              {mode === "edit" ? "Edit Post" : "Add New Post"}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {mode === "edit"
                ? "Update the post details."
                : "Write a blog or news post."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div
            role="status"
            aria-label="Loading post"
            className="space-y-3 px-5 py-6"
          >
            {[70, 100, 100, 60].map((w, i) => (
              <div
                key={i}
                className="h-4 animate-pulse rounded bg-gray-100"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
            <p className="text-sm text-gray-700">{loadError}</p>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className={btnSecondary}>
                Close
              </button>
              <button
                type="button"
                onClick={onRetryLoad}
                className={btnPrimary}
              >
                Retry
              </button>
            </div>
          </div>
        ) : catBlocked ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            {categoriesState === "loading" ? (
              <Loader2
                className="h-5 w-5 animate-spin text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle
                className="h-6 w-6 text-red-500"
                aria-hidden="true"
              />
            )}
            <p className="text-sm text-gray-700">
              {categoriesState === "loading"
                ? "Loading categories…"
                : "Categories couldn't be loaded, and a category is required."}
            </p>
            {categoriesState === "error" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={btnSecondary}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={onRetryCategories}
                  className={btnPrimary}
                >
                  Retry
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {showForm ? (
          <FormBody
            key={`${mode}-${post?.id ?? "new"}`}
            mode={mode}
            post={post}
            categories={categories}
            onSubmit={onSubmit}
            onClose={onClose}
            onBusyChange={setBusy}
          />
        ) : null}
      </div>
    </dialog>
  );
}
