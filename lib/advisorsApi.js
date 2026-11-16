// src/lib/advisorsApi.js
// Replace getAuthToken() with however your project already reads the Sanctum token.

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL
).replace(/\/$/, "");

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token"); // <- adjust to your existing auth storage key
}

async function request(
  path,
  { method = "GET", body, auth = false, ...options } = {},
) {
  const headers = { Accept: "application/json" };

  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  // Do NOT set Content-Type for FormData; the browser adds the multipart boundary.

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body,
    ...options,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const firstFieldError = json?.errors
      ? Object.values(json.errors).flat()[0]
      : null;
    const error = new Error(
      firstFieldError || json?.message || "Request failed.",
    );
    error.status = res.status;
    error.errors = json?.errors || {};
    throw error;
  }

  return json;
}

export function getAdvisors({ page = 1, perPage = 12, ...options } = {}) {
  return request(`/public/advisors?page=${page}&per_page=${perPage}`, options);
}

export function getAdvisor(id) {
  return request(`/advisors/${id}`);
}

export function createAdvisor(formData) {
  return request("/admin/advisors", {
    method: "POST",
    body: formData,
    auth: true,
  });
}

export function updateAdvisor(id, formData) {
  formData.append("_method", "PUT"); // method spoofing so Laravel can read multipart data
  return request(`/admin/advisors/${id}`, {
    method: "POST",
    body: formData,
    auth: true,
  });
}

export function deleteAdvisor(id) {
  return request(`/admin/advisors/${id}`, { method: "DELETE", auth: true });
}
