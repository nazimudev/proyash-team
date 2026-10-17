// INTEGRATION PLACEHOLDER: swap `request` for your existing Laravel API client if you have one.
// Required backend endpoints (Laravel, Sanctum cookie auth assumed):
//   GET  /sanctum/csrf-cookie
//   POST /api/v1/membership/apply   (multipart/form-data) -> 201 { data: { reference_number?, status: "pending" } }
//   GET  /api/v1/membership/status  (authenticated applicant only) -> { data: { status, reference_number, submitted_at } }
const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export class MembershipError extends Error {
  constructor(message, { fieldErrors = null, status = 0 } = {}) {
    super(message);
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

const xsrf = () => {
  const m = typeof document !== 'undefined' && document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
};

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      credentials: 'include',
      ...options,
      headers: { Accept: 'application/json', 'X-XSRF-TOKEN': xsrf(), ...(options.headers || {}) },
    });
  } catch {
    throw new MembershipError('Could not reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => null);
  if (res.status === 422) {
    const fieldErrors = Object.fromEntries(
      Object.entries(data?.errors || {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
    );
    throw new MembershipError(data?.message || 'Please correct the highlighted fields.', { fieldErrors, status: 422 });
  }
  if (res.status === 429) throw new MembershipError('Too many attempts. Please wait a few minutes and try again.', { status: 429 });
  if (!res.ok) throw new MembershipError('The server could not process your application. Please try again later.', { status: res.status });
  return data;
}

export async function applyForMembership(values, photo) {
  await fetch(`${BASE}/sanctum/csrf-cookie`, { credentials: 'include' }).catch(() => {});
  const body = new FormData();
  Object.entries(values).forEach(([k, v]) => {
    if (typeof v === 'boolean') body.append(k, v ? '1' : '0');
    else if (v !== '') body.append(k, v);
  });
  if (photo) body.append('profile_photo', photo);
  return request('/api/v1/membership/apply', { method: 'POST', body });
}

export const getMyApplicationStatus = () => request('/api/v1/membership/status');
