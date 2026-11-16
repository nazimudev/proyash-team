const API_URL = process.env.NEXT_PUBLIC_API_URL;


export class BackendNotConnectedError extends Error {
  constructor() {
    super("The member review API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const token = localStorage.getItem('auth_token');

export async function fetchMemberApplications() {
  if (!token) {
    throw new Error("Admin token is missing.");
  }

  const response = await fetch(`${API_URL}/admin/members/pending`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load applications.");
  }

  return result.data;
}

export async function approveApplication(id) {
  if (!token) {
    throw new Error("Admin token is missing.");
  }

  try {
    const response = await fetch(`${API_URL}/admin/members/${id}/approve`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    console.log("Approve API Response:", response);

    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to approve member.");
    }

    return response.data;
  } catch (error) {
    console.error("Approve API Error:", error);
    throw error;
  }
}

export async function rejectApplication(id, reason) {
  // TODO: POST reject (reason is private to administrators)
  void id;
  void reason;
  throw new BackendNotConnectedError();
}

export async function getDeleteMember(id) {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  const response = await fetch(`${API_URL}/admin/delete/member-requests/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete member.");
  }

  return result;
}
