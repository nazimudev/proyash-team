'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, Circle, KeyRound, Loader2 } from 'lucide-react';
import PasswordField from './PasswordField';
import ConfirmationDialog from './ConfirmationDialog';
import { passwordChecks, passwordStrength, validatePasswordChange } from '../../lib/member/validators';
import { changeMemberPassword } from '../../services/memberSettingsService';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };
const BAR = ['bg-slate-200', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-600'];

export default function ChangePasswordForm() {
  // Passwords live only in component state: never in localStorage, logs, or URLs.
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const strength = passwordStrength(values.newPassword);

  const set = (key) => (value) => { setValues((v) => ({ ...v, [key]: value })); setErrors((e) => ({ ...e, [key]: undefined })); };

  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    const found = validatePasswordChange(values);
    setErrors(found);
    if (Object.keys(found).length) return toast.error('Please correct the highlighted fields.');
    setConfirmOpen(true);
  }

  async function submit() {
    setSubmitting(true);
    try {
      const result = await changeMemberPassword(values);
      setConfirmOpen(false);
      if (result.demo) toast.info(result.message);
      else toast.success('Your password has been changed.');
      setValues(EMPTY);
    } catch (err) {
      setConfirmOpen(false);
      setErrors(err.errors || {});
      toast.error(err.message || 'Could not change your password.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div><h2 className="text-base font-bold text-slate-900">Change password</h2><p className="mt-1 text-sm text-slate-500">Choose a password you do not use anywhere else.</p></div>
      <PasswordField label="Current password" value={values.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} autoComplete="current-password" />
      <div>
        <PasswordField label="New password" value={values.newPassword} onChange={set('newPassword')} error={errors.newPassword} autoComplete="new-password" />
        <div className="mt-3" aria-live="polite">
          <div className="flex gap-1.5" aria-hidden="true">{[1, 2, 3, 4].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${strength.score >= i ? BAR[strength.score] : 'bg-slate-200'}`} />)}</div>
          <p className="mt-1.5 text-xs font-semibold text-slate-600">{strength.label ? `Strength: ${strength.label}` : 'Strength appears as you type'}</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {passwordChecks(values.newPassword).map((c) => (
              <li key={c.id} className={`flex items-center gap-1.5 text-xs ${c.ok ? 'text-green-800' : 'text-slate-500'}`}>{c.ok ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}{c.label}</li>
            ))}
          </ul>
        </div>
      </div>
      <PasswordField label="Confirm new password" value={values.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" />
      <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-900 disabled:opacity-60">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Update password
      </button>
      <ConfirmationDialog open={confirmOpen} loading={submitting} title="Change your password?" description="Use your new password the next time you sign in." confirmLabel="Change password" onConfirm={submit} onCancel={() => setConfirmOpen(false)} />
    </form>
  );
}
