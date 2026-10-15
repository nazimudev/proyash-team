/** Pure form validation (no UI). The backend must repeat and enforce every rule; this is only for fast feedback. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/; // 01XXXXXXXXX, optionally with +88 / 88 prefix

export const normalizeAmount = (raw) => String(raw ?? "").replace(/[,\s]/g, "");

export function parseAmount(raw) {
  const s = normalizeAmount(raw);
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function validateDonation(v, method) {
  const e = {};
  if (v.donorType === "named") {
    const name = v.fullName.trim();
    if (!name) e.fullName = "Please enter your full name.";
    else if (name.length < 2 || name.length > 100) e.fullName = "Name must be between 2 and 100 characters.";
  }

  if (!normalizeAmount(v.amount)) e.amount = "Please enter a donation amount.";
  else if (parseAmount(v.amount) === null) e.amount = "Enter an amount greater than 0, with at most 2 decimal places.";

  if (!method) {
    e.paymentMethod = "Please choose an available payment method.";
  } else {
    const t = method.transactionId;
    const id = v.transactionId.trim();
    if (t.required && !id) e.transactionId = `Please enter the ${t.label.toLowerCase()}.`;
    else if (id) {
      if (id.length < t.minLength || id.length > t.maxLength) e.transactionId = `Must be ${t.minLength}–${t.maxLength} characters.`;
      else if (!new RegExp(t.pattern).test(id)) e.transactionId = "Use only letters, numbers, hyphens, underscores or slashes.";
    }
    const phone = v.phone.replace(/[\s-]/g, "");
    if (method.needsPhone && !phone) e.phone = "Please enter the phone number you used for this payment.";
    else if (phone && !BD_MOBILE.test(phone)) e.phone = "Enter a valid Bangladeshi mobile number, e.g. 01XXXXXXXXX.";
  }

  if (v.phone && !method) {
    // phone format is still checked even before a method is chosen
    if (!BD_MOBILE.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid Bangladeshi mobile number, e.g. 01XXXXXXXXX.";
  }
  if (v.email.trim() && !EMAIL.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (v.message.length > 500) e.message = "Message must be 500 characters or fewer.";
  if (!v.consent) e.consent = "Please confirm this statement before submitting.";
  return e;
}
