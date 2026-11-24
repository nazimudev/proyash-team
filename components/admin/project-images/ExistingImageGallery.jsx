"use client";

import { ImageIcon, Star, Trash2, LoaderCircle } from "lucide-react";
import Image from "next/image";

export default function ExistingImageGallery({
  images,
  loading,
  error,
  onDelete,
  onFeatured,
  actionLoading,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-12">
        <LoaderCircle className="animate-spin text-green-700" size={25} />
        <span className="ml-3 text-sm text-gray-500">
          Loading project images...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
        <ImageIcon className="mx-auto text-gray-300" size={42} />

        <h3 className="mt-3 font-semibold text-gray-800">No images found</h3>

        <p className="mt-1 text-sm text-gray-500">
          Upload images to see them here.
        </p>
      </div>
    );
  }

  const storageUrl = (process.env.NEXT_PUBLIC_API_URL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/+$/, "");

  function getImageUrl(image) {
    if (image.image_url || image.url) {
      return image.image_url || image.url;
    }

    if (image.image_path) {
      return `${storageUrl}/storage/${image.image_path.replace(/^\/+/, "")}`;
    }

    return "/images/project-placeholder.jpg";
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => {
        const busy = actionLoading === image.id;

        return (
          <div
            key={image.id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <div className="relative aspect-square bg-gray-100">
              <Image
                width={200}
                height={200}
                src={getImageUrl(image)}
                alt={image.alt_text || image.title || "Project image"}
                className="h-full w-full object-cover"
                loading="lazy"
              />

              {image.is_featured && (
                <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-gray-900">
                  Featured
                </span>
              )}
            </div>

            <div className="p-3">
              <p className="truncate text-sm font-medium text-gray-800">
                {image.title || "Project image"}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={busy || image.is_featured}
                  onClick={() => onFeatured(image.id)}
                  title="Set as featured"
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                >
                  <Star size={14} />
                  Featured
                </button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onDelete(image.id)}
                  title="Delete image"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {busy ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
