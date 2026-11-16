const API_URL = process.env.NEXT_PUBLIC_API_URL;

const genericTransactionId = {
  required: true,
  label: "Transaction ID",
  hint: "Copy it from your payment confirmation.",
  minLength: 6,
  maxLength: 40,
  pattern: "^[A-Za-z0-9_/-]+$",
};

function normalizePaymentMethod(method) {
  const type = method.type;

  return {
    id: method.id,
    kind: type,
    enabled: Boolean(method.is_active),

    displayName: method.name,
    accountNumber: method.account_number ?? "",
    accountHolder: method.account_holder ?? "",

    // These fields are not currently returned by the API.
    accountType: method.account_type ?? "",
    bankName: method.bank_name ?? "",
    branchName: method.branch_name ?? "",
    routingNumber: method.routing_number ?? "",

    description: method.description ?? "",

    instructions: Array.isArray(method.steps)
      ? method.steps
          .map((step) => (typeof step === "string" ? step : step?.text))
          .filter(Boolean)
      : [],

    needsPhone: Boolean(method.requires_phone),
    requiresPaymentProof: Boolean(method.requires_payment_proof),

    transactionId: {
      ...genericTransactionId,
      required: Boolean(method.requires_transaction_id),
      label: `${method.name} transaction ID`,
    },

    displayOrder: method.display_order ?? 0,
  };
}

export async function fetchPublicPaymentMethods() {
  const response = await fetch(`${API_URL}/public/active-payment-methods`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load payment methods");
  }

  const result = await response.json();

  const methods = Array.isArray(result.data) ? result.data : [];

  const sortedMethods = methods
    .filter((method) => method.is_active)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const paymentMethods = {};
  const paymentMethodOrder = [];

  for (const method of sortedMethods) {
    const key = String(method.id);

    paymentMethods[key] = normalizePaymentMethod(method);
    paymentMethodOrder.push(key);
  }

  return {
    paymentMethods,
    paymentMethodOrder,
  };
}
