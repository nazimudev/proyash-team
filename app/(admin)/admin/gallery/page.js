import GalleryPage from "@/components/admin/gallery/GalleryPage";

export const metadata = { title: "Gallery Management | Proyash Admin" };

// SECURITY: this page and every gallery write must be protected by the backend (authenticated administrators only).
// Nothing in the frontend is an authorization check.
export default function AdminGalleryPage() {
  return <GalleryPage />;
}
