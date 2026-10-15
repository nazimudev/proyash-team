/**
 * FINANCIAL RECORDS — local stand-in for what the Laravel backend will provide.
 *
 * ALL EMPTY: no verified accounting records exist yet, so nothing is invented. Until the
 * organization sets `baselineEstablished: true` AND supplies ledger entries, the page shows
 * "Financial records will be published here once verified." (never fake zeros).
 *
 * These are AUTHORIZED ACCOUNTING records. They contain NO private donor data
 * (no names, phone numbers, emails, transaction IDs, messages). Those stay in the backend.
 *
 * ACCOUNTING MODEL (implemented in lib/donationCalculations.js; shown to visitors):
 *   Available Balance = Confirmed donations + Other confirmed income − Approved expenses − Refunds/other deductions
 *   • Only entries with status "confirmed" (donation, other_income, deduction) or "approved" (expense) count.
 *     Pending, rejected and refunded entries never count.
 *   • A fully refunded donation must be marked status "refunded" (excluded). Do NOT also add a
 *     "deduction" for it. Use "deduction" only for partial refunds or other adjustments.
 *   • Figures are ALL-TIME totals as of `lastUpdated` (no period filter until the data supports one).
 *
 * LEDGER ENTRY
 *   id, date "YYYY-MM-DD", kind: "donation" | "other_income" | "expense" | "deduction",
 *   amount (BDT, max 2 decimals), category, description, status,
 *   isPublic (true only if reviewed and approved for public disclosure),
 *   projectLabel? (expenses), documentUrl? (approved supporting document, https or internal path)
 */
export const financialMeta = {
  baselineEstablished: false,
  reportingPeriod: "", // e.g. "All time, from 1 March 2026"
  lastUpdated: "", // "YYYY-MM-DD"; set only when someone actually reviewed the figures
};

export const ledgerEntries = [];

/**
 * PUBLIC DONOR RECORDS — only what may appear on the website (no private fields).
 *   id, date, status ("confirmed"), isRefunded, isPublished,
 *   isAnonymous, displayName (used only if !isAnonymous && showName),
 *   showName, showAmount, amount, purpose (id from donationConfig.purposes), showPurpose,
 *   methodLabel? (e.g. "bKash")
 * Eligible only if confirmed + not refunded + published. Messages are never part of public records.
 */
export const publicDonationRecords = [];
