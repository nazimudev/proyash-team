/**
 * GALLERY DATA — add, edit, categorize or remove photos here.
 *
 * No real photographs existed in the project when this page was built, so
 * `galleryImages` holds only ONE unpublished example record. The page therefore
 * shows "Gallery photos will be available soon." until you publish real photos.
 *
 * HOW TO ADD A PHOTO
 *  1. Put the file in /public/images/gallery/ (landscape ~1600px wide works best).
 *  2. Append a record below. Required: id (unique, stable), title, category,
 *     image (path), alt (accurate description of the actual photo).
 *     Optional: date ("YYYY-MM-DD"), location, caption — include them ONLY if verified;
 *     empty/null values are never shown.
 *  3. Set isPublished: true. Set isVerified: true only when the photo is a genuine
 *     Proyash activity photo. Published photos with isVerified !== true are shown with
 *     an "Illustrative image" label so they can never pass as evidence of real activity.
 *
 * category must be one of the ids in `galleryCategories` (except "all").
 * Shaped to match a future Laravel API response (admin-managed images, categories,
 * captions, publication status and activity dates).
 */

export const galleryCategories = [
  { id: "all", label: "All Photos" },
  { id: "community", label: "Community Support" },
  { id: "education", label: "Educational Support" },
  { id: "environment", label: "Tree Plantation" },
  { id: "events", label: "Events & Activities" },
];

export const galleryImages = [
  // Example record (UNPUBLISHED, file does not exist). Copy this shape for real photos.
  {
    id: "example-1",
    title: "Community Activity",
    category: "community",
    image: "/images/gallery/replace-with-real-image.jpg",
    alt: "Replace with an accurate description of the actual photograph",
    caption: null,
    date: null,
    location: null,
    isVerified: false,
    isPublished: false,
  },
];
