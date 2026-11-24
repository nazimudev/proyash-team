const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FIELD_MAP = {
  project_name: "name",
  project_id: "code",
  project_category_id: "project_category_id",
  description: "description",
  cover_image: "coverFile",
  location: "location",
  responsible_person: "responsiblePerson",
  contact_phone: "contact",
  start_date: "startDate",
  expected_end_date: "endDate",
  allocated_budget: "budget",
  funding_source: "fundingSource",
  status: "status",
  progress: "progress",
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export async function createProject(project) {
  const token = getToken();

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  const formData = new FormData();

  Object.entries(project).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    formData.append(key, value);
  });

  const response = await fetch(`${API_URL.replace(/\/+$/, "")}/admin/project`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 422) {
      console.log("Laravel validation errors:", result.errors);
      console.log("Laravel response:", result);

      const fieldErrors = {};

      Object.entries(result.errors || {}).forEach(([field, messages]) => {
        const frontendField = FIELD_MAP[field] || field;

        fieldErrors[frontendField] = Array.isArray(messages)
          ? messages[0]
          : messages;
      });

      const error = new Error("Please check the project information.");
      error.fieldErrors = fieldErrors;
      error.response = result;

      throw error;
    }

    throw new Error(result.message || "Failed to create project.");
  }

  return result.data ?? result;
}


export async function fetchProjects() {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/projects`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch projects.");
  }

  // Laravel pagination response
  const projects = result.data?.data;

  if (!Array.isArray(projects)) {
    console.error("Unexpected projects API response:", result);
    throw new Error("Invalid projects response format.");
  }

  return projects;
}


// Fetch single project by ID
export async function fetchProjectById(id) {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/projects/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch project."
    );
  }

  if (!result.success || !result.data) {
    throw new Error("Invalid project response.");
  }

  return result;
}

// Update api call
// Update project API
export async function updateProject(id, project) {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  const formData = new FormData();

  Object.entries(project).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    formData.append(key, value);
  });

  // Laravel method spoofing for multipart form data
  formData.append("_method", "PATCH");

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/project/${id}/update`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 422) {
      console.log("Laravel validation errors:", result.errors);
      console.log("Laravel response:", result);

      const fieldErrors = {};

      Object.entries(result.errors || {}).forEach(([field, messages]) => {
        const frontendField = FIELD_MAP[field] || field;

        fieldErrors[frontendField] = Array.isArray(messages)
          ? messages[0]
          : messages;
      });

      const error = new Error("Please check the project information.");
      error.fieldErrors = fieldErrors;
      error.response = result;

      throw error;
    }

    throw new Error(result.message || "Failed to update project.");
  }

  return result.data ?? result;
}

// Delete project API
export async function deleteProject(id) {
  const token = getToken();

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  if (!id) {
    throw new Error("Project ID is missing.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/project/${id}/delete`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete project.");
  }

  return result;
}

export async function fetchPublicProjects() {
  const response = await fetch(`${API_URL.replace(/\/+$/, "")}/public/projects`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch projects.");
  }

  return result.data.data;
}

export async function fetchPublicProjectById(id) {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/public/projects/${id}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Project not found.");
  }

  return result.data;
}



export async function getLatestProjects() {
  const response = await fetch(`${API_URL}/public/projects?per_page=3`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const result = await response.json();

  // Laravel pagination response
  const data = result.data?.data ?? result.data ?? [];

  const storageUrl = API_URL.replace(/\/api\/?$/, "");

  return data.slice(0, 3).map((project) => ({
    ...project,

    title: project.name,
    summary: project.description,

    category_name: project.category?.name || "Uncategorized",

    cover: {
      src:
        project.cover_image_url ||
        (project.cover_image
          ? `${storageUrl}/storage/${project.cover_image}`
          : "/images/project-placeholder.jpg"),

      alt: project.name || "Project cover image",
    },
  }));
}


function getProjectImageHeaders() {
  const token = getToken();

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// Fetch project images
export async function fetchProjectImages(projectId) {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/projects/${projectId}/images`,
    {
      method: "GET",
      headers: getProjectImageHeaders(),
      cache: "no-store",
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch project images.");
  }

  return result.data ?? [];
}

// Upload multiple project images

export async function uploadProjectImages(projectId, files, onProgress) {
  const token = getToken();

  if (!API_URL) {
    throw new Error("API URL is not configured.");
  }

  if (!token) {
    throw new Error("Admin token is missing.");
  }

  if (!projectId) {
    throw new Error("Project ID is missing.");
  }

  if (!files?.length) {
    throw new Error("Please select at least one image.");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images[]", file);
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${API_URL.replace(/\/+$/, "")}/admin/projects/${projectId}/images`,
    );

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      let result = {};

      try {
        result = JSON.parse(xhr.responseText);
      } catch {
        result = {};
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(result.data ?? result);
      } else {
        reject(new Error(result.message || "Image upload failed."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error. Please try again."));
    };

    xhr.onabort = () => {
      reject(new Error("Image upload was cancelled."));
    };

    xhr.send(formData);
  });
}


// Delete project image
export async function deleteProjectImage(imageId) {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/project-images/${imageId}`,
    {
      method: "DELETE",
      headers: getProjectImageHeaders(),
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete image.");
  }

  return result;
}

// Set featured image
export async function setFeaturedProjectImage(imageId) {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/project-images/${imageId}/featured`,
    {
      method: "PATCH",
      headers: getProjectImageHeaders(),
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to set featured image.");
  }

  return result;
}

// Sort project images
export async function sortProjectImages(projectId, imageIds) {
  const response = await fetch(
    `${API_URL.replace(/\/+$/, "")}/admin/projects/${projectId}/images/sort`,
    {
      method: "PATCH",
      headers: {
        ...getProjectImageHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_ids: imageIds,
      }),
    },
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to sort project images.");
  }

  return result;
}


