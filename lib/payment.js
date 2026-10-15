import { paymentMethods, paymentMethodOrder } from "@/data/paymentMethods";
import { donationConfig } from "@/data/donationConfig";

const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const hasSteps = (m) => Array.isArray(m.instructions) && m.instructions.some(hasText);

/** A method is usable only if enabled AND its required details are filled in. Half-configured = unavailable. */
export function isMethodAvailable(m) {
  if (!m?.enabled) return false;
  if (m.kind === "mobile") return hasText(m.accountNumber) && hasText(m.accountType) && hasSteps(m);
  if (m.kind === "bank") return hasText(m.bankName) && hasText(m.accountHolder) && hasText(m.accountNumber) && hasSteps(m);
  if (m.kind === "cash") return hasSteps(m);
  return false;
}

export function getPaymentMethods() {
  return paymentMethodOrder.map((id) => ({ id, ...paymentMethods[id], available: isMethodAvailable(paymentMethods[id]) }));
}

/** Submissions are open only when a backend endpoint is configured. */
export const isSubmissionConfigured = () => hasText(donationConfig.submissionEndpoint);
