"use client";

import { useState } from "react";
import { Camera, CalendarDays, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Photo from "@/components/ui/Photo";
import EmptyState from "@/components/impact/EmptyState";
import { impactGalleryIntro as c, impactFocusAreas } from "@/data/impact";
import { formatDate } from "@/lib/impact";

export default function ImpactGallery({ gallery }) {
  const [category, setCategory] = useState("all");
  const labelOf = Object.fromEntries(
    impactFocusAreas.map((a) => [a.id, a.galleryLabel]),
  );
  // Only offer a filter when real photos span at least two categories.
  const categories = impactFocusAreas.filter((a) =>
    gallery.some((g) => g.focusAreaId === a.id),
  );
  const visible =
    category === "all"
      ? gallery
      : gallery.filter((g) => g.focusAreaId === category);

  return (
    <section
      id="impact-gallery"
      aria-labelledby="impact-gallery-heading"
      className="scroll-mt-20 bg-mist py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          title={c.title}
          headingId="impact-gallery-heading"
        />

        {categories.length > 1 && (
          <div
            role="group"
            aria-label="Filter photographs by category"
            className="mt-8 flex flex-wrap gap-2"
          >
            {[{ id: "all", galleryLabel: "All" }, ...categories].map((cat) => (
              <button
                key={cat.id}
                type="button"
                aria-pressed={category === cat.id}
                onClick={() => setCategory(cat.id)}
                className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  category === cat.id
                    ? "border-forest bg-forest text-white"
                    : "border-forest/20 bg-white text-ink hover:border-forest/50"
                }`}
              >
                {cat.galleryLabel}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          {visible.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {visible.map((g) => {
                const date = formatDate(g.date);
                const label = labelOf[g.focusAreaId];
                return (
                  <li key={g.id}>
                    <figure className="group">
                      <Photo
                        src={g.src}
                        alt={g.alt}
                        sizes="(min-width: 768px) 33vw, 50vw"
                        className="aspect-4/3 rounded-xl"
                      />
                      {(label || date || g.location || g.caption) && (
                        <figcaption className="mt-2 space-y-0.5 text-sm text-muted">
                          {g.caption && (
                            <span className="block text-ink">{g.caption}</span>
                          )}
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-semibold">
                            {label && (
                              <span className="text-forest">{label}</span>
                            )}
                            {date && (
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays size={12} aria-hidden="true" />
                                {date}
                              </span>
                            )}
                            {g.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={12} aria-hidden="true" />
                                {g.location}
                              </span>
                            )}
                          </span>
                        </figcaption>
                      )}
                    </figure>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon={Camera} title="Photographs coming soon">
              {c.emptyText}
            </EmptyState>
          )}
        </div>
      </Container>
    </section>
  );
}
