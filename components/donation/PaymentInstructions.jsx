import { ShieldAlert, Info } from "lucide-react";
import CopyButton from "@/components/donation/CopyButton";

function Detail({ label, value, copy = false }) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-3">
      <div>
        <dt className="text-xs font-bold text-muted">{label}</dt>
        <dd className="font-semibold text-ink">{value}</dd>
      </div>
      {copy && <CopyButton value={value} label={label} />}
    </div>
  );
}

/** Instructions for the selected, AVAILABLE method, or an honest "not published yet" note. */
export default function PaymentInstructions({ method, anyAvailable }) {
  if (!anyAvailable) {
    return (
      <div className="rounded-2xl border border-dashed border-forest/25 bg-white p-6">
        <Info size={22} aria-hidden="true" className="text-forest" />
        <h3 className="mt-3 text-lg font-extrabold text-ink">Payment details are not published yet</h3>
        <p className="mt-2 text-muted">
          Payment account details will appear here once they have been confirmed. Please do not send any
          money until the details are published on this page.
        </p>
      </div>
    );
  }
  if (!method) {
    return (
      <div className="rounded-2xl border border-dashed border-forest/25 bg-white p-6">
        <h3 className="text-lg font-extrabold text-ink">How to donate</h3>
        <p className="mt-2 text-muted">Choose an available payment method to see where to send your donation and how to complete the form.</p>
      </div>
    );
  }

  const steps = [
    `Select ${method.displayName} as your payment method.`,
    "Send your donation to the verified organization account shown here, using the transaction type listed.",
    "Copy the transaction ID or reference from your payment confirmation.",
    "Enter that ID in the donation form.",
    "Submit your donation details for verification.",
  ];

  return (
    <div className="rounded-2xl border border-forest/15 bg-white p-6 sm:p-7">
      <h3 className="text-xl font-extrabold text-ink">Pay with {method.displayName}</h3>

      {method.kind !== "cash" && (
        <dl className="mt-4 divide-y divide-forest/10 rounded-xl border border-forest/10 px-4">
          {method.kind === "mobile" && (
            <>
              <Detail label="Account number" value={method.accountNumber} copy />
              <Detail label="Account type" value={method.accountType} />
            </>
          )}
          {method.kind === "bank" && (
            <>
              <Detail label="Bank name" value={method.bankName} copy />
              <Detail label="Account holder" value={method.accountHolder} copy />
              <Detail label="Account number" value={method.accountNumber} copy />
              <Detail label="Branch" value={method.branchName} />
              <Detail label="Routing number" value={method.routingNumber} copy />
            </>
          )}
        </dl>
      )}

      <h4 className="mt-6 text-sm font-bold text-ink">Steps</h4>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-muted marker:font-bold marker:text-forest">
        {steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h4 className="mt-6 text-sm font-bold text-ink">Instructions for {method.displayName}</h4>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-muted marker:text-forest">
        {method.instructions.filter(Boolean).map((s) => <li key={s}>{s}</li>)}
      </ul>

      <p className="mt-6 flex items-start gap-2 rounded-xl bg-mist p-4 text-sm text-ink">
        <ShieldAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
        Never share your PIN, OTP or password with anyone. We will never ask for them.
      </p>
    </div>
  );
}
