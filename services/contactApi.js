// src/services/public/contactApi.js
import { unstable_cache } from "next/cache";
const API_URL = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");

// Path of your existing public organization-settings endpoint (relative to API_URL).
const SETTINGS_PATH =
  process.env.NEXT_PUBLIC_SETTINGS_ENDPOINT || "/public/contact-settings";

export async function submitContactMessage(formData) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(formData),
  });

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const error = new Error(
      res.status === 429
        ? "Too many messages sent. Please wait a few minutes and try again."
        : json?.message || "Something went wrong. Please try again.",
    );
    error.status = res.status;
    error.errors = json?.errors || {};
    throw error;
  }

  return json;
}

/**
 * Reads phone / email / working hours / map URL from your existing settings API.
 * Returns only values that actually exist; never invents anything.
 *
 * ADJUST the key names in pick(...) below to match your settings response.
 */
const fetchContactSettings = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${API_URL}${SETTINGS_PATH}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) return {};

      const json = await res.json();
      const raw = json?.data ?? json ?? {};

      const pick = (...keys) => {
        for (const key of keys) {
          const value = raw?.[key];

          if (typeof value === "string" && value.trim()) {
            return value.trim();
          }
        }

        return null;
      };

      return {
        phone: pick("phone", "contact_phone", "phone_number"),
        email: pick("email", "contact_email"),
        workingHours: pick("working_hours", "office_hours", "opening_hours"),
        mapUrl: pick("google_map_url", "map_embed_url", "map_url"),
      };
    } catch (error) {
      console.error("Contact settings error:", error);
      return {};
    }
  },
  ["contact-settings"],
  {
    revalidate: 300,
  },
);

export async function getContactSettings() {
  return fetchContactSettings();
}