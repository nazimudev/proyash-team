const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class BackendNotConnectedError extends Error {
  constructor() {
    super("The member review API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || fallbackMessage);
  }

  return result;
}

export async function fetchMemberApplications() {
  const response = await fetch(`${API_URL}/admin/members/pending`, {
    method: "GET",
    headers: getAuthHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response, "Failed to load applications.");

  return result.data;
}

export async function approveApplication(id) {
  const response = await fetch(`${API_URL}/admin/members/${id}/approve`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(response, "Failed to approve member.");
}


export async function updateMemberApplication(id, payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "addresses" && value) {
      Object.entries(value).forEach(([type, address]) => {
        Object.entries(address).forEach(([field, fieldValue]) => {
          formData.append(`addresses[${type}][${field}]`, fieldValue ?? "");
        });
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined) {
      formData.append(key, value ?? "");
    }
  });

  // Laravel method spoofing for multipart upload
  formData.append("_method", "PATCH");

  const response = await fetch(`${API_URL}/admin/update/members/${id}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  return handleResponse(response, "Failed to update member information.");
}


export async function rejectApplication(id, reason) {
  void id;
  void reason;
  throw new BackendNotConnectedError();
}

export async function getDeleteMember(id) {
  const response = await fetch(
    `${API_URL}/admin/delete/member-requests/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  return handleResponse(response, "Failed to delete member.");
}
