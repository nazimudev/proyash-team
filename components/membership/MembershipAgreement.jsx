import { Info } from "lucide-react";
import CheckField from "@/components/membership/CheckField";
import { membershipConditions as c } from "@/data/membership";

/** Shows the conditions exactly as supplied in data/membership.js (no added or altered obligations). */
export default function MembershipAgreement({ checked, error, onChange }) {
  return (
    <section aria-labelledby="agreement-heading">
      <h3 id="agreement-heading" className="text-lg font-extrabold text-ink">{c.title}</h3>
      <ol className="mt-4 list-decimal space-y-2 rounded-xl border border-forest/15 bg-paper py-5 pl-10 pr-5 text-ink marker:font-bold marker:text-forest">
        {c.items.map((item) => <li key={item}>{item}</li>)}
      </ol>
      <p className="mt-3 flex items-start gap-2 text-sm text-muted">
        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
        {c.note}
      </p>
      <div className="mt-4">
        <CheckField id="membership_agreement_accepted" checked={checked} onChange={onChange} error={error}>{c.acknowledgment}</CheckField>
      </div>
    </section>
  );
}
