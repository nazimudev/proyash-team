import { fetchPublicPaymentMethods } from "@/data/paymentMethods";
import { donationConfig } from "@/data/donationConfig";

const hasText = (v) => typeof v === "string" && v.trim().length > 0;

const hasSteps = (m) =>
  Array.isArray(m.instructions) && m.instructions.some(hasText);

/**
 * Check whether a payment method is available.
 */
export function isMethodAvailable(m) {
  if (!m?.enabled) return false;

  if (m.kind === "mobile") {
    return hasText(m.accountNumber) && hasSteps(m);
  }

  if (m.kind === "bank") {
    return hasText(m.accountHolder) && hasText(m.accountNumber) && hasSteps(m);
  }

  if (m.kind === "cash") {
    return hasSteps(m);
  }

  if (m.kind === "other") {
    return hasText(m.description) && hasSteps(m);
  }

  return false;
}

/**
 * Get payment methods from Laravel API.
 */
export async function getPaymentMethods() {
  const { paymentMethods, paymentMethodOrder } =
    await fetchPublicPaymentMethods();

  return paymentMethodOrder.map((id) => {
    const method = paymentMethods[id];

    return {
      id: method.id,
      ...method,
      available: isMethodAvailable(method),
    };
  });
}

/**
 * Check donation submission endpoint.
 */
export const isSubmissionConfigured = () =>
  hasText(donationConfig.submissionEndpoint);
