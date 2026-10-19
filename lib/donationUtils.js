import { DONATION_METHODS, TRANSACTION_ID_REQUIRED_METHODS, PROOF_ALLOWED_TYPES, PROOF_MAX_BYTES, methodLabel } from "./donationConfig";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currency = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const formatCurrency = (n) => currency.format(n);

// Formats ISO strings without creating Date objects (avoids timezone shifts and render-time Date use).
export function formatDate(iso) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Only call from event handlers or effects, never during render.
export function todayIso() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

export const donorLabel = (donor) => (donor.isAnonymous ? "Anonymous Donor" : donor.name);
export const donorContact = (donor) => (donor.isAnonymous ? null : donor.phone || donor.email || null);

export function getInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

// Anonymous donations never count as a unique donor.
function donorKey(donor) {
  if (donor.isAnonymous) return null;
  const phone = donor.phone?.replace(/\D/g, "");
  return phone || donor.email?.trim().toLowerCase() || donor.name?.trim().toLowerCase() || null;
}

// Totals come from verified records only. `currentMonth` is "YYYY-MM" set from an effect.
export function calculateSummary(donations, currentMonth) {
  const active = donations.filter((x) => !x.archived);
  const verified = active.filter((x) => x.status === "verified");
  const donors = new Set(verified.map((x) => donorKey(x.donor)).filter(Boolean));
  return {
    totalConfirmed: verified.reduce((s, x) => s + x.amount, 0),
    pendingCount: active.filter((x) => x.status === "pending").length,
    thisMonth: currentMonth
      ? verified.filter((x) => x.donationDate.startsWith(currentMonth)).reduce((s, x) => s + x.amount, 0)
      : null,
    uniqueDonors: donors.size,
  };
}

export const EMPTY_FILTERS = { search: "", status: "all", method: "all", project: "all", startDate: "", endDate: "" };

export function dateRangeError(f) {
  return f.startDate && f.endDate && f.startDate > f.endDate ? "Start date must be on or before the end date." : null;
}

export function filterDonations(donations, f) {
  const q = f.search.trim().toLowerCase();
  const rangeOk = !dateRangeError(f);
  return donations.filter((x) => {
    if (x.archived) return false;
    if (f.status !== "all" && x.status !== f.status) return false;
    if (f.method !== "all" && x.method !== f.method) return false;
    if (f.project === "general" && x.projectId) return false;
    if (f.project !== "all" && f.project !== "general" && x.projectId !== f.project) return false;
    if (rangeOk && f.startDate && x.donationDate < f.startDate) return false;
    if (rangeOk && f.endDate && x.donationDate > f.endDate) return false;
    if (q) {
      const hay = [x.id, x.donor.name, x.donor.phone, x.donor.email, x.transactionId].filter(Boolean).join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDonations(list, sort) {
  const by = {
    "date-desc": (a, b) => b.donationDate.localeCompare(a.donationDate) || b.id.localeCompare(a.id),
    "date-asc": (a, b) => a.donationDate.localeCompare(b.donationDate) || a.id.localeCompare(b.id),
    "amount-desc": (a, b) => b.amount - a.amount,
    "amount-asc": (a, b) => a.amount - b.amount,
  };
  return [...list].sort(by[sort] ?? by["date-desc"]);
}

// CSV cells starting with = + - @ are prefixed so spreadsheets don't run them as formulas.
const csvCell = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function donationsToCsv(rows, projects) {
  const names = Object.fromEntries(projects.map((p) => [p.id, p.name]));
  const header = ["Donation ID","Donor","Phone","Email","Amount (BDT)","Method","Transaction ID","Project / Purpose","Donation Date","Status"];
  const lines = rows.map((x) => [
    x.id, donorLabel(x.donor), x.donor.phone, x.donor.email, x.amount, methodLabel(x.method),
    x.transactionId, x.projectId ? names[x.projectId] ?? x.projectId : "General Donation", x.donationDate, x.status,
  ].map(csvCell).join(","));
  return "\uFEFF" + [header.map(csvCell).join(","), ...lines].join("\r\n");
}

export const emptyFormValues = (today = "") => ({
  donorType: "named", name: "", phone: "", email: "", amount: "", method: "bkash", transactionId: "",
  purpose: "general", projectId: "", donationDate: today, message: "", adminNote: "",
  recordStatus: "pending", proofFile: null, proofFileName: null,
});

export const donationToFormValues = (x) => ({
  donorType: x.donor.isAnonymous ? "anonymous" : "named", name: x.donor.name ?? "", phone: x.donor.phone ?? "",
  email: x.donor.email ?? "", amount: String(x.amount), method: x.method, transactionId: x.transactionId ?? "",
  purpose: x.projectId ? "project" : "general", projectId: x.projectId ?? "", donationDate: x.donationDate,
  message: x.message ?? "", adminNote: x.adminNote ?? "", recordStatus: x.status, proofFile: null, proofFileName: x.proofFileName,
});

export function validateDonationForm(v, { today, requireAck, ack }) {
  const e = {};
  const anon = v.donorType === "anonymous";
  if (!anon && !v.name.trim()) e.name = "Enter the donor's name.";
  if (!anon && v.phone.trim() && !/^\+?[\d\s-]{7,15}$/.test(v.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!anon && v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  const amount = Number(v.amount);
  if (!v.amount.trim() || !Number.isFinite(amount) || amount <= 0) e.amount = "Enter an amount greater than zero.";
  if (!DONATION_METHODS.some((m) => m.value === v.method)) e.method = "Choose a payment method.";
  if (TRANSACTION_ID_REQUIRED_METHODS.includes(v.method) && !v.transactionId.trim())
    e.transactionId = `${methodLabel(v.method)} donations need a transaction ID.`;
  if (v.purpose === "project" && !v.projectId) e.projectId = "Choose a project.";
  if (!v.donationDate) e.donationDate = "Choose the date the donation was received.";
  else if (today && v.donationDate > today) e.donationDate = "The donation date can't be in the future.";
  if (v.proofFile) {
    if (!PROOF_ALLOWED_TYPES.includes(v.proofFile.type)) e.proof = "Upload a JPG, PNG, WebP, or PDF file.";
    else if (v.proofFile.size > PROOF_MAX_BYTES) e.proof = "The file must be 5 MB or smaller.";
  }
  if (requireAck && !ack) e.ack = "Confirm that you want to change a verified record.";
  return e;
}

export function formValuesToDonation(v) {
  const anon = v.donorType === "anonymous";
  const t = (s) => s.trim() || null;
  return {
    donor: { isAnonymous: anon, name: anon ? null : v.name.trim(), phone: anon ? null : t(v.phone), email: anon ? null : t(v.email) },
    amount: Number(v.amount), method: v.method, transactionId: t(v.transactionId),
    projectId: v.purpose === "project" ? v.projectId : null, donationDate: v.donationDate,
    message: t(v.message), adminNote: t(v.adminNote),
  };
}
