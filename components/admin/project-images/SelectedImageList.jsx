"use client";

import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

export default function SelectedImageList({
  images,
  onRemove,
  disabled = false,
}) {
  if (!images.length) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Selected Images</h3>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {images.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200"
          >
            <div className="aspect-square bg-gray-100">
              <Image
                width={200}
                height={200}
                src={item.preview}
                alt={item.file.name}
                className="h-full w-full object-cover"
              />
            </div>

            {!disabled && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow hover:bg-red-50"
                title="Remove image"
              >
                <X size={16} />
              </button>
            )}

            <div className="flex items-center gap-2 p-2">
              <ImageIcon size={14} className="shrink-0 text-gray-400" />

              <p className="truncate text-xs text-gray-600">{item.file.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
