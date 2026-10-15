// Data layer for the Donation page. Set NEXT_PUBLIC_DONATION_API_URL in .env.local to connect Laravel.
// Expected endpoints (to be implemented in the backend):
//   GET  {API}/donations/public   -> { data: [ public-safe records ] }
//   GET  {API}/financial-report   -> aggregated, publicly safe report data
//   POST {API}/donations          -> { reference?: string }
// Without a configured URL, nothing is fabricated: lists are empty and submissions are refused.

const API_URL = process.env.NEXT_PUBLIC_DONATION_API_URL;

export async function getPublicDonations() {
  if (!API_URL) return { configured: false, records: [] };
  try {
    const res = await fetch(`${API_URL}/donations/public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { configured: true, records: [], error: true };
    const data = await res.json();
    return {
      configured: true,
      records: Array.isArray(data?.data) ? data.data : [],
    };
  } catch {
    return { configured: true, records: [], error: true };
  }
}

export async function getFinancialReport() {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/financial-report`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function submitDonation(payload) {
  if (!API_URL) return { ok: false, code: "NOT_CONFIGURED" };
  try {
    const res = await fetch(`${API_URL}/donations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, code: `HTTP_${res.status}` };
    const data = await res.json().catch(() => ({}));
    return { ok: true, reference: data?.reference ?? null };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}
