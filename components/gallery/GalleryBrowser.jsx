"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import GalleryFilters from "@/components/gallery/GalleryFilters";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";

const CATEGORY_ALIASES = {
  healthcare: "healthcare",

  education: "education",
  educationawareness: "education",
  educationsupport: "education",

  humanitarian: "humanitarian",
  humanitarianassistance: "humanitarian",
  communitysupport: "humanitarian",

  environmental: "environmental",
  treeplantation: "environmental",

  youth: "youth",
  youthdevelopment: "youth",

  equality: "equality",
  equalityandsocialinclusion: "equality",

  others: "others",
  otheractivities: "others",
  events: "others",
  socialactivities: "others",
};

function normalizeCategory(value) {
  const normalized = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return CATEGORY_ALIASES[normalized] || normalized;
}

export default function GalleryBrowser({ categories, images, status }) {
  const [category, setCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);

  const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));

  const visible =
    category === "all"
      ? images
      : images.filter(
          (image) => normalizeCategory(image.category) === category,
        );

  const counts = Object.fromEntries(
    categories.map((c) => [
      c.id,
      c.id === "all"
        ? images.length
        : images.filter((image) => normalizeCategory(image.category) === c.id)
            .length,
    ]),
  );

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
          onChange={(value) => {
            setCategory(value);
            setOpenIndex(null);
          }}
        />

        {images.length > 0 && status === "ready" && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 text-sm font-semibold text-muted"
          >
            Showing {visible.length}{" "}
            {visible.length === 1 ? "event" : "events"}
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
