// ASSUMPTIONS to confirm against the real Laravel gallery model: the category list, the status values
// ("published" | "draft") and the 5 MB limit. "Unpublish" is treated as returning a photo to "draft".
export const GALLERY_CATEGORIES = [
  "Community Support",
  "Tree Plantation",
  "Education Support",
  "Social Activities",
  "Events",
  "Other Activities",
];
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const PAGE_STEP = 8;
export const EMPTY_GALLERY_FILTERS = {
  search: "",
  category: "all",
  status: "all",
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

// Formats an ISO date without a Date object (no timezone shifts, safe for prerendering).
export function formatDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return MONTHS[m - 1] ? `${d} ${MONTHS[m - 1]} ${y}` : null;
}

// Only call from an event handler: it reads the clock.
export function todayIso() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

export function filterPhotos(photos, f) {
  const q = f.search.trim().toLowerCase();
  return photos
    .filter(
      (x) =>
        (f.category === "all" || x.category === f.category) &&
        (f.status === "all" || x.status === f.status) &&
        (!q ||
          [x.title, x.description, x.category]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q)),
    )
    .sort(
      (a, b) =>
        b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id),
    );
}

export const calculateGallerySummary = (photos) => ({
  total: photos.length,
  published: photos.filter((x) => x.status === "published").length,
  draft: photos.filter((x) => x.status === "draft").length,
});

export const emptyPhotoForm = () => ({
  title: "",
  description: "",
  category: "",
  activity_date: "",
  alt_text: "",
  status: "draft",
  imageFile: null,
});

export const photoToForm = (p) => ({
  title: p.title,
  description: p.description ?? "",
  category: p.category,
  activity_date: p.activity_date ?? "",
  alt_text: p.alt_text ?? "",
  status: p.status,
  imageFile: null,
});

// Client-side checks are for convenience only. The backend must re-validate the file type, size and content.
export function validatePhotoForm(v, { today, requireImage }) {
  const e = {};
  const title = v.title.trim();
  if (!title) e.title = "Enter a title.";
  else if (title.length > 120) e.title = "Use 120 characters or fewer.";
  if (v.description.length > 1000)
    e.description = "Use 1,000 characters or fewer.";
  if (!GALLERY_CATEGORIES.includes(v.category))
    e.category = "Choose a category.";
  if (v.activity_date && v.activity_date > today)
    e.activity_date = "The activity date can't be in the future.";
  if (v.alt_text.length > 200) e.alt_text = "Use 200 characters or fewer.";
  if (v.imageFile) {
    if (!PHOTO_TYPES.includes(v.imageFile.type))
      e.image = "Choose a JPG, PNG, or WebP image.";
    else if (v.imageFile.size > PHOTO_MAX_BYTES)
      e.image = "The image must be 5 MB or smaller.";
  } else if (requireImage) e.image = "Choose an image to upload.";
  return e;
}

export function formToFields(v, status) {
  const opt = (s) => s.trim() || null;
  return {
    title: v.title.trim(),
    description: opt(v.description),
    category: v.category,
    activity_date: v.activity_date || null,
    alt_text: opt(v.alt_text),
    status,
  };
}
