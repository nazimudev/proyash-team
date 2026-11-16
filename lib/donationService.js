import { donationConfig } from "@/data/donationConfig";

export async function submitDonation(payload) {
  const endpoint = donationConfig.submissionEndpoint;

  if (typeof endpoint !== "string" || !endpoint.trim()) {
    return {
      ok: false,
      code: "not-configured",
    };
  }

  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      code: "network",
    };
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 422) {
    return {
      ok: false,
      code: "validation",
      message: data.message || "Validation failed.",
      errors: data.errors || {},
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      code: response.status >= 500 ? "server" : "rejected",
      message: data.message || "Donation submission failed.",
    };
  }

  return {
    ok: true,
    reference: typeof data.reference === "string" ? data.reference : null,
  };
}
