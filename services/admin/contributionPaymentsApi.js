const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    const validationMessage = result.errors
      ? Object.values(result.errors).flat().join(" ")
      : null;

    throw new Error(
      validationMessage || result.message || "Something went wrong.",
    );
  }

  return result;
}

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

export const contributionPaymentsApi = {
  async getPayments(params = {}) {
    const result = await apiRequest(
      `/admin/contribution-payments${buildQuery(params)}`,
    );

    return result.data;
  },

  async getPayment(id) {
    const result = await apiRequest(`/admin/contribution-payments/${id}`);

    return result.data;
  },

  async approvePayment(id) {
    return apiRequest(`/admin/contribution-payments/${id}/approve`, {
      method: "POST",
    });
  },

  async rejectPayment(id, reason) {
    return apiRequest(`/admin/contribution-payments/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  storeCashPayment(payload) {
    return apiRequest("/admin/contribution-payments/cash", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  
};
