/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// src/components/admin/AdvisorFormModal.jsx
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createAdvisor, updateAdvisor } from "@/lib/advisorsApi";

const EMPTY = { name: "", designation: "", address: "", phone: "" };
const MAX_SIZE = 2 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function AdvisorFormModal({ open, advisor, onClose, onSaved }) {
  const isEdit = Boolean(advisor);
  const fileRef = useRef(null);

  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset whenever the modal opens or the advisor changes.
  useEffect(() => {
    if (!open) return;
    setForm(
      advisor
        ? {
            name: advisor.name || "",
            designation: advisor.designation || "",
            address: advisor.address || "",
            phone: advisor.phone || "",
          }
        : EMPTY,
    );
    setFile(null);
    setPreview(null);
    setRemoveImage(false);
    setErrors({});
  }, [open, advisor]);

  // Revoke object URLs to avoid leaks.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  if (!open) return null;

  const currentImage = preview || (!removeImage && advisor?.image_url) || null;

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function onPickFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!TYPES.includes(picked.type)) {
      setErrors((x) => ({ ...x, image: "Choose a JPG, PNG or WebP image." }));
      return;
    }
    if (picked.size > MAX_SIZE) {
      setErrors((x) => ({ ...x, image: "The image must be 2 MB or smaller." }));
      return;
    }
    setErrors((x) => ({ ...x, image: undefined }));
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
    setRemoveImage(false);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter the advisor’s name.";
    if (!form.designation.trim()) next.designation = "Enter the designation.";
    if (form.phone && !/^[0-9+\-\s()]+$/.test(form.phone))
      next.phone = "Use digits, spaces, +, - and parentheses only.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("designation", form.designation.trim());
    fd.append("address", form.address.trim());
    fd.append("phone", form.phone.trim());
    if (file) fd.append("image", file);
    if (isEdit && removeImage && !file) fd.append("remove_image", "1");

    setSaving(true);
    try {
      const res = isEdit
        ? await updateAdvisor(advisor.id, fd)
        : await createAdvisor(fd);
      toast.success(
        res.message || (isEdit ? "Advisor updated." : "Advisor added."),
      );
      onSaved();
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length) {
        setErrors(
          Object.fromEntries(
            Object.entries(err.errors).map(([k, v]) => [k, v[0]]),
          ),
        );
      }
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = (key) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
      errors[key] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit advisor" : "Add advisor"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="mb-1 block text-sm font-medium">
              Profile photo
            </span>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-20 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
                {currentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentImage}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onPickFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  {currentImage ? "Replace photo" : "Choose photo"}
                </button>
                {isEdit && advisor.image_url && !file && !removeImage && (
                  <button
                    type="button"
                    onClick={() => setRemoveImage(true)}
                    className="block text-xs text-red-600 hover:underline"
                  >
                    Remove current photo
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  JPG, PNG or WebP, up to 2 MB.
                </p>
              </div>
            </div>
            {errors.image && (
              <p className="mt-1 text-xs text-red-600">{errors.image}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="adv-name"
              className="mb-1 block text-sm font-medium"
            >
              Name *
            </label>
            <input
              id="adv-name"
              value={form.name}
              onChange={setField("name")}
              className={inputCls("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="adv-designation"
              className="mb-1 block text-sm font-medium"
            >
              Designation (পদবি) *
            </label>
            <input
              id="adv-designation"
              value={form.designation}
              onChange={setField("designation")}
              className={inputCls("designation")}
            />
            {errors.designation && (
              <p className="mt-1 text-xs text-red-600">{errors.designation}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="adv-address"
              className="mb-1 block text-sm font-medium"
            >
              Address
            </label>
            <textarea
              id="adv-address"
              rows={2}
              value={form.address}
              onChange={setField("address")}
              className={inputCls("address")}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="adv-phone"
              className="mb-1 block text-sm font-medium"
            >
              Phone number
            </label>
            <input
              id="adv-phone"
              type="tel"
              value={form.phone}
              onChange={setField("phone")}
              className={inputCls("phone")}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Add advisor"}
          </button>
        </div>
      </form>
    </div>
  );
}
