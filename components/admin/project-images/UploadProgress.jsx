"use client";

import { LoaderCircle, Upload } from "lucide-react";

export default function UploadProgress({
  count,
  progress,
  uploading,
  onUpload,
  disabled,
}) {
  if (!count) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Upload Images</h3>

          <p className="mt-1 text-sm text-gray-500">
            {count} image(s) ready to upload
          </p>
        </div>

        <button
          type="button"
          onClick={onUpload}
          disabled={disabled || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <Upload size={17} />
          )}

          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {uploading && (
        <div>
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>Uploading images</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
