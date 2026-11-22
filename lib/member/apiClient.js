import { API_BASE_URL, LOGIN_PATH } from "./config";
import { MemberApiError } from "./errors";

function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function flattenErrors(errors = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : String(value),
    ]),
  );
}

async function request(method, path, { body, query } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const token = getAuthToken();

  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body && !isForm) {
    headers["Content-Type"] = "application/json";
  }

  let response;

  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new MemberApiError(
      "Could not reach the server. Check your connection and try again.",
    );
  }

  const json = await response.json().catch(() => ({}));

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.assign(LOGIN_PATH);
    }

    throw new MemberApiError(
      "Your session has expired. Please sign in again.",
      {
        status: response.status,
      },
    );
  }

  if (!response.ok) {
    throw new MemberApiError(
      json.message || "Something went wrong. Please try again.",
      {
        status: response.status,
        errors: flattenErrors(json.errors),
      },
    );
  }

  return json.data !== undefined ? json.data : json;
}

export const memberApi = {
  get: (path, query) => request("GET", path, { query }),
  post: (path, body) => request("POST", path, { body }),
  patch: (path, body) => request("PATCH", path, { body }),
};
