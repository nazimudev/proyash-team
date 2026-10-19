"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
  Loader2,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";

const LIMITS = { title: 60, highlight: 40, description: 240 };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INITIAL_VALUES = {
  title: "Small Acts of Kindness.",
  highlight: "Lasting Change.",
  description:
    "Proyash Songgothon works to support underprivileged people, help students access educational opportunities, and encourage a greener future through tree plantation initiatives.",
  image: null, // { url, name, size }
};

/**
 * Save handler, kept separate so it can be swapped for a Laravel API call later.
 * Example: return fetch("/api/admin/home-hero", { method: "POST", body: formData })
 * Currently it only simulates a request; nothing is sent to a server.
 */
async function saveHeroSettings(values) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return values;
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFields(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = "Enter a main title.";
  else if (values.title.length > LIMITS.title)
    errors.title = `Keep the main title under ${LIMITS.title} characters.`;

  if (!values.highlight.trim()) errors.highlight = "Enter a highlighted title.";
  else if (values.highlight.length > LIMITS.highlight)
    errors.highlight = `Keep the highlighted title under ${LIMITS.highlight} characters.`;

  if (!values.description.trim()) errors.description = "Enter a description.";
  else if (values.description.length > LIMITS.description)
    errors.description = `Keep the description under ${LIMITS.description} characters.`;

  return errors;
}

const inputClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/30";

function Field({ id, label, helper, error, count, max, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
        <span
          className={`text-xs tabular-nums ${count > max ? "text-red-600" : "text-gray-400"}`}
          aria-live="polite"
        >
          {count}/{max}
        </span>
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-gray-500">
          {helper}
        </p>
      )}
    </div>
  );
}

