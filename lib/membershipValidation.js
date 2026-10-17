import { membershipConfig } from "@/data/membershipConfig";

/** Pure validation, no UI. The Laravel backend must repeat and enforce every rule. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
const text = (v) => (typeof v === "string" ? v.trim() : "");

export const stepFields = [
  ["full_name_bn", "full_name_en", "father_name", "mother_name", "date_of_birth", "nationality", "religion", "occupation", "gender", "marital_status", "educational_qualification", "blood_group", "mobile_number", "email"],
  ["permanent_village", "permanent_post_office", "permanent_upazila", "permanent_district", "present_village", "present_post_office", "present_upazila", "present_district"],
  ["password", "password_confirmation", "membership_agreement_accepted", "declaration_accepted", "privacy_terms_accepted"],
];

/** Which step shows a field (used to jump to the right step for server-side errors). Unknown fields -> null. */
export const stepOfField = (name) => {
  const i = stepFields.findIndex((list) => list.includes(name));
  return i === -1 ? null : i;
};

export function passwordChecks(pw) {
  const { minLength } = membershipConfig.password;
  return [
    { id: "len", label: `At least ${minLength} characters`, ok: pw.length >= minLength },
    { id: "letter", label: "Contains a letter", ok: /[A-Za-z]/.test(pw) },
    { id: "number", label: "Contains a number", ok: /\d/.test(pw) },
  ];
}

/** Guidance only (never a policy): 0 = none, 1 weak, 2 fair, 3 strong. */
export function passwordStrength(pw) {
  if (!pw) return { level: 0, label: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  const level = score <= 1 ? 1 : score <= 3 ? 2 : 3;
  return { level, label: ["", "Weak", "Fair", "Strong"][level] };
}

function validDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return "Enter a valid date of birth.";
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1 || +m[1] < 1900) return "Enter a valid date of birth.";
  if (d.getTime() > Date.now()) return "Date of birth can’t be in the future.";
  return null;
}

const REQUIRED_TEXT = {
  full_name_en: "your full name in English",
  father_name: "your father’s name",
  mother_name: "your mother’s name",
  nationality: "your nationality",
  occupation: "your occupation",
  educational_qualification: "your educational qualification",
};

export function validateStep(step, v) {
  const e = {};
  if (step === 0) {
    for (const [name, what] of Object.entries(REQUIRED_TEXT)) {
      const s = text(v[name]);
      if (!s) e[name] = `Please enter ${what}.`;
      else if (s.length < 2 || s.length > 120) e[name] = "Must be between 2 and 120 characters.";
    }
    if (text(v.full_name_bn).length > 120) e.full_name_bn = "Must be 120 characters or fewer.";
    if (!text(v.date_of_birth)) e.date_of_birth = "Please enter your date of birth.";
    else if (validDate(v.date_of_birth)) e.date_of_birth = validDate(v.date_of_birth);
    if (!v.marital_status) e.marital_status = "Please select your marital status.";
    const mobile = text(v.mobile_number).replace(/[\s-]/g, "");
    if (!mobile) e.mobile_number = "Please enter your mobile number.";
    else if (!BD_MOBILE.test(mobile)) e.mobile_number = "Enter a valid Bangladeshi mobile number, e.g. 01XXXXXXXXX.";
    if (!text(v.email)) e.email = "Please enter your email address.";
    else if (!EMAIL.test(text(v.email))) e.email = "Enter a valid email address.";
  }
  if (step === 1) {
    const parts = [["village", "village"], ["post_office", "post office"], ["upazila", "upazila"], ["district", "district"]];
    for (const [part, label] of parts) {
      if (!text(v[`permanent_${part}`])) e[`permanent_${part}`] = `Please enter the permanent ${label}.`;
      if (!v.same_address && !text(v[`present_${part}`])) e[`present_${part}`] = `Please enter the present ${label}.`;
    }
  }
  if (step === 2) {
    const { minLength, maxLength } = membershipConfig.password;
    const pw = v.password ?? "";
    if (!pw) e.password = "Please create a password.";
    else if (passwordChecks(pw).some((c) => !c.ok)) e.password = "Your password doesn’t meet the requirements below.";
    else if (pw.length > maxLength) e.password = `Use at most ${maxLength} characters.`;
    else if (pw.length < minLength) e.password = `Use at least ${minLength} characters.`;
    if (!v.password_confirmation) e.password_confirmation = "Please confirm your password.";
    else if (v.password_confirmation !== pw) e.password_confirmation = "Passwords don’t match.";
    if (!v.membership_agreement_accepted) e.membership_agreement_accepted = "Please confirm you have read the membership conditions.";
    if (!v.declaration_accepted) e.declaration_accepted = "Please confirm the applicant declaration.";
    if (!v.privacy_terms_accepted) e.privacy_terms_accepted = "Please accept the Privacy Policy and Terms of Service.";
  }
  return e;
}

export const validateAll = (v) => ({ ...validateStep(0, v), ...validateStep(1, v), ...validateStep(2, v) });

/** Photo rule used at selection time. Returns an error message or null. */
export function validatePhoto(file) {
  const { types, maxBytes, labels } = membershipConfig.photo;
  if (!types.includes(file.type)) return `Please choose a ${labels} image.`;
  if (file.size > maxBytes) return `The image must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller.`;
  return null;
}
