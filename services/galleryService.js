const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

function getApiUrl() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return API_URL;
}

const GALLERY_ENDPOINT = `${API_URL}/admin/gallery`;

// Authentication Headers
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Handle Laravel API Responses
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

// Build Multipart Form Data
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

  if (typeof File !== "undefined" && imageFile instanceof File) {
    formData.append("image", imageFile);
  }

  if (method) {
    formData.append("_method", method);
  }

  return formData;
}

// GET: Admin Gallery
export async function fetchGalleryPhotos() {
  const response = await fetch(`${getApiUrl()}/admin/gallery`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
}

// POST: Create Gallery Photo
export async function createPhoto({ fields, imageFile }) {
  const formData = buildPhotoFormData(fields, imageFile);

  const response = await fetch(`${getApiUrl()}/admin/gallery`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    photo: result.data,
  };
}

// POST: Update Gallery Photo
export async function updatePhoto(id, { fields, imageFile }) {
  const formData = buildPhotoFormData(fields, imageFile, "PUT");

  const response = await fetch(`${getApiUrl()}/admin/gallery/${id}/update`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const result = await handleResponse(response);

  return {
    photo: result.data,
  };
}

// PATCH: Publish / Unpublish
export async function setPhotoStatus(id, status) {
  const response = await fetch(`${getApiUrl()}/admin/gallery/${id}/status`, {
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

// DELETE: Gallery Photo
export async function deletePhoto(id) {
  const response = await fetch(`${getApiUrl()}/admin/gallery/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse(response);
}


// Public Gallery Category Mapping
const categoryMap = {
  "Healthcare": "healthcare",
  "Education & Awareness": "education",
  "Humanitarian Assistance": "humanitarian",
  "Environmental": "environmental",
  "Youth Development": "youth",
  "Equality & Social Inclusion": "equality",
  "Others": "others",
};

// GET: Public Gallery
export async function getPublicGallery() {
  const response = await fetch(`${getApiUrl()}/public/gallery`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: 60,
    },
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid gallery API response.");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to load gallery.");
  }

  return (Array.isArray(result.data) ? result.data : [])
    .filter((item) => item.status === "published")
    .map((item) => ({
      id: item.id,
      title: item.title || "Gallery Photo",

      category:
        categoryMap[item.category] || "others",

      src:
        typeof item.image_url === "string" &&
        item.image_url.trim() !== ""
          ? item.image_url.trim()
          : null,

      alt: item.alt_text || item.title || "Gallery photo",
      caption: item.description || null,
      dateLabel: item.activity_date || null,
      location: null,
      isVerified: true,
    }));
}
