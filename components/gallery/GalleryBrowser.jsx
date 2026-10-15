"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import GalleryFilters from "@/components/gallery/GalleryFilters";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

/** Client island: owns the category filter and lightbox state. `status` is ready for a future API fetch. */
export default function GalleryBrowser({
  categories,
  images,
  status = "ready",
}) {
  const [category, setCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const counts = Object.fromEntries(
    categories.map((c) => [
      c.id,
      c.id === "all"
        ? images.length
        : images.filter((i) => i.category === c.id).length,
    ]),
  );
  const visible =
    category === "all" ? images : images.filter((i) => i.category === category);

  return (
    <section
      id="gallery-browser"
      aria-label="Photo gallery"
      className="scroll-mt-20 bg-mist py-16 sm:py-24"
    >
      <Container>
        <GalleryFilters
          categories={categories}
          counts={counts}
          value={category}
          onChange={setCategory}
        />
        {images.length > 0 && status === "ready" && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 text-sm font-semibold text-muted"
          >
            Showing {visible.length} {visible.length === 1 ? "photo" : "photos"}
          </p>
        )}

        <div className="mt-8">
          <GalleryGrid
            images={visible}
            totalCount={images.length}
            labelOf={labelOf}
            status={status}
            onOpen={(index) => setOpenIndex(index)}
          />
        </div>

        <GalleryLightbox
          images={visible}
          index={openIndex}
          labelOf={labelOf}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      </Container>
    </section>
  );
}
