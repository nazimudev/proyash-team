"use client";
import { useRef } from "react";
import { Camera } from "lucide-react";
import FormField from "./FormField";
import Avatar from "./Avatar";
import {
  BLOOD_GROUPS,
  GENDERS,
  MARITAL_STATUSES,
  RELIGIONS,
} from "@/lib/member/profileOptions";

export default function ProfileForm({
  values,
  errors,
  editing,
  lockedFields = [],
  onChange,
  photoUrl,
  photoError,
  onPhotoSelect,
}) {
  const fileRef = useRef(null);
  const f = (key, props = {}) => ({
    name: key,
    value: values[key],
    error: errors[key],
    editing,
    locked: lockedFields.includes(key),
    onChange: (v) => onChange(key, v),
    ...props,
  });

  return (
    <section
      aria-labelledby="personal-title"
      className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
    >
      <h2 id="personal-title" className="text-base font-bold text-slate-900">
        Personal information
      </h2>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative">
          <Avatar
            name={values.nameEn}
            photoUrl={photoUrl}
            className="h-24 w-24 text-3xl"
          />
          {editing && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-green-800 text-white shadow transition hover:bg-green-900 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              onPhotoSelect(e.target.files?.[0] || null);
              e.target.value = "";
            }}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Profile photo</p>
          <p className="text-xs text-slate-500">
            {editing
              ? "JPG, PNG or WebP, up to 2 MB."
              : "Select “Edit profile” to change your photo."}
          </p>
          {photoError && (
            <p role="alert" className="mt-1 text-xs font-medium text-red-600">
              {photoError}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <FormField
          label="Full name (English)"
          required
          {...f("nameEn")}
          autoComplete="name"
        />
        <FormField
          label="Full name (Bangla)"
          required
          {...f("nameBn")}
          placeholder="বাংলায় নাম লিখুন"
        />
        <FormField label="Father’s name" required {...f("fatherName")} />
        <FormField label="Mother’s name" required {...f("motherName")} />
        <FormField
          label="Date of birth"
          required
          type="date"
          {...f("dateOfBirth")}
        />
        <FormField label="Gender" required options={GENDERS} {...f("gender")} />
        <FormField label="Religion" options={RELIGIONS} {...f("religion")} />
        <FormField label="Nationality" required {...f("nationality")} />
        <FormField label="Occupation" {...f("occupation")} />
        <FormField label="Educational qualification" {...f("education")} />
        <FormField
          label="Blood group"
          options={BLOOD_GROUPS}
          {...f("bloodGroup")}
        />
        <FormField
          label="Marital status"
          options={MARITAL_STATUSES}
          {...f("maritalStatus")}
        />
        <FormField
          label="Mobile number"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="e.g. 01712345678"
          {...f("mobile")}
        />
      </div>
    </section>
  );
}
