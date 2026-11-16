// src/services/admin/contactSettingsApi.js
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

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
    error.errors = json?.errors || {};
    throw error;
  }
  return json;
}

export const getAdminContactSettings = () => request("/admin/contact-settings");
export const updateContactSettings = (data) =>
  request("/admin/contact-settings", { method: "PUT", body: data });
