export const DONATION_METHODS = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "other", label: "Other" },
];

export const DONATION_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

// Verification policy (adjust to the organization's real rules):
// these methods need a transaction reference; Cash and Other do not.
export const TRANSACTION_ID_REQUIRED_METHODS = ["bkash", "nagad", "rocket", "bank_transfer"];

export const PROOF_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const PROOF_MAX_BYTES = 5 * 1024 * 1024;

export const methodLabel = (v) => DONATION_METHODS.find((m) => m.value === v)?.label ?? v;
