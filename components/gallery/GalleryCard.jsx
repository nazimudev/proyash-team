import Photo from "@/components/ui/Photo";

/** One thumbnail. A real <button> so it is keyboard-operable and focus can return to it. */
export default function GalleryCard({ image, categoryLabel, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View larger photo: ${image.title}`}
      className="group block w-full overflow-hidden rounded-2xl border border-forest/10 bg-white text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-deep/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative">
        <Photo
          src={image.src}
          alt={image.alt}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="aspect-4/3"
        />
        {!image.isVerified && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm">
            Illustrative image
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-bold text-forest">{categoryLabel}</p>
        <h3 className="mt-1 font-extrabold leading-snug text-ink">{image.title}</h3>
      </div>
    </button>
  );
}
