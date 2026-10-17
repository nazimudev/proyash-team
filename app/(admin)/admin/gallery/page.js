import PageHeader from "@/components/admin/ui/PageHeader";
import EmptyState from "@/components/admin/ui/EmptyState";

export const metadata = { title: "Gallery Management | Proyash Admin" };

export default function GalleryPage() {
  return (
    <>
      <PageHeader title="Gallery Management" description="Organize photos and albums shown on the website." />
      <EmptyState title="Gallery management is not built yet" description="Albums and photos will appear here once the API is connected." />
    </>
  );
}
