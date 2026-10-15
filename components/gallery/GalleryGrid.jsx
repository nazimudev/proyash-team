import { Camera } from "lucide-react";
import GalleryCard from "@/components/gallery/GalleryCard";

function Empty({ title, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest">
        <Camera size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted">{children}</p>
    </div>
  );
}

export default function GalleryGrid({ images, totalCount, labelOf, onOpen, status = "ready" }) {
  if (status === "loading") {
    return (
      <ul aria-busy="true" aria-label="Loading photos" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
            <div className="aspect-4/3 animate-pulse bg-mist motion-reduce:animate-none" />
            <div className="space-y-2 p-5">
              <div className="h-3 w-1/3 rounded bg-mist" />
              <div className="h-4 w-2/3 rounded bg-mist" />
            </div>
          </li>
        ))}
      </ul>
    );
  }
  if (status === "error") {
    return (
      <div role="alert" className="rounded-2xl border border-forest/15 bg-white px-6 py-12 text-center">
        <h3 className="text-lg font-extrabold text-ink">We couldn’t load the gallery</h3>
        <p className="mt-2 text-muted">Please refresh the page or try again a little later.</p>
      </div>
    );
  }
  if (totalCount === 0) {
    return <Empty title="Gallery coming soon">Gallery photos will be available soon.</Empty>;
  }
  if (images.length === 0) {
    return <Empty title="Nothing here yet">No photos are available in this category yet.</Empty>;
  }
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <li key={image.id}>
          <GalleryCard image={image} categoryLabel={labelOf[image.category]} onOpen={(el) => onOpen(index, el)} />
        </li>
      ))}
    </ul>
  );
}
