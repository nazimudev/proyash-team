"use client";

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";

export default function ImageDropzone({ onFilesSelected }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function handleFiles(fileList) {
    setError("");

    const files = Array.from(fileList || []);
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        errors.push(`${file.name}: Unsupported image format.`);
      } else if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: Maximum file size is 5 MB.`);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length) {
      onFilesSelected(validFiles);
    }

    if (errors.length) {
      setError(errors.join(" "));
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-green-600 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-green-500 hover:bg-green-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <UploadCloud size={28} />
        </div>

        <h3 className="font-semibold text-gray-800">Drop your images here</h3>

        <p className="mt-1 text-sm text-gray-500">
          Or click to browse your device
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ImagePlus size={15} />
          JPG, PNG, WEBP · Maximum 5 MB per image
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
