"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { FormSection, Grid, Field, ctl, controlCls } from "./MemberFormFields";
import {
  RELIGIONS,
  GENDERS,
  MARITAL_STATUSES,
  BLOOD_GROUPS,
} from "@/data/memberOptions";
import { PHOTO_MAX_BYTES } from "@/lib/memberFormUtils";
import Image from "next/image";

const btn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600";

export default function MemberPersonalInfoSection({
  values,
  errors,
  onChange,
}) {
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const file = values.photoFile;

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
  const text = (name, label, extra = {}) => (
    <Field
      name={name}
      label={label}
      required={!extra.optional}
      error={errors[name]}
      hint={extra.hint}
    >
      <input
        {...ctl(name, errors)}
        value={values[name]}
        onChange={set(name)}
        {...(extra.input ?? {})}
        className={controlCls}
      />
    </Field>
  );
  const select = (name, label, options, optional, placeholder) => (
    <Field
      name={name}
      label={label}
      required={!optional}
      error={errors[name]}
      hint={optional ? "Optional." : undefined}
    >
      <select
        {...ctl(name, errors)}
        value={values[name]}
        onChange={set(name)}
        className={controlCls}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <FormSection
      title="Personal Information"
      description="Enter the member's details exactly as verified."
    >
      <Grid>
        {text("full_name_bn", "Full name (Bangla)", {
          input: { lang: "bn", autoComplete: "off" },
        })}
        {text("full_name_en", "Full name (English)", {
          input: { autoComplete: "off" },
        })}
        {text("father_name", "Father's name")}
        {text("mother_name", "Mother's name")}
        <Field
          name="date_of_birth"
          label="Date of birth"
          required
          error={errors.date_of_birth}
        >
          <input
            {...ctl("date_of_birth", errors)}
            type="date"
            value={values.date_of_birth}
            onChange={set("date_of_birth")}
            className={controlCls}
          />
        </Field>
        {text("nationality", "Nationality")}
        {select("religion", "Religion", RELIGIONS, true, "Select (optional)")}
        {select("gender", "Gender", GENDERS, true, "Select (optional)")}
        {select(
          "marital_status",
          "Marital status",
          MARITAL_STATUSES,
          false,
          "Select marital status",
        )}
        {text("occupation", "Occupation")}
        {text("educational_qualification", "Educational qualification")}
        {select(
          "blood_group",
          "Blood group",
          BLOOD_GROUPS,
          true,
          "Select (optional)",
        )}
        {text("mobile_number", "Mobile number", {
          hint: "For example, 01XXXXXXXXX.",
          input: { type: "tel", inputMode: "tel" },
        })}
        {text("email", "Email address", {
          hint: "Used for the member's account. It must not already belong to another member.",
          input: { type: "email", inputMode: "email", autoComplete: "off" },
        })}

        <Field
          name="profile_photo"
          label="Profile photo"
          wide
          error={errors.profile_photo}
          hint={`Optional. JPG, PNG, or WebP up to ${PHOTO_MAX_BYTES / 1024 / 1024} MB. It's sent with the form; the backend stores it and sets the photo path.`}
        >
          <input
            {...ctl("profile_photo", errors)}
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={(e) => {
              onChange("photoFile", e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
          {file ? (
            <div className="flex flex-wrap items-center gap-4">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Selected profile photo preview"
                  className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                />
              ) : null}
              <div className="space-y-2">
                <p className="text-sm text-gray-700">{file.name}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={btn}
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("photoFile", null)}
                    className={btn}
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
              className={btn}
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" /> Choose photo
            </button>
          )}
        </Field>
      </Grid>
    </FormSection>
  );
}
