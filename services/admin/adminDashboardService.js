import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAdminDashboard(year = new Date().getFullYear()) {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(`${API_URL}/admin/dashboard?year=${year}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load dashboard.");
  }

  return result.data;
}
