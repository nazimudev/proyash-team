import { donationConfig } from "@/data/donationConfig";

/**
 * Donation submission. This is the ONLY place that talks to a backend.
 * - With no configured endpoint it returns { ok: false, code: "not-configured" } and sends nothing.
 * - It never reports success unless the server answered with a 2xx.
 * - It never logs or persists the payload (no console, localStorage or sessionStorage).
 * Returns { ok, code?, reference? }.
 */
export async function submitDonation(payload) {
  const endpoint = donationConfig.submissionEndpoint;
  if (typeof endpoint !== "string" || !endpoint.trim()) return { ok: false, code: "not-configured" };

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, code: "network" };
  }

  if (!response.ok) return { ok: false, code: response.status >= 500 ? "server" : "rejected" };

  let reference = null;
  try {
    const data = await response.json();
    // Only a backend-generated reference is ever shown.
    if (typeof data?.reference === "string" && data.reference.trim()) reference = data.reference.trim();
  } catch {
    /* empty or non-JSON success body is fine */
  }
  return { ok: true, reference };
}
