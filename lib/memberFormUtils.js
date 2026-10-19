import {
  DEFAULT_NATIONALITY,
  RELIGIONS,
  GENDERS,
  MARITAL_STATUSES,
  BLOOD_GROUPS,
} from "@/data/memberOptions";

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const ADDRESS_PARTS = ["village", "post_office", "upazila", "district"];

// Field names match the backend column names. System-managed fields (id, user_id, status, reviewed_by,
// reviewed_at, rejection_reason, created_at, updated_at) are deliberately absent: the backend owns them.
export const emptyMemberForm = () => ({
  full_name_bn: "",
  full_name_en: "",
  father_name: "",
  mother_name: "",
  date_of_birth: "",
  nationality: DEFAULT_NATIONALITY,
  religion: "",
  gender: "",
  marital_status: "",
  occupation: "",
  educational_qualification: "",
  blood_group: "",
  mobile_number: "",
  email: "",
  photoFile: null,
  permanent_village: "",
  permanent_post_office: "",
  permanent_upazila: "",
  permanent_district: "",
  present_village: "",
  present_post_office: "",
  present_upazila: "",
  present_district: "",
  sameAddress: false,
});

// Order used to focus the first invalid field.
export const FIELD_ORDER = [
  "full_name_bn",
  "full_name_en",
  "father_name",
  "mother_name",
  "date_of_birth",
  "nationality",
  "religion",
  "gender",
  "marital_status",
  "occupation",
  "educational_qualification",
  "blood_group",
  "mobile_number",
  "email",
  "profile_photo",
  "permanent_village",
  "permanent_post_office",
  "permanent_upazila",
  "permanent_district",
  "present_village",
  "present_post_office",
  "present_upazila",
  "present_district",
];

// Only call from an event handler: it reads the clock.
export function todayIso() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

const normalizeMobile = (s) => s.replace(/[\s-]/g, "");

// ASSUMPTION: rules below are sensible defaults. Align them with the Join Proyash page and the Laravel validation.
export function validateMemberForm(v, today) {
  const e = {};
  const req = (k, msg) => {
    if (!v[k].trim()) e[k] = msg;
  };

  req("full_name_bn", "Enter the full name in Bangla.");
  if (v.full_name_bn.trim() && !/[\u0980-\u09FF]/.test(v.full_name_bn))
    e.full_name_bn = "Enter the name using Bangla letters.";
  req("full_name_en", "Enter the full name in English.");
  if (
    v.full_name_en.trim() &&
    !/^[A-Za-z][A-Za-z .'-]*$/.test(v.full_name_en.trim())
  )
    e.full_name_en = "Use English letters, spaces, and . ' - only.";
  req("father_name", "Enter the father's name.");
  req("mother_name", "Enter the mother's name.");

  if (!v.date_of_birth) e.date_of_birth = "Choose the date of birth.";
  else if (v.date_of_birth > today)
    e.date_of_birth = "The date of birth can't be in the future.";
  else if (v.date_of_birth < "1900-01-01")
    e.date_of_birth = "Enter a valid date of birth.";

  req("nationality", "Enter the nationality.");
  if (v.religion && !RELIGIONS.includes(v.religion))
    e.religion = "Choose a listed option.";
  if (v.gender && !GENDERS.includes(v.gender))
    e.gender = "Choose a listed option.";
  if (!MARITAL_STATUSES.includes(v.marital_status))
    e.marital_status = "Choose the marital status.";
  req("occupation", "Enter the occupation.");
  req("educational_qualification", "Enter the educational qualification.");
  if (v.blood_group && !BLOOD_GROUPS.includes(v.blood_group))
    e.blood_group = "Choose a listed option.";

  if (!v.mobile_number.trim()) e.mobile_number = "Enter the mobile number.";
  else if (!/^(\+?88)?01[3-9]\d{8}$/.test(normalizeMobile(v.mobile_number)))
    e.mobile_number =
      "Enter a valid Bangladeshi mobile number, such as 01XXXXXXXXX.";

  // Required. To make email optional, delete the first branch below and keep the format check.
  if (!v.email.trim()) e.email = "Enter the email address.";
  else if (
    v.email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())
  )
    e.email = "Enter a valid email address, such as name@example.com.";

  if (v.photoFile) {
    if (!PHOTO_TYPES.includes(v.photoFile.type))
      e.profile_photo = "Choose a JPG, PNG, or WebP image.";
    else if (v.photoFile.size > PHOTO_MAX_BYTES)
      e.profile_photo = "The photo must be 5 MB or smaller.";
  }

  const labels = {
    village: "village",
    post_office: "post office",
    upazila: "upazila",
    district: "district",
  };
  for (const part of ADDRESS_PARTS) {
    req(`permanent_${part}`, `Enter the permanent ${labels[part]}.`);
    if (!v.sameAddress)
      req(`present_${part}`, `Enter the present ${labels[part]}.`);
  }
  return e;
}

// Builds the request: plain fields (snake_case, matching the backend) plus the photo File, sent separately.
// `profile_photo_path` is NOT built here: the backend sets it after it stores the uploaded photo.
export function buildMemberRequest(v) {
  const t = (s) => s.trim();
  const opt = (s) => t(s) || null;
  const fields = {
    full_name_bn: t(v.full_name_bn),
    full_name_en: t(v.full_name_en),
    father_name: t(v.father_name),
    mother_name: t(v.mother_name),
    date_of_birth: v.date_of_birth,
    nationality: t(v.nationality),
    religion: opt(v.religion),
    gender: opt(v.gender),
    marital_status: v.marital_status,
    occupation: t(v.occupation),
    educational_qualification: t(v.educational_qualification),
    blood_group: opt(v.blood_group),
    mobile_number: normalizeMobile(v.mobile_number),
    email: t(v.email).toLowerCase(),
  };
  for (const part of ADDRESS_PARTS) {
    fields[`permanent_${part}`] = t(v[`permanent_${part}`]);
    fields[`present_${part}`] = t(
      v.sameAddress ? v[`permanent_${part}`] : v[`present_${part}`],
    );
  }
  return { fields, photoFile: v.photoFile ?? null };
}
