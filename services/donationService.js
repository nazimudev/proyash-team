// Data layer for the Donation page. Set NEXT_PUBLIC_DONATION_API_URL in .env.local to connect Laravel.
// Expected endpoints (to be implemented in the backend):
//   GET  {API}/donations/public   -> { data: [ public-safe records ] }
//   GET  {API}/financial-report   -> aggregated, publicly safe report data
//   POST {API}/donations          -> { reference?: string }
// Without a configured URL, nothing is fabricated: lists are empty and submissions are refused.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/donation`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        donor_type: payload.donorType,
        full_name: payload.donorType === "anonymous" ? null : payload.name,
        phone: payload.phone || null,
        email: payload.email || null,
        amount: Number(payload.amount),
        payment_method_id: Number(payload.method),
        transaction_id: payload.transactionId || null,
        donation_date: payload.donationDate,
        status: payload.status,
        message: payload.message || null,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Donation API Error:", result);

    const error = new Error(result.message || "Failed to create donation.");

    error.status = response.status;
    error.errors = result.errors;

    throw error;
  }

  return result.data;
}


const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));
let nextSeq = sampleDonations.length + 1;

export async function fetchDonations() {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/admin/donations`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch donations");
  }

  // Laravel paginate(10) হলে result.data.data
  // Donation::all() হলে result.data

  const donations = Array.isArray(result.data)
    ? result.data
    : (result.data?.data ?? []);

  return donations.map((item) => ({
    id: item.id,

    donor: {
      name: item.full_name || "",
      isAnonymous: item.donor_type === "anonymous",
      phone: item.phone,
      email: item.email,
    },
    amount: Number(item.amount),
    method: item.payment_method?.name ?? String(item.payment_method_id),
    transactionId: item.transaction_id,
    projectId: null,
    purpose: item.purpose,
    donationDate: item.created_at,
    status: item.status,
    reject: item.rejection_reason,
    verifiedAt: item.verified_at,
    verifiedBy: item.verified_by,
    message: item.message,
  }));
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
export async function updateDonation(id, data) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/donation/${id}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  console.log(result);

  if (!response.ok) {
    throw new Error(
      result.message ||
        Object.values(result.errors || {})
          .flat()
          .join(", ") ||
        "Failed to update donation",
    );
  }

  return result.data;
} // TODO: PATCH donation
export async function verifyDonation(id) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/donations/${id}/verify`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Verification failed");
  }

  return {
    status: result.data.status,
    verifiedAt: result.data.verified_at,
    verifiedBy: result.data.verified_by,
    rejectionReason: null,
  };
}
export async function rejectDonation(id, reason = "") {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/donation/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason: reason.trim() || null,
      }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to reject donation");
  }

  return {
    status: result.data.status,
    rejectionReason: result.data.rejection_reason ?? null,
    verifiedAt: null,
    verifiedBy: null,
  };
}
export async function archiveDonation(id) {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/donation/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete donation");
  }

  return result;
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
