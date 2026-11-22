"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import FormField from "./FormField";
import PasswordField from "./PasswordField";
import ConfirmationDialog from "./ConfirmationDialog";
import { validateEmailChange } from "@/lib/member/validators";
import { changeMemberEmail } from "@/services/memberSettingsService";

const EMPTY = { newEmail: "", confirmEmail: "", currentPassword: "" };

export default function ChangeEmailForm({ currentEmail, onChanged }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (value) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const found = validateEmailChange(values, currentEmail);
    setErrors(found);
    if (Object.keys(found).length)
      return toast.error("Please correct the highlighted fields.");
    setConfirmOpen(true);
  }

  async function submit() {
    setSubmitting(true);
    try {
      const result = await changeMemberEmail(values);
      setConfirmOpen(false);
      if (result.demo) toast.info(result.message);
      else if (result.verificationRequired)
        toast.success(
          "Check your new inbox. Your email changes once you confirm it.",
        );
      else toast.success("Your email address has been updated.");
      setValues(EMPTY);
      onChanged?.();
    } catch (err) {
      setConfirmOpen(false);
      setErrors(err.errors || {});
      toast.error(err.message || "Could not change your email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Change email address
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          You sign in with your email, so we ask for your password to confirm it
          is you.
        </p>
      </div>
      <FormField
        label="Current email"
        name="currentEmail"
        value={currentEmail}
        editing={false}
      />
      <FormField
        label="New email"
        name="newEmail"
        type="email"
        autoComplete="email"
        required
        value={values.newEmail}
        onChange={set("newEmail")}
        error={errors.newEmail}
      />
      <FormField
        label="Confirm new email"
        name="confirmEmail"
        type="email"
        autoComplete="off"
        required
        value={values.confirmEmail}
        onChange={set("confirmEmail")}
        error={errors.confirmEmail}
      />
      <PasswordField
        label="Current password"
        value={values.currentPassword}
        onChange={set("currentPassword")}
        error={errors.currentPassword}
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-900 disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mail className="h-4 w-4" />
        )}{" "}
        Update email
      </button>
      <ConfirmationDialog
        open={confirmOpen}
        loading={submitting}
        title="Change your email address?"
        description={`Your sign-in email will change from ${currentEmail} to ${values.newEmail.trim()}.`}
        confirmLabel="Change email"
        onConfirm={submit}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
