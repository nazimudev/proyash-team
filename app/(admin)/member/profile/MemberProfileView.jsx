/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Save } from "lucide-react";

import { updateMemberProfile } from "@/services/memberProfileService";
import { useMember } from "@/components/member/MemberProvider";

import PageHeader from "@/components/member/PageHeader";
import ProfileForm from "@/components/member/ProfileForm";
import AddressForm from "@/components/member/AddressForm";
import ConfirmationDialog from "@/components/member/ConfirmationDialog";
import ErrorState from "@/components/member/ErrorState";
import { SkeletonBlock } from "@/components/member/LoadingSkeleton";

import { validatePhoto, validateProfile } from "@/lib/member/validators";

const clone = (value) => JSON.parse(JSON.stringify(value));

export default function MemberProfileView() {
  const { member: data, loading, error, refresh: refreshMember } = useMember();

  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoError, setPhotoError] = useState(null);

  const [confirmCancel, setConfirmCancel] = useState(false);

  // Initialize and synchronize form values with shared account data.
  useEffect(() => {
    if (data && !editing) {
      setValues(clone(data));
    }
  }, [data, editing]);

  // Cleanup temporary photo preview URL.
  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const dirty =
    !!values &&
    !!data &&
    (JSON.stringify(values) !== JSON.stringify(data) || !!photoFile);

  const setField = (key, value) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const setAddress = (group, key, value) => {
    setValues((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value,
      },
    }));

    setErrors((current) => ({
      ...current,
      [`${group}.${key}`]: undefined,
    }));
  };

  const copyPermanent = () => {
    setValues((current) => ({
      ...current,
      present: { ...current.permanent },
    }));

    toast.info("Present address copied from permanent address.");
  };

  function selectPhoto(file) {
    if (!file) return;

    const problem = validatePhoto(file);

    setPhotoError(problem);

    if (problem) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function resetEdit() {
    setEditing(false);
    setErrors({});
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
    setConfirmCancel(false);

    if (data) {
      setValues(clone(data));
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    if (saving) return;

    const found = validateProfile(values);

    setErrors(found);

    if (Object.keys(found).length) {
      toast.error("Please correct the highlighted fields.");

      document.querySelector('[aria-invalid="true"]')?.focus();

      return;
    }

    setSaving(true);

    try {
      await updateMemberProfile(values, { photoFile });

      // Refresh the shared account cache after successful update.
      const updatedAccount = await refreshMember();

      // Synchronize local form with refreshed account data.
      if (updatedAccount) {
        setValues(clone(updatedAccount));
      }

      setEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoError(null);
      setErrors({});

      toast.success("Your profile has been saved.");
    } catch (err) {
      setErrors(err.errors || {});

      if (err.errors?.photo) {
        setPhotoError(err.errors.photo);
      }

      toast.error(err.message || "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <>
        <PageHeader title="My profile" />

        <ErrorState error={error} onRetry={refreshMember} />
      </>
    );
  }

  if ((loading && !data) || !values) {
    return (
      <>
        <PageHeader title="My profile" />

        <div className="space-y-6">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-64" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="My profile"
        description="Keep your personal details up to date. Some official details can only be changed by the office."
        actions={
          !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-900"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          )
        }
      />

      <form
        onSubmit={handleSave}
        noValidate
        className="space-y-6"
        aria-busy={saving}
      >
        <ProfileForm
          values={values}
          errors={errors}
          editing={editing}
          lockedFields={data.lockedFields}
          onChange={setField}
          photoUrl={photoPreview || values.photoUrl}
          photoError={photoError}
          onPhotoSelect={selectPhoto}
        />

        <AddressForm
          values={values}
          errors={errors}
          editing={editing}
          onChange={setAddress}
          onCopyPermanent={copyPermanent}
        />

        {editing && (
          <div className="sticky bottom-4 z-10 flex flex-col-reverse gap-2 rounded-2xl border border-green-100 bg-white/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-end">
            {dirty && (
              <p className="mr-auto px-2 text-sm font-semibold text-slate-500">
                You have unsaved changes
              </p>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => (dirty ? setConfirmCancel(true) : resetEdit())}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !dirty}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-900 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </form>

      <ConfirmationDialog
        open={confirmCancel}
        title="Discard your changes?"
        description="The edits you made to your profile will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        tone="danger"
        onConfirm={resetEdit}
        onCancel={() => setConfirmCancel(false)}
      />
    </>
  );
}
