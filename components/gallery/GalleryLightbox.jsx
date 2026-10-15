"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Lightbox on the native <dialog> element: showModal() makes the page behind it
 * inert, traps Tab focus, closes on Escape, and returns focus to the thumbnail
 * that opened it. We add arrow-key navigation, scroll lock and backdrop click.
 * `index` is null when closed.
 */
export default function GalleryLightbox({ images, index, labelOf, onClose, onNavigate }) {
  const ref = useRef(null);
  const [failedId, setFailedId] = useState(null);
  const open = index !== null && images[index];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  const image = open ? images[index] : null;
  const hasPrev = open && index > 0;
  const hasNext = open && index < images.length - 1;

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
    if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
  };

  const navBtn =
    "grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white/10";

  return (
    <dialog
      ref={ref}
      aria-label={image ? `Photo viewer: ${image.title}` : "Photo viewer"}
      onClose={onClose}
      onKeyDown={onKeyDown}
      className="on-dark m-0 h-dvh max-h-none w-dvw max-w-none bg-transparent p-0 text-white backdrop:bg-surface"
    >
      {image && (
        <div
          className="flex h-full flex-col"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="order-2 grid size-12 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/25"
            >
              <X size={22} aria-hidden="true" />
            </button>
            <div className="order-1 min-w-0">
              <p className="text-sm font-bold text-fresh">{labelOf[image.category]}</p>
              <h2 className="text-lg font-extrabold leading-snug sm:text-xl">{image.title}</h2>
              <p className="mt-0.5 text-sm text-white/70" aria-live="polite">
                Photo {index + 1} of {images.length}
              </p>
            </div>
          </div>

          <div
            className="relative mx-4 min-h-0 flex-1 sm:mx-20"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            {failedId === image.id ? (
              <p className="absolute inset-0 grid place-items-center text-white/70">This photo could not be loaded.</p>
            ) : (
              <Image
                key={image.id}
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                onError={() => setFailedId(image.id)}
                className="pointer-events-none object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <button type="button" onClick={() => onNavigate(index - 1)} disabled={!hasPrev} aria-label="Previous photo" className={navBtn}>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1 text-center text-sm text-white/80">
              {[image.dateLabel, image.location].filter(Boolean).join(" · ") && (
                <p className="font-semibold">{[image.dateLabel, image.location].filter(Boolean).join(" · ")}</p>
              )}
              {image.caption && <p className="mx-auto mt-0.5 max-w-xl">{image.caption}</p>}
              {!image.isVerified && <p className="mt-0.5 text-xs text-white/60">Illustrative image, not a record of an actual activity.</p>}
            </div>
            <button type="button" onClick={() => onNavigate(index + 1)} disabled={!hasNext} aria-label="Next photo" className={navBtn}>
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