function HeroPreview({ values }) {
  return (
    <section
      aria-labelledby="preview-heading"
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 id="preview-heading" className="text-base font-semibold text-gray-900">
            Homepage preview
          </h2>
          <p className="text-sm text-gray-500">Updates as you edit. Unsaved changes are included.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-green-50/40">
        <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-2">
          <div className="min-w-0">
            <h3 className="wrap-break-word text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              {values.title || "Main title"}
              <span className="block text-green-700">{values.highlight || "Highlighted title"}</span>
            </h3>
            <p className="mt-4 max-w-prose wrap-break-word text-sm leading-relaxed text-gray-600 sm:text-base">
              {values.description || "Your description will appear here."}
            </p>
          </div>

          <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-gray-100">
            {values.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.image.url} alt="Hero preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
                <ImageIcon className="h-8 w-8" aria-hidden="true" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeHeroSection() {
  const [saved, setSaved] = useState(INITIAL_VALUES);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: "success" | "error", message }

  const fileInputRef = useRef(null);
  const savedRef = useRef(saved);
  const valuesRef = useRef(values);
  const createdUrls = useRef(new Set());

  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  // Revoke every object URL we created when the component unmounts.
  useEffect(() => {
    const urls = createdUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  // Revoke a URL only when neither the draft nor the saved state still uses it.
  const releaseUrl = useCallback((url) => {
    if (!url || !createdUrls.current.has(url)) return;
    if (savedRef.current.image?.url === url || valuesRef.current.image?.url === url) return;
    URL.revokeObjectURL(url);
    createdUrls.current.delete(url);
  }, []);

  const dirty =
    values.title !== saved.title ||
    values.highlight !== saved.highlight ||
    values.description !== saved.description ||
    values.image?.url !== saved.image?.url;

  function updateField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFeedback(null);
  }

  function handleFile(file) {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageError("Unsupported file type. Upload a JPG, JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError(`This image is ${formatBytes(file.size)}. Maximum size is ${formatBytes(MAX_IMAGE_BYTES)}.`);
      return;
    }

    const url = URL.createObjectURL(file);
    createdUrls.current.add(url);
    const previousUrl = valuesRef.current.image?.url;

    setImageError("");
    setFeedback(null);
    setValues((prev) => ({ ...prev, image: { url, name: file.name, size: file.size } }));
    // Defer so refs reflect the new state before deciding what to revoke.
    setTimeout(() => releaseUrl(previousUrl), 0);
  }

  function handleRemoveImage() {
    const previousUrl = values.image?.url;
    setValues((prev) => ({ ...prev, image: null }));
    setImageError("");
    setFeedback(null);
    setTimeout(() => releaseUrl(previousUrl), 0);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleDiscard() {
    const discardedUrl = values.image?.url;
    setValues(saved);
    setErrors({});
    setImageError("");
    setFeedback(null);
    setTimeout(() => releaseUrl(discardedUrl), 0);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving || !dirty) return;

    const fieldErrors = validateFields(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFeedback({ type: "error", message: "Fix the highlighted fields, then save again." });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const result = await saveHeroSettings(values);
      const previousSavedUrl = savedRef.current.image?.url;
      setSaved(result);
      savedRef.current = result;
      setTimeout(() => releaseUrl(previousSavedUrl), 0);
      setFeedback({
        type: "success",
        message: "Changes saved in this session only. Connect the save handler to the API to publish them.",
      });
    } catch {
      setFeedback({ type: "error", message: "Couldn't save your changes. Try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <header>
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link href="/admin" className="hover:text-gray-900 focus-visible:outline focus-visible:outline-green-600">
                Dashboard
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
            <li>Website Content</li>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
            <li aria-current="page" className="font-medium text-gray-900">
              Home Hero Section
            </li>
          </ol>
        </nav>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Home Hero Section</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage the headline, description, and featured image displayed on your homepage.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden="true" />
            Homepage Content
          </span>
        </div>
      </header>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Content settings */}
          <section
            aria-labelledby="content-heading"
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div>
              <h2 id="content-heading" className="text-base font-semibold text-gray-900">
                Content settings
              </h2>
              <p className="text-sm text-gray-500">The text visitors read first on the homepage.</p>
            </div>

            <Field
              id="hero-title"
              label="Main Title"
              helper="The main heading displayed on the homepage."
              error={errors.title}
              count={values.title.length}
              max={LIMITS.title}
            >
              <input
                id="hero-title"
                type="text"
                value={values.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Small Acts of Kindness."
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "hero-title-error" : "hero-title-help"}
                className={`${inputClass} ${errors.title ? "border-red-400" : "border-gray-300 focus:border-green-600"}`}
              />
            </Field>

            <Field
              id="hero-highlight"
              label="Highlighted Title"
              helper="Appears below the main title in forest green."
              error={errors.highlight}
              count={values.highlight.length}
              max={LIMITS.highlight}
            >
              <input
                id="hero-highlight"
                type="text"
                value={values.highlight}
                onChange={(e) => updateField("highlight", e.target.value)}
                placeholder="Lasting Change."
                aria-invalid={Boolean(errors.highlight)}
                aria-describedby={errors.highlight ? "hero-highlight-error" : "hero-highlight-help"}
                className={`${inputClass} ${errors.highlight ? "border-red-400" : "border-gray-300 focus:border-green-600"}`}
              />
            </Field>

            <Field
              id="hero-description"
              label="Hero Description"
              helper="Keep it to two or three short sentences so it stays easy to read."
              error={errors.description}
              count={values.description.length}
              max={LIMITS.description}
            >
              <textarea
                id="hero-description"
                rows={6}
                value={values.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Write a short introduction about your organization's mission and work..."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "hero-description-error" : "hero-description-help"}
                className={`${inputClass} resize-y leading-relaxed ${
                  errors.description ? "border-red-400" : "border-gray-300 focus:border-green-600"
                }`}
              />
            </Field>
          </section>

          {/* Image settings */}
          <section
            aria-labelledby="image-heading"
            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-5">
              <h2 id="image-heading" className="text-base font-semibold text-gray-900">
                Hero Section Image
              </h2>
              <p className="text-sm text-gray-500">The featured photo shown beside your headline.</p>
            </div>

            <input
              ref={fileInputRef}
              id="hero-image-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />

            {values.image ? (
              <div className="space-y-4">
                <div className="aspect-4/3 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={values.image.url} alt="Selected hero" className="h-full w-full object-cover" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{values.image.name}</p>
                    <p className="text-xs text-gray-500">{values.image.size ? formatBytes(values.image.size) : "Current image"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-green-600"
                    >
                      <UploadCloud className="h-4 w-4" aria-hidden="true" />
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex aspect-4/3 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
                  dragging ? "border-green-600 bg-green-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Drag and drop an image here</p>
                  <p className="mt-0.5 text-xs text-gray-500">or choose one from your device</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  Upload Image
                </button>
              </div>
            )}

            {imageError && (
              <p role="alert" className="mt-3 flex items-start gap-1.5 text-xs text-red-600">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {imageError}
              </p>
            )}

            <ul className="mt-5 space-y-1.5 text-xs text-gray-500">
              <li>Recommended ratio: 4:3 (for example, 1600 × 1200 px).</li>
              <li>Formats: JPG, JPEG, PNG, or WebP. Maximum size: {formatBytes(MAX_IMAGE_BYTES)}.</li>
              <li>The public website may crop the image depending on screen size.</li>
            </ul>
          </section>
        </div>

        <HeroPreview values={values} />

        {/* Actions */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div aria-live="polite" className="min-h-5 text-sm">
            {feedback?.type === "success" && (
              <p className="flex items-start gap-2 text-green-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {feedback.message}
              </p>
            )}
            {feedback?.type === "error" && (
              <p role="alert" className="flex items-start gap-2 text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {feedback.message}
              </p>
            )}
            {!feedback && dirty && <p className="text-gray-500">You have unsaved changes.</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={!dirty || saving}
              aria-busy={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
