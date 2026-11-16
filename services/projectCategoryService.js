const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const baseURL = API_URL.replace(/\/+$/, "");

  const response = await fetch(`${baseURL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong.");

    error.fieldErrors = result.errors || {};
    throw error;
  }

  return result;
}

export async function fetchCategories() {
  const result = await apiRequest("/admin/project-categories");

  if (Array.isArray(result.data)) return result.data;

  if (Array.isArray(result.data?.data)) return result.data.data;

  return [];
}

export async function createCategory(data) {
  return apiRequest("/admin/project-categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id, data) {
  return apiRequest(`/admin/project-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id) {
  return apiRequest(`/admin/project-categories/${id}`, {
    method: "DELETE",
  });
}
