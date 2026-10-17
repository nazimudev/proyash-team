import { Check, X } from "lucide-react";
import FormField, { fieldAria } from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import { passwordChecks, passwordStrength } from "@/lib/membershipValidation";
import { passwordGuidance } from "@/data/membership";

export default function AccountCredentialsForm({ values, errors, onChange }) {
  const checks = passwordChecks(values.password);
  const strength = passwordStrength(values.password);
  const bar = ["bg-forest/15", "bg-[#b42318]", "bg-[#b7791f]", "bg-forest"];

  return (
    <fieldset>
      <legend className="text-lg font-extrabold text-ink">Account credentials</legend>
      <div className="mt-4 space-y-6">
        <div>
          <p className="text-sm font-bold text-ink">Login email</p>
          <p className="mt-1 rounded-lg border border-forest/15 bg-paper px-4 py-3 text-ink">{values.email || "Enter your email in Step 1"}</p>
          <p className="mt-1 text-sm text-muted">This is the email you entered in Personal Information. You will use it to sign in.</p>
        </div>

        <FormField id="password" label="Password" required error={errors.password} hint={passwordGuidance.note}>
          <PasswordInput aria={fieldAria("password", errors.password, true)} value={values.password} onChange={(v) => onChange("password", v)} invalid={errors.password} />
        </FormField>

        <div aria-live="polite">
          <p className="text-sm font-bold text-ink">{passwordGuidance.title}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {checks.map((c) => (
              <li key={c.id} className={`flex items-center gap-2 ${c.ok ? "text-forest" : "text-muted"}`}>
                {c.ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
                {c.label}
                <span className="sr-only">{c.ok ? " (met)" : " (not met)"}</span>
              </li>
            ))}
          </ul>
          {values.password && (
            <div className="mt-3">
              <div aria-hidden="true" className="flex gap-1.5">
                {[1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= strength.level ? bar[strength.level] : "bg-forest/15"}`} />)}
              </div>
              <p className="mt-1 text-sm font-semibold text-ink">Strength: {strength.label}</p>
            </div>
          )}
        </div>

        <FormField id="password_confirmation" label="Confirm password" required error={errors.password_confirmation}>
          <PasswordInput aria={fieldAria("password_confirmation", errors.password_confirmation)} value={values.password_confirmation} onChange={(v) => onChange("password_confirmation", v)} invalid={errors.password_confirmation} />
        </FormField>
      </div>
    </fieldset>
  );
}
