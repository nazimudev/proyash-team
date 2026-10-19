import GalleryImageCard from "./GalleryImageCard";

export default function GalleryGrid({ photos, view, onAction }) {
  return (
    <ul className={view === "list" ? "space-y-2" : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"}>
      {photos.map((p) => <GalleryImageCard key={p.id} photo={p} view={view} onAction={onAction} />)}
    </ul>
  );
}
