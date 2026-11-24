import { unstable_cache } from "next/cache";

// API Configuration
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const SETTINGS_PATH =
  process.env.NEXT_PUBLIC_SETTINGS_ENDPOINT || "/public/contact-settings";

// Validate API URL when making requests
function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is missing. Please configure your environment variables.",
    );
  }

  return API_URL;
}

// Submit Contact Message
export async function submitContactMessage(formData) {
  const apiUrl = getApiUrl();

  const res = await fetch(`${apiUrl}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  });

  let json = null;

  try {
    json = await res.json();
  } catch {
    // Non-JSON response
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

// Fetch Contact Settings
const fetchContactSettings = unstable_cache(
  async () => {
    try {
      const apiUrl = getApiUrl();

      const res = await fetch(`${apiUrl}${SETTINGS_PATH}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Contact settings API failed:", res.status);
        return {};
      }

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

// Public Function
export async function getContactSettings() {
  return fetchContactSettings();
}
