/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Wallet,
  Save,
  Pencil,
  Loader2,
  Camera,
} from "lucide-react";

import ModalShell, { btnPrimary, btnSecondary, btnDanger } from "./ModalShell";

import { Avatar, StatusBadge } from "./RequestsTable";

import {
  formatDate,
  formatBdt,
  MEMBERSHIP_FEE_BDT,
} from "@/lib/memberRequestUtils";

import { getAgreementDate } from "@/utils/agrementsUtils";
import { updateMemberApplication } from "@/services/memberRequestService";
import Image from "next/image";

function Item({ label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">
        {children || <span className="text-gray-400">Not provided</span>}
      </dd>
    </div>
  );
}

const Section = ({ title, children }) => (
  <section>
    <h3 className="mb-3 border-b border-gray-100 pb-1 text-sm font-semibold text-gray-900">
      {title}
    </h3>

    <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
  </section>
);

function FeePanel({ status }) {
  const copy = {
    pending:
      "Not payable yet. The applicant becomes eligible to pay the fee only after approval.",

    approved:
      "Awaiting membership fee. Payment is verified through the separate payment workflow.",

    rejected: "Not applicable. This application was rejected.",

    suspended: "Membership is currently suspended.",
  }[status];

  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />

      <div className="text-sm text-gray-700">
        <p className="font-medium text-gray-900">
          Membership fee: {formatBdt(MEMBERSHIP_FEE_BDT)}
        </p>

        <p className="mt-0.5">{copy}</p>
      </div>
    </div>
  );
}

function AddressSection({ addresses = [] }) {
  return (
    <>
      {["permanent", "present"].map((type) => {
        const address = addresses.find((item) => item.type === type);

        if (!address) return null;

        return (
          <Section
            key={type}
            title={
              type === "permanent" ? "Permanent Address" : "Present Address"
            }
          >
            <Item label="Village">{address.village}</Item>
            <Item label="Post office">{address.post_office}</Item>
            <Item label="Upazila">{address.upazila}</Item>
            <Item label="District">{address.district}</Item>
          </Section>
        );
      })}
    </>
  );
}

/* -------------------------------------------------
   VIEW FORM
------------------------------------------------- */

function ViewApplicationForm({ application: a }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar app={a} size="h-16 w-16" />

        <div className="min-w-0">
          <p className="text-base font-semibold text-gray-900">
            {a.user?.name}
          </p>

          <p className="text-sm text-gray-600" lang="bn">
            {a.full_name_bn}
          </p>

          <div className="mt-1">
            <StatusBadge status={a.status} />
          </div>
        </div>
      </div>

      <Section title="Personal Information">
        <Item label="Full name (Bangla)">
          <span lang="bn">{a.full_name_bn}</span>
        </Item>

        <Item label="Full name (English)">{a.user?.name}</Item>

        <Item label="Father's name">{a.father_name}</Item>

        <Item label="Mother's name">{a.mother_name}</Item>

        <Item label="Date of birth">{formatDate(a.date_of_birth)}</Item>

        <Item label="Nationality">{a.nationality}</Item>
        <Item label="Religion">{a.religion}</Item>
        <Item label="Gender">{a.gender}</Item>
        <Item label="Marital status">{a.marital_status}</Item>
        <Item label="Occupation">{a.occupation}</Item>

        <Item label="Educational qualification">
          {a.educational_qualification}
        </Item>

        <Item label="Blood group">{a.blood_group}</Item>
        <Item label="Mobile number">{a.mobile_number}</Item>
        <Item label="Email">{a.user?.email}</Item>

        <Item label="Profile photo">
          {a.profile_photo_url || a.photo ? "Uploaded" : "Not uploaded"}
        </Item>
      </Section>

      <AddressSection addresses={a.addresses} />

      <Section title="Application Information">
        <Item label="Application ID">{a.id}</Item>
        <Item label="Submitted">{formatDate(a.created_at)}</Item>

        <Item label="Current status">
          <StatusBadge status={a.status} />
        </Item>

        <Item label="Membership agreement">
          {getAgreementDate(a.agreements, "membership_conditions")}
        </Item>

        <Item label="Applicant declaration">
          {getAgreementDate(a.agreements, "applicant_declaration")}
        </Item>

        <Item label="Privacy policy">
          {getAgreementDate(a.agreements, "privacy_policy")}
        </Item>

        <Item label="Terms of service">
          {getAgreementDate(a.agreements, "terms_of_service")}
        </Item>

        {a.reviewed_at && (
          <>
            <Item label="Reviewed by">
              {a.reviewed_by_name ?? "Administrator"}
            </Item>

            <Item label="Reviewed on">{formatDate(a.reviewed_at)}</Item>
          </>
        )}

        {a.status === "rejected" && (
          <Item label="Rejection reason (administrators only)" wide>
            {a.rejection_reason}
          </Item>
        )}
      </Section>

      <FeePanel status={a.status} />
    </div>
  );
}

