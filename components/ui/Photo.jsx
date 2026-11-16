"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";

/**
 * Fill-style image.
 * Give it a sized/aspect-ratio container via className.
 * Falls back to a green placeholder if the image is missing.
 */
export default function Photo({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}) {
  const [failed, setFailed] = useState(false);

  // Prevent empty or invalid image sources.
  const imageSrc =
    typeof src === "string" && src.trim() !== "" ? src.trim() : null;

  // Extract filename safely.
  const fileName = imageSrc ? imageSrc.split("/").pop() : "No image available";

  const showPlaceholder = !imageSrc || failed;

  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      {showPlaceholder ? (
        <div
          role="img"
          aria-label={alt || "Image unavailable"}
          className="absolute inset-0 grid place-items-center bg-linear-to-br from-mist via-[#e3f0e6] to-[#cfe5d4]"
        >
          <div className="flex flex-col items-center gap-1.5 px-4 text-center text-forest/70">
            <Leaf size={22} aria-hidden="true" />

            <span className="text-xs font-semibold">Photo placeholder</span>

            <span className="max-w-full truncate text-[11px] text-muted">
              {fileName}
            </span>
          </div>
        </div>
      ) : (
        <Image
          src={imageSrc}
          alt={alt || "Photo"}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      )}
    </div>
  );
}
