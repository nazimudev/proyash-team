// ASSUMPTIONS to confirm against the real Laravel model and the public founder section:
// field names, the "draft" | "published" status values, the two-profile limit, and the 5 MB photo limit.
export const MAX_FOUNDERS = 2; // current organization setup: exactly two founder profiles
export const DEFAULT_MESSAGE_HEADING = "A Message from the Founder";
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const LIMITS = {
  name: 120,
  designation: 80,
  biography: 1500,
  education: 500,
  experience: 1500,
  community: 1500,
  heading: 100,
  message: 3000,
};

export const sortFounders = (list) =>
  [...list].sort(
    (a, b) =>
      (a.display_order ?? 99) - (b.display_order ?? 99) ||
      a.id.localeCompare(b.id),
  );

export function getInitials(name) {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function nextFreeOrder(founders) {
  const taken = new Set(founders.map((f) => f.display_order));
  for (let i = 1; i <= 99; i++) if (!taken.has(i)) return i;
  return 1;
}

export const emptyFounderForm = (order = 1) => ({
  full_name_en: "",
  full_name_bn: "",
  designation: "",
  biography: "",
  education: "",
  professional_experience: "",
  community_involvement: "",
  message_heading: DEFAULT_MESSAGE_HEADING,
  message: "",
  status: "draft",
  display_order: String(order),
  confirmed: false,
  photoFile: null,
  removePhoto: false,
});

export const founderToForm = (f) => ({
  full_name_en: f.full_name_en ?? "",
  full_name_bn: f.full_name_bn ?? "",
  designation: f.designation ?? "",
  biography: f.biography ?? "",
  education: f.education ?? "",
  professional_experience: f.professional_experience ?? "",
  community_involvement: f.community_involvement ?? "",
  message_heading: f.message_heading || DEFAULT_MESSAGE_HEADING,
  message: f.message ?? "",
  status: f.status ?? "draft",
  display_order: String(f.display_order ?? 1),
  confirmed: false,
  photoFile: null,
  removePhoto: false,
});

// Client-side checks are a convenience only. The backend must re-validate everything, including the photo.
export function validateFounderForm(v, { takenOrders }) {
  const e = {};
  const name = v.full_name_en.trim();
  if (!name) e.full_name_en = "Enter the founder's full name in English.";
  else if (name.length > LIMITS.name)
    e.full_name_en = `Use ${LIMITS.name} characters or fewer.`;
  if (v.full_name_bn.trim() && !/[\u0980-\u09FF]/.test(v.full_name_bn))
    e.full_name_bn = "Enter the name using Bangla letters.";
  else if (v.full_name_bn.length > LIMITS.name)
    e.full_name_bn = `Use ${LIMITS.name} characters or fewer.`;
  if (!v.designation.trim()) e.designation = "Enter the official designation.";
  else if (v.designation.length > LIMITS.designation)
    e.designation = `Use ${LIMITS.designation} characters or fewer.`;
  for (const [k, max] of [
    ["biography", LIMITS.biography],
    ["education", LIMITS.education],
    ["professional_experience", LIMITS.experience],
    ["community_involvement", LIMITS.community],
    ["message", LIMITS.message],
  ]) {
    if (v[k].length > max)
      e[k] = `Use ${max.toLocaleString("en-US")} characters or fewer.`;
  }
  if (v.message.trim() && !v.message_heading.trim())
    e.message_heading = "Enter a heading for the message.";
  else if (v.message_heading.length > LIMITS.heading)
    e.message_heading = `Use ${LIMITS.heading} characters or fewer.`;
  if (!/^\d{1,2}$/.test(v.display_order.trim()) || Number(v.display_order) < 1)
    e.display_order = "Enter a whole number from 1 to 99.";
  else if (takenOrders.includes(Number(v.display_order)))
    e.display_order =
      "Another founder already uses this position. Choose a different number.";
  if (v.status === "published" && !v.confirmed)
    e.confirmed =
      "Confirm the content was supplied or approved by the founder before publishing.";
  if (v.photoFile) {
    if (!PHOTO_TYPES.includes(v.photoFile.type))
      e.photo = "Choose a JPG, PNG, or WebP image.";
    else if (v.photoFile.size > PHOTO_MAX_BYTES)
      e.photo = "The photo must be 5 MB or smaller.";
  }
  return e;
}

// Empty optional text becomes null. `confirmed` is a client-side publishing gate and is NOT sent.
export function formToFields(v) {
  const t = (s) => s.trim();
  const opt = (s) => t(s) || null;
  return {
    full_name_en: t(v.full_name_en),
    full_name_bn: opt(v.full_name_bn),
    designation: t(v.designation),
    biography: opt(v.biography),
    education: opt(v.education),
    professional_experience: opt(v.professional_experience),
    community_involvement: opt(v.community_involvement),
    message_heading: t(v.message) ? t(v.message_heading) : null,
    message: opt(v.message),
    status: v.status,
    display_order: Number(v.display_order),
  };
}