/* -------------------------------------------------
   FORM COMPONENTS
------------------------------------------------- */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  options,
  required = false,
}) {
  const className =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}

      {options ? (
        <select
          name={name}
          value={value ?? ""}
          onChange={onChange}
          className={className}
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          className={className}
        />
      )}
    </label>
  );
}

function AddressFields({ title, address, onChange, type }) {
  const fields = [
    ["village", "Village"],
    ["post_office", "Post office"],
    ["upazila", "Upazila"],
    ["district", "District"],
  ];

  return (
    <section>
      <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([name, label]) => (
          <Field
            key={name}
            label={label}
            name={name}
            value={address[name]}
            onChange={(e) => onChange(type, name, e.target.value)}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------
   EDIT FORM
------------------------------------------------- */

function EditApplicationForm({ application: a, onClose, onSaved }) {
  const [form, setForm] = useState({});
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const permanent = a.addresses?.find((item) => item.type === "permanent");

    const present = a.addresses?.find((item) => item.type === "present");

    setForm({
      full_name_en: a.user?.name ?? "",
      email: a.user?.email ?? "",
      full_name_bn: a.full_name_bn ?? "",
      father_name: a.father_name ?? "",
      mother_name: a.mother_name ?? "",
      date_of_birth: a.date_of_birth
        ? String(a.date_of_birth).slice(0, 10)
        : "",
      nationality: a.nationality ?? "",
      religion: a.religion ?? "",
      gender: a.gender ?? "",
      marital_status: a.marital_status ?? "",
      occupation: a.occupation ?? "",
      educational_qualification: a.educational_qualification ?? "",
      blood_group: a.blood_group ?? "",
      mobile_number: a.mobile_number ?? "",

      addresses: {
        permanent: {
          village: permanent?.village ?? "",
          post_office: permanent?.post_office ?? "",
          upazila: permanent?.upazila ?? "",
          district: permanent?.district ?? "",
        },

        present: {
          village: present?.village ?? "",
          post_office: present?.post_office ?? "",
          upazila: present?.upazila ?? "",
          district: present?.district ?? "",
        },
      },
    });

    setPhoto(null);
    setPhotoPreview("");
    setError("");
  }, [a]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddressChange(type, name, value) {
    setForm((prev) => ({
      ...prev,
      addresses: {
        ...prev.addresses,
        [type]: {
          ...prev.addresses[type],
          [name]: value,
        },
      },
    }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2 MB.");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        profile_photo: photo || undefined,
      };

      await updateMemberApplication(a.id, payload);

      await onSaved(a.id);
    } catch (err) {
      setError(err.message || "Failed to update member.");
    } finally {
      setSaving(false);
    }
  }

  const currentPhoto = photoPreview || a.profile_photo_url || a.photo || "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile photo */}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Profile Photo
        </h3>

        <div className="flex items-center gap-4">
          {currentPhoto ? (
            <Image
              src={currentPhoto}
              alt="Member profile"
              width={200}
              height={200}
              className="h-16 w-16 rounded-full border border-gray-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Camera className="h-6 w-6" />
            </div>
          )}

          <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change Photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          JPG, PNG or WEBP. Maximum 2 MB.
        </p>
      </section>

      {/* Personal information */}

      <section>
        <h3 className="mb-3 border-b border-gray-100 pb-2 text-sm font-semibold text-gray-900">
          Personal Information
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Full name (English)"
            name="full_name_en"
            value={form.full_name_en}
            onChange={handleChange}
            required
          />

          <Field
            label="Full name (Bangla)"
            name="full_name_bn"
            value={form.full_name_bn}
            onChange={handleChange}
          />

          <Field
            label="Father's name"
            name="father_name"
            value={form.father_name}
            onChange={handleChange}
          />

          <Field
            label="Mother's name"
            name="mother_name"
            value={form.mother_name}
            onChange={handleChange}
          />

          <Field
            label="Date of birth"
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
          />

          <Field
            label="Nationality"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
          />

          <Field
            label="Religion"
            name="religion"
            value={form.religion}
            onChange={handleChange}
          />

          <Field
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />

          <Field
            label="Marital status"
            name="marital_status"
            value={form.marital_status}
            onChange={handleChange}
            options={["Single", "Married", "Divorced", "Widowed"]}
          />

          <Field
            label="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
          />

          <Field
            label="Educational qualification"
            name="educational_qualification"
            value={form.educational_qualification}
            onChange={handleChange}
          />

          <Field
            label="Blood group"
            name="blood_group"
            value={form.blood_group}
            onChange={handleChange}
            options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
          />

          <Field
            label="Mobile number"
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </section>

      {/* Addresses */}

      <AddressFields
        title="Permanent Address"
        type="permanent"
        address={form.addresses?.permanent ?? {}}
        onChange={handleAddressChange}
      />

      <AddressFields
        title="Present Address"
        type="present"
        address={form.addresses?.present ?? {}}
        onChange={handleAddressChange}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Footer */}

      <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className={btnSecondary}
        >
          Cancel
        </button>

        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------
   MAIN DIALOG
------------------------------------------------- */

export default function ApplicationDetailDialog({
  application: a,
  mode,
  onClose,
  onSwitchToReview,
  onDecide,
  onSaved,
}) {
  const pending = a?.status === "pending";

  const isEdit = mode === "edit";
  const isReview = mode === "review";

  const footer =
    !a || isEdit ? null : isReview && pending ? (
      <>
        <button type="button" onClick={onClose} className={btnSecondary}>
          Close
        </button>

        <button
          type="button"
          onClick={() => onDecide("reject", a)}
          className={btnDanger}
        >
          <XCircle className="h-4 w-4" />
          Reject Application
        </button>

        <button
          type="button"
          onClick={() => onDecide("approve", a)}
          className={btnPrimary}
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve Application
        </button>
      </>
    ) : (
      <>
        <button type="button" onClick={onClose} className={btnSecondary}>
          Close
        </button>

        {pending && (
          <button
            type="button"
            onClick={onSwitchToReview}
            className={btnPrimary}
          >
            Review Request
          </button>
        )}
      </>
    );

  return (
    <ModalShell
      open={!!a}
      onClose={onClose}
      size="xl"
      footer={footer}
      title={
        isEdit
          ? "Edit Member Information"
          : isReview
            ? "Review Request"
            : "Application Details"
      }
      description={a ? `${a.user?.name ?? a.full_name_en ?? ""} · ${a.id}` : ""}
    >
      {a &&
        (isEdit ? (
          <EditApplicationForm
            key={a.id}
            application={a}
            onClose={onClose}
            onSaved={onSaved}
          />
        ) : (
          <ViewApplicationForm application={a} />
        ))}
    </ModalShell>
  );
}
