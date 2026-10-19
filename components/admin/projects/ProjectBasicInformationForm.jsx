/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { btnSecondary } from "@/components/admin/donation/Modal";
import { FormSection, Field, ctl, controlCls } from "./ProjectFormFields";
import { PROJECT_FORM_CATEGORIES } from "@/data/projectOptions";
import { LIMITS, COVER_MAX_BYTES } from "@/lib/projectFormUtils";
import Image from "next/image";

export default function ProjectBasicInformationForm({
  values,
  errors,
  onChange,
  previewCode,
}) {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const file = values.coverFile;

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file); // client-only; revoked when the file changes or the form unmounts
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const set = (k) => (e) => onChange(k, e.target.value);
  const pick = (e) => {
    onChange("coverFile", e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  return (
    <FormSection
      title="Basic Information"
      description="The core details that identify this project."
    >
      <Field name="name" label="Project name" required error={errors.name} wide>
        <input
          {...ctl("name", errors)}
          value={values.name}
          onChange={set("name")}
          maxLength={LIMITS.name[1] + 20}
          className={controlCls}
        />
      </Field>
      <Field
        name="code"
        label="Project ID"
        hint="Preview only. The final unique ID is assigned by the system when the project is saved."
      >
        <input
          id="pf-code"
          value={previewCode}
          readOnly
          aria-readonly="true"
          className={`${controlCls} bg-gray-50 text-gray-500`}
        />
      </Field>
      <Field
        name="category"
        label="Project category"
        required
        error={errors.category}
      >
        <select
          {...ctl("category", errors)}
          value={values.category}
          onChange={set("category")}
          className={controlCls}
        >
          <option value="">Select a category</option>
          {PROJECT_FORM_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field
        name="description"
        label="Project description"
        required
        wide
        error={errors.description}
        hint={`${values.description.length} / ${LIMITS.description}. Explain the purpose, objectives, and planned activities.`}
      >
        <textarea
          {...ctl("description", errors)}
          rows={5}
          value={values.description}
          onChange={set("description")}
          className={controlCls}
        />
      </Field>
      <Field
        name="cover"
        label="Cover image"
        wide
        error={errors.cover}
        hint={`Optional. JPG, PNG, or WebP up to ${COVER_MAX_BYTES / 1024 / 1024} MB. Prototype only: the image is previewed here but not uploaded or stored.`}
      >
        <input
          {...ctl("cover", errors)}
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={pick}
          className="sr-only"
        />
        {file ? (
          <div className="flex flex-wrap items-center gap-4">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Selected cover preview"
                className="h-28 w-44 rounded-lg border border-gray-200 object-cover"
              />
            ) : null}
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{file.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={btnSecondary}
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange("coverFile", null)}
                  className={btnSecondary}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={btnSecondary}
          >
            <ImagePlus className="h-4 w-4" aria-hidden="true" /> Choose image
          </button>
        )}
      </Field>
    </FormSection>
  );
}
