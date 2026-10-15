// Isolated submission handler. To connect a Laravel API, set
// NEXT_PUBLIC_CONTACT_API_URL in .env.local, for example:
// NEXT_PUBLIC_CONTACT_API_URL=https://api.example.org/api/contact
// Until it is set, the form reports that messaging is unavailable.
// It never shows a success message without a confirmed server response.

export async function submitContactForm(payload) {
  const url = process.env.NEXT_PUBLIC_CONTACT_API_URL;

  if (!url) {
    return { ok: false, code: "NOT_CONFIGURED" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, code: `HTTP_${res.status}` };
    }

    return { ok: true };
  } catch {
    return { ok: false, code: "NETWORK" };
  }
}
