import { galleryCategories, galleryImages } from "@/data/gallery";
import { formatDate } from "@/lib/impact";

const hasText = (v) => typeof v === "string" && v.trim().length > 0;

/** Shown only if published, with a file path and real alt text, and a known category. */
export function getPublishedGallery(list = galleryImages) {
  const known = new Set(galleryCategories.map((c) => c.id));
  return list
    .filter(
      (g) =>
        g.isPublished === true &&
        hasText(g.id) &&
        hasText(g.title) &&
        hasText(g.image) &&
        hasText(g.alt) &&
        known.has(g.category),
    )
    .map((g) => ({
      id: g.id,
      title: g.title.trim(),
      category: g.category,
      src: g.image,
      alt: g.alt.trim(),
      caption: hasText(g.caption) ? g.caption.trim() : null,
      date: g.date && formatDate(g.date) ? g.date : null,
      dateLabel: formatDate(g.date),
      location: hasText(g.location) ? g.location.trim() : null,
      isVerified: g.isVerified === true,
    }));
}

/**
 * Single access point for the page. For a Laravel API later, make this async,
 * fetch the same shape, and keep every component unchanged.
 */
export function getGalleryData() {
  return { categories: galleryCategories, images: getPublishedGallery() };
}
