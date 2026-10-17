import { ShieldAlert } from "lucide-react";
import CheckField from "@/components/membership/CheckField";
import { membershipConfig } from "@/data/membershipConfig";
import { declaration as c } from "@/data/membership";

export default function ApplicantDeclaration({ values, errors, onChange }) {
  const { privacyPolicyHref, termsHref } = membershipConfig;
  const documentsPublished = Boolean(privacyPolicyHref && termsHref);
  return (
    <section aria-labelledby="declaration-heading">
      <h3 id="declaration-heading" className="text-lg font-extrabold text-ink">{c.title}</h3>
      <div className="mt-4 space-y-5">
        <CheckField id="declaration_accepted" checked={values.declaration_accepted} onChange={(v) => onChange("declaration_accepted", v)} error={errors.declaration_accepted}>{c.text}</CheckField>
        <CheckField id="privacy_terms_accepted" checked={values.privacy_terms_accepted} onChange={(v) => onChange("privacy_terms_accepted", v)} error={errors.privacy_terms_accepted}>
          {documentsPublished ? (
            <>I have read and accept the applicable <a href={privacyPolicyHref} className="font-semibold text-forest underline underline-offset-4">Privacy Policy</a> and <a href={termsHref} className="font-semibold text-forest underline underline-offset-4">Terms of Service</a>.</>
          ) : (
            <>{c.privacyTerms} <span className="text-sm text-muted">{c.documentsPending}</span></>
          )}
        </CheckField>
      </div>
      <p role="note" className="mt-6 flex items-start gap-3 rounded-xl bg-mist p-4 text-ink">
        <ShieldAlert size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
        {c.notice}
      </p>
    </section>
  );
}
