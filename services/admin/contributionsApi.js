const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function apiRequest(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result.data;
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

async function apiPostRequest(endpoint, body) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
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

export const contributionsApi = {
  // All contributions
  getContributions(params = {}) {
    return apiRequest(`/admin/contributions${buildQuery(params)}`);
  },

  // Overall summary
  getSummary(params = {}) {
    return apiRequest(`/admin/contributions/summary${buildQuery(params)}`);
  },

  // Due contributions
  getDueMembers(params = {}) {
    return apiRequest(`/admin/contributions/due-members${buildQuery(params)}`);
  },

  // Specific member history
  getMemberHistory(memberId, params = {}) {
    return apiRequest(
      `/admin/contributions/members/${memberId}${buildQuery(params)}`,
    );
  },

  generateMonthly(year, month) {
    return apiPostRequest("/admin/contributions/generate", {
      year: Number(year),
      month: Number(month),
    });
  },
};

