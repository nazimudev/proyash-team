"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

// Shows the image, or a graceful fallback if it is missing or fails to load.
export default function GalleryImage({ photo, className = "", fit = "object-cover" }) {
  const [failedSrc, setFailedSrc] = useState(null);
  if (!photo.image_url || failedSrc === photo.image_url) {
    return (
      <div role="img" aria-label="Image unavailable" className={`flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff className="h-6 w-6" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    );
  }
  return <img src={photo.image_url} alt={photo.alt_text || photo.title} loading="lazy" onError={() => setFailedSrc(photo.image_url)} className={`${fit} ${className}`} />;
}
