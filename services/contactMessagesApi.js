// src/services/admin/contactMessagesApi.js
// If your project already has an authenticated fetch helper, reuse it and delete getAuthToken() here.
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL
).replace(/\/$/, "");

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token"); // <- adjust to your existing auth storage
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const error = new Error(json?.message || "Request failed.");
    error.status = res.status;
    throw error;
  }
  return json;
}

export function getContactMessages({
  page = 1,
  perPage = 15,
  search = "",
  status = "",
} = {}) {
  const params = new URLSearchParams({ page, per_page: perPage });
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  return request(`/admin/contact-messages?${params}`);
}

export const getContactMessage = (id) =>
  request(`/admin/contact-messages/${id}`);

export const updateContactMessageStatus = (id, status) =>
  request(`/admin/contact-messages/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

export const deleteContactMessage = (id) =>
  request(`/admin/contact-messages/${id}`, { method: "DELETE" });
