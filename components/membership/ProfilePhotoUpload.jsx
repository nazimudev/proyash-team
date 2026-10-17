"use client";

import { useRef } from "react";
import { UserRound, Upload, Trash2 } from "lucide-react";
import { membershipConfig } from "@/data/membershipConfig";

/**
 * Optional profile photo. Validation runs at selection (type + size). The file is only held in memory for
 * preview; it is sent with the application on submit and is NOT uploaded anywhere before that.
 */
export default function ProfilePhotoUpload({ photo, error, onSelect, onRemove }) {
  const input = useRef(null);
  const { labels, maxBytes } = membershipConfig.photo;

  return (
    <div>
      <p id="profile_photo-label" className="text-sm font-bold text-ink">Profile photo <span className="font-semibold text-muted">(optional)</span></p>
      <div className="mt-3 flex flex-wrap items-center gap-5">
        <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl border border-forest/15 bg-mist">
          {photo.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not optimizable
            <img src={photo.url} alt="Preview of your selected profile photo" className="size-full object-cover" />
          ) : (
            <UserRound size={44} strokeWidth={1.25} aria-label="No photo selected" className="text-forest/40" role="img" />
          )}
        </div>
        <div>
          <input
            ref={input}
            id="profile_photo"
            type="file"
            accept={membershipConfig.photo.types.join(",")}
            aria-labelledby="profile_photo-label"
            aria-describedby={error ? "profile_photo-error profile_photo-hint" : "profile_photo-hint"}
            aria-invalid={error ? "true" : undefined}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onSelect(file);
              e.target.value = "";
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-forest/30 px-4 text-sm font-semibold text-forest hover:bg-forest/5">
              <Upload size={16} aria-hidden="true" />
              {photo.file ? "Replace photo" : "Choose photo"}
            </button>
            {photo.file && (
              <button type="button" onClick={onRemove} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-forest/20 px-4 text-sm font-semibold text-ink hover:bg-mist">
                <Trash2 size={16} aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
          <p id="profile_photo-hint" className="mt-2 text-sm text-muted">
            {labels}, up to {Math.round(maxBytes / 1024 / 1024)} MB.{" "}
            {photo.file ? `Selected: ${photo.file.name}. It will be sent when you submit your application.` : "Your photo is only sent when you submit your application."}
          </p>
          {error && <p id="profile_photo-error" className="mt-1.5 text-sm font-semibold text-[#b42318]">{error}</p>}
        </div>
      </div>
    </div>
  );
}
