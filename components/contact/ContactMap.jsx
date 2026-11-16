// src/components/contact/ContactMap.jsx  (server component)
import { MapPin } from "lucide-react";

const ADDRESS = "Madhupur, Tangail, Bangladesh";

// Only embeds a real Google Maps embed URL; anything else falls back to the address.
function isGoogleEmbed(url) {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith("google.com") &&
      u.pathname.startsWith("/maps/embed")
    );
  } catch {
    return false;
  }
}

export default function ContactMap({ mapUrl }) {
  const canEmbed = mapUrl && isGoogleEmbed(mapUrl);

  return (
    <section
      aria-label="Our location"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden rounded-3xl border border-green-100 bg-green-50">
        {canEmbed ? (
          <iframe
            title={`Map showing ${ADDRESS}`}
            src={mapUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 sm:h-96"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-forest shadow-sm">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              Our Location
            </h2>
            <p className="mt-1 text-gray-600">{ADDRESS}</p>
          </div>
        )}
      </div>
    </section>
  );
}
