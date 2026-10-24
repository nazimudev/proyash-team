import { membershipConfig } from "@/data/membershipConfig";

/**
 * The ONLY place that talks to a membership/auth backend.
 *  - Empty endpoint -> { ok:false, code:"not-configured" } and NOTHING is sent.
 *  - Success is reported only after a real 2xx; no fake references, ids or statuses are ever produced.
 *  - Passwords are sent only in the request body, never logged and never kept (no localStorage/sessionStorage).
 *  - Statuses are accepted only if they are one of the four known values, and are never derived client-side.
 */
const STATUSES = ["pending", "approved", "rejected", "suspended"];
const endpointOf = (key) => {
  const url = membershipConfig.endpoints[key];
  return typeof url === "string" && url.trim() ? url.trim() : null;
};
const asStatus = (s) => (STATUSES.includes(s) ? s : null);
const failure = (response) =>
  response.status === 429 ? "rate-limited" : response.status === 401 ? "unauthenticated" : response.status >= 500 ? "server" : "rejected";

export const isConfigured = (key) => endpointOf(key) !== null;

async function request(key, init = {}) {
  const url = endpointOf(key);

  if (!url) {
    return { ok: false, code: "not-configured" };
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });

    return { response };
  } catch {
    return { ok: false, code: "network" };
  }
}

/** formData: a FormData built by the form (account + application + optional profile_photo). */
export async function applyForMembership(formData) {
  const r = await request("apply", { method: "POST", body: formData });
  if (!r.response) return r;
  const { response } = r;

  if (response.status === 422) {
    let fieldErrors = {};
    try {
      const data = await response.json();
      for (const [field, msgs] of Object.entries(data?.errors ?? {})) {
        const first = Array.isArray(msgs) ? msgs[0] : msgs;
        if (typeof first === "string") fieldErrors[field] = first;
      }
    } catch {
      fieldErrors = {};
    }
    return { ok: false, code: "validation", fieldErrors };
  }
  if (!response.ok) return { ok: false, code: failure(response) };

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* an empty success body is fine */
  }
  return { ok: true, reference: typeof data?.reference === "string" && data.reference.trim() ? data.reference.trim() : null, status: asStatus(data?.status) ?? "pending" };
}

export async function loginMember({ email, password }) {
  const r = await request("login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!r.response) return r;

  if (r.response.status === 401 || r.response.status === 422) {
    return { ok: false, code: "invalid-credentials" };
  }

  if (!r.response.ok) {
    return { ok: false, code: failure(r.response) };
  }

  let data;

  try {
    data = await r.response.json();
  } catch {
    return { ok: false, code: "unexpected" };
  }

  const user = data?.user;

  if (
    typeof data?.token !== "string" ||
    !data.token ||
    !user ||
    !["admin", "member"].includes(user.role) ||
    user.is_active !== true
  ) {
    return { ok: false, code: "unexpected" };
  }

  return {
    ok: true,
    token: data.token,
    tokenType: data.token_type || "Bearer",
    user,
    redirectTo:
      user.role === "admin" ? "/admin" : "/member",
  };
}

export async function getMembershipStatus() {
  const r = await request("status", { method: "GET" });
  if (!r.response) return r;
  if (!r.response.ok) return { ok: false, code: failure(r.response) };
  let data = null;
  try {
    data = await r.response.json();
  } catch {
    /* handled below */
  }
  const status = asStatus(data?.status);
  if (!status) return { ok: false, code: "unexpected" };
  return {
    ok: true,
    status,
    reference: typeof data.reference === "string" && data.reference.trim() ? data.reference.trim() : null,
    submittedAt: typeof data.submitted_at === "string" ? data.submitted_at : null,
  };
}
