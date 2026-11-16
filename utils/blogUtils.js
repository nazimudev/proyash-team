// Blog & News utilities. Every function accepts null/undefined safely.
export const BLOG_STATUSES = ["draft", "published"];
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // ASSUMPTION: confirm the backend's real limit
export const BLOG_LIMITS = {
  title: 200,
  slug: 200,
  excerpt: 500,
  content: 50000,
  author: 100,
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const HAS_TZ = /(?:[zZ]|[+-]\d{2}:?\d{2})$/;
const SLUG_RE = /^[\p{L}\p{M}\p{N}]+(?:-[\p{L}\p{M}\p{N}]+)*$/u;

// "My First Post!" -> "my-first-post". Keeps letters from any script (for example Bangla) and digits.
export function generateSlug(title) {
  if (typeof title !== "string") return "";
  return title
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, BLOG_LIMITS.slug)
    .replace(/-+$/g, "");
}

// Accepts "2026-11-09", "2026-11-09T10:00:00" (shown as written) or a timestamp with Z/offset (converted to local time).
export function formatBlogDate(date, { time = true } = {}) {
  if (!date || typeof date !== "string") return "—";
  if (HAS_TZ.test(date) && /T/.test(date)) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "—";
    const day = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (!time) return day;
    const h = d.getHours();
    return `${day}, ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(date);
  if (!m || !MONTHS[Number(m[2]) - 1]) return "—";
  const day = `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
  if (!time || m[4] === undefined) return day;
  const h = Number(m[4]);
  return `${day}, ${h % 12 || 12}:${m[5]} ${h >= 12 ? "PM" : "AM"}`;
}

// Value for <input type="datetime-local"> ("YYYY-MM-DDTHH:mm"), or "".
export function toDateTimeLocal(date) {
  if (!date || typeof date !== "string") return "";
  if (HAS_TZ.test(date) && /T/.test(date)) {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  const m = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/.exec(date);
  return m ? `${m[1]}T${m[2] ?? "00:00"}` : "";
}

export function getBlogStatusLabel(status) {
  if (status === "published") return "Published";
  if (status === "draft") return "Draft";
  return typeof status === "string" && status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
}

export function getBlogStatusColor(status) {
  if (status === "published")
    return "bg-green-50 text-green-800 ring-green-200";
  if (status === "draft") return "bg-amber-50 text-amber-800 ring-amber-200";
  return "bg-gray-100 text-gray-700 ring-gray-200";
}

// The API returns a storage-relative path ("blogs/example.jpg"). Absolute, data: and blob: URLs pass through.
// ASSUMPTION: Laravel serves public storage at <site root>/storage. Set NEXT_PUBLIC_STORAGE_URL if that differs.
export function getBlogImageUrl(image) {
  if (!image || typeof image !== "string") return null;
  if (
    /^(https?:)?\/\//i.test(image) ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  )
    return image;
  const explicit = process.env.NEXT_PUBLIC_STORAGE_URL;
  const base = (
    explicit ||
    (process.env.NEXT_PUBLIC_API_URL ?? "")
      .replace(/\/+$/, "")
      .replace(/\/api$/i, "")
  ).replace(/\/+$/, "");
  return `${base}/storage/${image.replace(/^\/+/, "").replace(/^storage\//, "")}`;
}

export const emptyBlogForm = () => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category_id: "",
  author_name: "",
  status: "draft",
  published_at: "",
  is_featured: false,
  imageFile: null,
  removeImage: false,
});

export const postToFormValues = (post) => ({
  title: post?.title ?? "",
  slug: post?.slug ?? "",
  excerpt: post?.excerpt ?? "",
  content: post?.content ?? "",
  category_id:
    post?.category?.id != null
      ? String(post.category.id)
      : post?.category_id != null
        ? String(post.category_id)
        : "",
  author_name: post?.author_name ?? "",
  status: BLOG_STATUSES.includes(post?.status) ? post.status : "draft",
  published_at: toDateTimeLocal(post?.published_at),
  is_featured: !!post?.is_featured,
  imageFile: null,
  removeImage: false,
});

// Client-side checks are a convenience only; the backend must validate everything again.
export function validateBlogForm(values) {
  const v = values ?? {};
  const s = (k) => (typeof v[k] === "string" ? v[k] : "");
  const e = {};
  const title = s("title").trim();
  if (!title) e.title = "Enter a title.";
  else if (title.length > BLOG_LIMITS.title)
    e.title = `Use ${BLOG_LIMITS.title} characters or fewer.`;

  const slug = s("slug").trim();
  if (!slug) e.slug = "Enter a slug.";
  else if (slug.length > BLOG_LIMITS.slug)
    e.slug = `Use ${BLOG_LIMITS.slug} characters or fewer.`;
  else if (!SLUG_RE.test(slug))
    e.slug =
      "Use letters, numbers, and single hyphens only (for example, my-first-post).";

  const excerpt = s("excerpt").trim();
  if (!excerpt) e.excerpt = "Enter a short excerpt.";
  else if (excerpt.length > BLOG_LIMITS.excerpt)
    e.excerpt = `Use ${BLOG_LIMITS.excerpt} characters or fewer.`;

  const content = s("content").trim();
  if (!content) e.content = "Enter the post content.";
  else if (content.length > BLOG_LIMITS.content)
    e.content = `Use ${BLOG_LIMITS.content.toLocaleString("en-US")} characters or fewer.`;

  if (!String(v.category_id ?? "").trim()) e.category_id = "Choose a category.";
  if (s("author_name").length > BLOG_LIMITS.author)
    e.author_name = `Use ${BLOG_LIMITS.author} characters or fewer.`;
  if (!BLOG_STATUSES.includes(v.status))
    e.status = "Choose Draft or Published.";
  if (
    s("published_at") &&
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s("published_at"))
  )
    e.published_at = "Enter a valid date and time.";

  if (v.imageFile) {
    if (!IMAGE_TYPES.includes(v.imageFile.type))
      e.featured_image = "Choose a JPG, PNG, or WebP image.";
    else if (v.imageFile.size > IMAGE_MAX_BYTES)
      e.featured_image = `The image must be ${IMAGE_MAX_BYTES / 1024 / 1024} MB or smaller.`;
  }
  return e;
}

// Builds the multipart body. Content-Type must NOT be set by hand: the browser adds the boundary.
export function buildBlogFormData(values) {
  const v = values ?? {};
  const fd = new FormData();
  fd.append("title", (v.title ?? "").trim());
  fd.append("slug", (v.slug ?? "").trim());
  fd.append("excerpt", (v.excerpt ?? "").trim());
  fd.append("content", (v.content ?? "").trim());
  fd.append("category_id", String(v.category_id ?? ""));
  if ((v.author_name ?? "").trim())
    fd.append("author_name", v.author_name.trim());
  fd.append("status", v.status ?? "draft");
  if (v.published_at) fd.append("published_at", v.published_at);
  fd.append("is_featured", v.is_featured ? "1" : "0");
  if (v.imageFile) fd.append("featured_image", v.imageFile);
  else if (v.removeImage) fd.append("remove_featured_image", "1"); // ASSUMPTION: backend supports this flag
  return fd;
}

export function getBlogErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error && typeof error.message === "string" && error.message)
    return error.message;
  return fallback;
}
