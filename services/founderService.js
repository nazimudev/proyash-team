const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class BackendNotConnectedError extends Error {
  constructor() {
    super("The founder API is not connected yet.");
    this.name = "BackendNotConnectedError";
  }
}

async function handleResponse(response) {
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.log("Founder API Error:", result);
    console.log("Validation Errors:", result.errors);

    const error = new Error(result.message || "Something went wrong.");

    error.status = response.status;

    error.fieldErrors = result.errors
      ? Object.fromEntries(
          Object.entries(result.errors).map(([key, value]) => [
            key,
            Array.isArray(value) ? value[0] : value,
          ]),
        )
      : {};

    throw error;
  }

  return result;
}

function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// GET: All founders (Admin)
export async function fetchFounders() {
  const response = await fetch(`${API_URL}/admin/founders`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data?.data ?? [];
}

// POST: Create founder
export async function createFounder({ fields, photoFile }) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append("confirmed", fields.confirmed ? "1" : "0");

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const response = await fetch(`${API_URL}/admin/founders`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    founder: result.data,
  };
}

// POST: Update founder
export async function updateFounder(id, { fields, photoFile, removePhoto }) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  formData.append("confirmed", fields.confirmed ? "1" : "0");

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  if (removePhoto) {
    formData.append("remove_photo", "1");
  }

  const response = await fetch(`${API_URL}/admin/founders/${id}/update`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    founder: result.data,
  };
}

// Publish / Unpublish founder
export async function setFounderStatus(id, status) {
  const formData = new FormData();

  formData.append("status", status);

  // Publishing requires confirmation.
  if (status === "published") {
    formData.append("confirmed", "1");
  }

  const response = await fetch(`${API_URL}/admin/founders/${id}/update`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    founder: result.data,
  };
}

// DELETE: Founder
export async function deleteFounder(id) {
  const response = await fetch(`${API_URL}/admin/founders/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const result = await handleResponse(response);

  return result;
}
