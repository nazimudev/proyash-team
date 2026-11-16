// Blog & News API service. Uses the Fetch API, NEXT_PUBLIC_API_URL and a Bearer token.
//
// ASSUMPTIONS TO CONFIRM (these are the only places to adapt; nothing else in the module depends on them):
//   1. getAuthToken(): where your existing services read the token. The default below is a guess.
//   2. BLOG_PATH / BLOG_CATEGORY_PATH: the real Laravel routes. They are expected paths, not confirmed endpoints.
//   3. NEXT_PUBLIC_API_URL already contains any "/api" prefix.
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
export const BLOG_PATH = "/admin/blogs";
export const BLOG_CATEGORY_PATH = "/admin/blog-categories";

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors; // { field: "first message" } for HTTP 422
  }
}

// ASSUMPTION: replace with your project's token getter.
function getAuthToken() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

// Laravel sends { errors: { title: ["The title field is required."] } }. The form shows one string per field.
const FIELD_ALIASES = { category: "category_id", image: "featured_image" };
function flattenErrors(errors) {
  if (!errors || typeof errors !== "object") return null;
  const out = {};
  for (const [key, val] of Object.entries(errors))
    out[FIELD_ALIASES[key] ?? key] = Array.isArray(val) ? val[0] : String(val);
  return Object.keys(out).length ? out : null;
}

async function request(path, { method = "GET", params, body, signal } = {}) {
  if (!API_URL)
    throw new ApiError(
      "The API address is not configured (NEXT_PUBLIC_API_URL is missing).",
    );
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {}))
    if (v !== undefined && v !== null && v !== "" && v !== "all")
      query.set(k, String(v));
  const url = `${API_URL}${path}${query.toString() ? `?${query}` : ""}`;

  const headers = { Accept: "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (body instanceof FormData)
    payload = body; // never set Content-Type for FormData
  else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: payload,
      signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError(
      "Couldn't reach the server. Check your connection and try again.",
    );
  }

  const text = await res.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (res.ok) {
    if (text && json === null)
      throw new ApiError(
        "The server sent an unexpected response. Check the API address.",
        { status: res.status },
      );
    if (json && json.success === false)
      throw new ApiError(json.message || "The request was not successful.", {
        status: res.status,
        fieldErrors: flattenErrors(json.errors),
      });
    return json;
  }
  if (res.status === 401)
    throw new ApiError(
      "Your session has expired or you are not logged in. Please log in again.",
      { status: 401 },
    );
  if (res.status === 403)
    throw new ApiError("You don't have permission to do that.", {
      status: 403,
    });
  if (res.status === 422)
    throw new ApiError(
      json?.message || "Please correct the highlighted fields.",
      { status: 422, fieldErrors: flattenErrors(json?.errors) },
    );
  if (res.status === 404)
    throw new ApiError(
      "That item could not be found. It may have been deleted.",
      { status: 404 },
    );
  if (res.status >= 500)
    throw new ApiError(
      "The server ran into a problem. Please try again in a moment.",
      { status: res.status },
    );
  throw new ApiError(json?.message || `The request failed (${res.status}).`, {
    status: res.status,
  });
}

const unwrap = (json) => json?.data ?? json ?? null;
const requireJson = (json) => {
  if (json === null || json === undefined)
    throw new ApiError("The server sent an empty response.", { status: 200 });
  return json;
};
const enc = (id) => encodeURIComponent(String(id));

// params: { page, per_page, search, status, category_id }. Empty values and "all" are not sent.
export async function fetchBlogs(params = {}, { signal } = {}) {
  const payload = unwrap(
    requireJson(await request(BLOG_PATH, { params, signal })),
  );
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  return {
    items,
    meta: {
      currentPage: Number(payload?.current_page) || 1,
      lastPage: Number(payload?.last_page) || 1,
      perPage: Number(payload?.per_page) || items.length || 10,
      total: Number(payload?.total) || items.length,
    },
  };
}

export async function fetchBlogById(id) {
  return unwrap(requireJson(await request(`${BLOG_PATH}/${enc(id)}`)));
}

export async function createBlog(formData) {
  return unwrap(await request(BLOG_PATH, { method: "POST", body: formData }));
}

// Laravel doesn't read multipart bodies on PUT/PATCH, so this is a POST with method spoofing.
export async function updateBlog(id, formData) {
  formData.set("_method", "PUT");
  return unwrap(
    await request(`${BLOG_PATH}/${enc(id)}`, {
      method: "POST",
      body: formData,
    }),
  );
}

export async function deleteBlog(id) {
  await request(`${BLOG_PATH}/${enc(id)}`, { method: "DELETE" });
  return true;
}
export async function publishBlog(id) {
  return unwrap(
    await request(`${BLOG_PATH}/${enc(id)}/publish`, { method: "POST" }),
  );
}
export async function unpublishBlog(id) {
  return unwrap(
    await request(`${BLOG_PATH}/${enc(id)}/unpublish`, { method: "POST" }),
  );
}

// Not in the original function list, but the Category select needs real options (ids must come from the backend).
export async function fetchBlogCategories() {
  const payload = unwrap(requireJson(await request(BLOG_CATEGORY_PATH)));
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
}
