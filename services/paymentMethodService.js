const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function toApiPayload(data) {
  const mapping = {
    accountNumber: "account_number",
    accountHolder: "account_holder",
    requiresTransactionId: "requires_transaction_id",
    requiresPhone: "requires_phone",
    requiresPaymentProof: "requires_payment_proof",
    displayOrder: "display_order",
    isActive: "is_active",
  };

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [mapping[key] || key, value]),
  );
}

function fromApiMethod(method) {
  return {
    ...method,

    accountNumber: method.account_number ?? "",
    accountHolder: method.account_holder ?? "",

    steps: Array.isArray(method.steps) ? method.steps : [],

    requiresTransactionId: Boolean(method.requires_transaction_id),

    requiresPhone: Boolean(method.requires_phone),

    requiresPaymentProof: Boolean(method.requires_payment_proof),

    displayOrder: method.display_order ?? 0,
    isActive: Boolean(method.is_active),

    updatedAt: method.updated_at,
  };
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Unauthenticated. Please login first.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong.");

    error.status = response.status;
    error.errors = result.errors;

    throw error;
  }

  return result;
}

// GET All Payment Methods
export async function fetchPaymentMethods() {
  const result = await apiRequest("/admin/payment-methods");

  return result.data.map(fromApiMethod);
}

// POST Create Payment Method
export async function createPaymentMethod(payload) {
  const result = await apiRequest("/admin/payment-methods", {
    method: "POST",
    body: JSON.stringify(toApiPayload(payload)),
  });

  return fromApiMethod(result.data);
}

// PATCH Update Payment Method
export async function updatePaymentMethod(id, patch) {
  const result = await apiRequest(`/admin/payment-methods/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toApiPayload(patch)),
  });

  return fromApiMethod(result.data);
}

// PATCH Activate
export async function activatePaymentMethod(id) {
  return updatePaymentMethod(id, { isActive: true });
}

// PATCH Deactivate
export async function deactivatePaymentMethod(id) {
  return updatePaymentMethod(id, { isActive: false });
}

// DELETE Payment Method
export async function deletePaymentMethod(id) {
  await apiRequest(`/admin/payment-methods/${id}`, {
    method: "DELETE",
  });

  return { deleted: true };
}

// GET Payment Method Usage
export async function checkPaymentMethodUsage(id) {
  const result = await apiRequest(`/admin/payment-methods/${id}/usage`);

  return result.data;
}

// Upload Payment Method Logo
export async function uploadPaymentMethodLogo(file) {
  const token = getToken();

  if (!token) {
    throw new Error("Unauthenticated.");
  }

  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch(`${API_URL}/admin/payment-methods/logo`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Logo upload failed.");
  }

  return result.data;
}
