const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GALLERY_ENDPOINT = `${API_URL}/admin/gallery`;

/**
 * Get authentication headers.
 */
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Handle Laravel API responses.
 */
async function handleResponse(response) {
  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong.");

    error.status = response.status;

    // Convert Laravel validation arrays into strings.
    error.fieldErrors = Object.fromEntries(
      Object.entries(result.errors || {}).map(([key, messages]) => [
        key,
        Array.isArray(messages) ? messages[0] : messages,
      ]),
    );

    throw error;
  }

  return result;
}

/**
 * Build multipart form data.
 */
function buildPhotoFormData(fields, imageFile, method = null) {
  const formData = new FormData();

  const allowedFields = [
    "title",
    "description",
    "category",
    "activity_date",
    "alt_text",
    "status",
  ];

  allowedFields.forEach((key) => {
    if (fields[key] !== undefined && fields[key] !== null) {
      formData.append(key, fields[key]);
    }
  });

  if (imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  // Laravel method spoofing for multipart updates.
  if (method) {
    formData.append("_method", method);
  }

  return formData;
}

/**
 * GET: Fetch all gallery photos.
 */
export async function fetchGalleryPhotos() {
  const response = await fetch(GALLERY_ENDPOINT, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
}

/**
 * POST: Create gallery photo.
 */
export async function createPhoto({ fields, imageFile }) {
  const formData = buildPhotoFormData(fields, imageFile);

  const response = await fetch(GALLERY_ENDPOINT, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    photo: result.data,
  };
}

/**
 * POST with PUT override: Update gallery photo.
 */
export async function updatePhoto(id, { fields, imageFile }) {
  const formData = buildPhotoFormData(fields, imageFile, "PUT");

  const response = await fetch(`${GALLERY_ENDPOINT}/${id}/update`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    photo: result.data,
  };
}

/**
 * PATCH: Publish or unpublish gallery photo.
 */
export async function setPhotoStatus(id, status) {
  const response = await fetch(`${GALLERY_ENDPOINT}/${id}/status`, {
    method: "PATCH",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const result = await handleResponse(response);

  return {
    photo: result.data,
  };
}

/**
 * DELETE: Remove gallery photo.
 */
export async function deletePhoto(id) {
  const response = await fetch(`${GALLERY_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}


const categoryMap = {
  "Community Support": "community",
  "Education Support": "education",
  "Educational Support": "education",
  "Tree Plantation": "environment",
  "Social Activities": "events",
  Events: "events",
  "Events & Activities": "events",
  "Other Activities": "events",
};

export async function getPublicGallery() {
  const response = await fetch(`${API_URL}/public/gallery`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load gallery.");
  }

  return (Array.isArray(result.data) ? result.data : [])
    .filter((item) => item.status === "published")
    .map((item) => ({
      id: item.id,
      title: item.title || "Gallery Photo",
      category: categoryMap[item.category] || "events",
      src:
        typeof item.image_url === "string" && item.image_url.trim() !== ""
          ? item.image_url.trim()
          : null,
      alt: item.alt_text || item.title || "Gallery photo",
      caption: item.description || null,
      dateLabel: item.activity_date || null,
      location: null,
      isVerified: true,
    }));
}
