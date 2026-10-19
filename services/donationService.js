// Data layer for the Donation page. Set NEXT_PUBLIC_DONATION_API_URL in .env.local to connect Laravel.
// Expected endpoints (to be implemented in the backend):
//   GET  {API}/donations/public   -> { data: [ public-safe records ] }
//   GET  {API}/financial-report   -> aggregated, publicly safe report data
//   POST {API}/donations          -> { reference?: string }
// Without a configured URL, nothing is fabricated: lists are empty and submissions are refused.

const API_URL = process.env.NEXT_PUBLIC_DONATION_API_URL;

import { sampleDonations } from "@/data/sampleDonations";
import { sampleProjects } from "@/data/sampleProjects";
import { donationsToCsv } from "@/lib/donationUtils";

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


const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
let nextSeq = sampleDonations.length + 1;

export async function fetchDonations() {
  await wait();
  return structuredClone(sampleDonations);
} // TODO: GET donations
export async function fetchProjects() {
  await wait(150);
  return structuredClone(sampleProjects);
} // TODO: GET projects
export async function fetchDonationDetails(id) {
  await wait();
  return structuredClone(sampleDonations.find((x) => x.id === id) ?? null);
} // TODO: GET donation

export async function createDonation(payload) {
  // TODO: POST donation
  await wait();
  const id = `DON-${String(nextSeq++).padStart(4, "0")}`; // the server must assign real IDs
  return {
    verifiedAt: null,
    verifiedBy: null,
    rejectionReason: null,
    archived: false,
    ...payload,
    id,
  };
}
export async function updateDonation(id, patch) {
  await wait();
  return { id, ...patch };
} // TODO: PATCH donation
export async function verifyDonation(id) {
  // TODO: POST verify (server sets time and admin)
  await wait();
  return {
    status: "verified",
    verifiedAt: new Date().toISOString(),
    verifiedBy: null,
    rejectionReason: null,
  };
}
export async function rejectDonation(id, reason) {
  // TODO: POST reject
  await wait();
  return {
    status: "rejected",
    rejectionReason: reason?.trim() || null,
    verifiedAt: null,
    verifiedBy: null,
  };
}
export async function archiveDonation(id) {
  await wait();
  return { archived: true };
} // TODO: archive/void with audit trail
export async function uploadPaymentProof(file) {
  // TODO: multipart upload; nothing is stored here
  await wait(500);
  return { fileName: file.name };
}

// Client-side CSV export of the rows passed in (the filtered set). No server involved.
export function exportDonations(rows, projects) {
  const blob = new Blob([donationsToCsv(rows, projects)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "donations-export.csv";
  a.click();
  URL.revokeObjectURL(url);
}
