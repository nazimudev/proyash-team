"use client";

import { useRef, useState } from "react";
import { CircleCheck, TriangleAlert, Loader2, Lock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FormField, { inputClass, fieldAria } from "@/components/donation/FormField";
import PaymentMethodSelector from "@/components/donation/PaymentMethodSelector";
import PaymentInstructions from "@/components/donation/PaymentInstructions";
import { donationConfig } from "@/data/donationConfig";
import { submitDonation } from "@/lib/donationService";
import { validateDonation, parseAmount, normalizeAmount } from "@/lib/donationValidation";
import { formatMoney, toMinor } from "@/lib/donationCalculations";

const initial = {
  donorType: "named", fullName: "", amount: "", paymentMethod: "", transactionId: "",
  phone: "", email: "", purpose: "", message: "", showName: false, showAmount: false, consent: false,
};

const errorText = {
  "not-configured": "We’re not accepting donation submissions through this form yet. Your details were not sent or saved.",
  network: "We couldn’t reach the donation service. Your details were not submitted. Please check your connection and try again.",
  rejected: "Your donation details could not be accepted. Please review them and try again.",
  server: "Something went wrong on our side. Your details were not recorded. Please try again later.",
};

/**
 * `methods`: public payment config (see lib/payment.js). `submissionOpen`: a backend endpoint is configured.
 * Nothing is persisted in the browser, and success is shown only after the server confirms receipt.
 */
export default function DonationForm({ methods, submissionOpen }) {
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("idle"); // idle | submitting | success | error
  const [errorCode, setErrorCode] = useState(null);
  const [reference, setReference] = useState(null);
  const submitting = useRef(false); // synchronous guard against double clicks
  const requestId = useRef(null); // one id per attempt so the backend can dedupe retries

  const method = methods.find((m) => m.id === v.paymentMethod && m.available) ?? null;
  const anyAvailable = methods.some((m) => m.available);
  const set = (name, value) => {
    setV((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };
  const amountNumber = parseAmount(v.amount);
  const privacyHref = donationConfig.privacyPolicyHref;

  async function onSubmit(e) {
    e.preventDefault();
    if (submitting.current || !submissionOpen) return;

    const found = validateDonation(v, method);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => document.querySelector('#donation-form [aria-invalid="true"], #donation-form fieldset:has(#paymentMethod-error) input')?.focus());
      return;
    }

    submitting.current = true;
    setPhase("submitting");
    requestId.current ??= crypto.randomUUID();
    const payload = {
      clientRequestId: requestId.current,
      donorType: v.donorType,
      fullName: v.donorType === "named" ? v.fullName.trim() : null,
      amount: amountNumber,
      amountMinor: toMinor(amountNumber),
      currency: donationConfig.currency,
      paymentMethod: v.paymentMethod,
      transactionId: v.transactionId.trim() || null,
      phone: v.phone.replace(/[\s-]/g, "") || null,
      email: v.email.trim() || null,
      purpose: v.purpose || null,
      message: v.message.trim() || null,
      publicPreferences: { showName: v.donorType === "named" && v.showName, showAmount: v.showAmount },
      consent: true,
    };
    const result = await submitDonation(payload);
    submitting.current = false;
    if (result.ok) {
      setReference(result.reference);
      setPhase("success");
      requestId.current = null;
    } else {
      setErrorCode(result.code);
      setPhase("error");
    }
  }

  function reset() {
    setV(initial);
    setErrors({});
    setReference(null);
    setErrorCode(null);
    setPhase("idle");
  }

  const busy = phase === "submitting";

  return (
    <section id="donate" aria-labelledby="donate-heading" className="scroll-mt-20 bg-mist py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Donate" title="Make a Donation" headingId="donate-heading">
          Choose your preferred payment method and provide your donation details.
        </SectionHeading>

        {!submissionOpen && (
          <p role="note" className="mt-8 flex max-w-3xl items-start gap-3 rounded-xl border border-dashed border-forest/30 bg-white p-4 text-ink">
            <Lock size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
            We’re not accepting donation submissions through this form yet. Please check back soon.
          </p>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            {phase === "success" ? (
              <div role="status" className="rounded-2xl border border-forest/20 bg-white p-8">
                <CircleCheck size={32} aria-hidden="true" className="text-forest" />
                <h3 className="mt-4 text-2xl font-extrabold text-ink">Donation details submitted</h3>
                <p className="mt-3 text-lg text-muted">
                  Your donation details have been submitted successfully. Your payment is pending verification. Thank you for supporting our mission.
                </p>
                {reference && (
                  <p className="mt-4 text-sm text-ink">Reference number: <span className="font-bold">{reference}</span></p>
                )}
                <button type="button" onClick={reset} className="mt-6 inline-flex min-h-12 items-center rounded-lg border border-forest/30 px-5 font-semibold text-forest hover:bg-forest/5">
                  Submit another donation
                </button>
              </div>
            ) : (
              <form id="donation-form" onSubmit={onSubmit} noValidate className="space-y-8 rounded-2xl border border-forest/10 bg-white p-6 sm:p-9">
                {/* Donor type */}
                <fieldset>
                  <legend className="text-sm font-bold text-ink">Donor type</legend>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {[["named", "Named Donation"], ["anonymous", "Anonymous Donation"]].map(([val, label]) => (
                      <label key={val} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-semibold focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-forest ${v.donorType === val ? "border-forest bg-mist" : "border-forest/25 hover:border-forest/60"}`}>
                        <input type="radio" name="donorType" value={val} checked={v.donorType === val} onChange={() => set("donorType", val)} className="size-4 accent-[#166534]" />
                        {label}
                      </label>
                    ))}
                  </div>
                  {v.donorType === "anonymous" && (
                    <p className="mt-3 text-sm text-muted">
                      You will appear publicly as “Anonymous Donor”. Payment verification may require limited private
                      details (such as the payment number or transaction ID). These are never shown on this website.
                    </p>
                  )}
                </fieldset>

                {v.donorType === "named" && (
                  <FormField id="fullName" label="Full name" required error={errors.fullName}>
                    <input {...fieldAria("fullName", errors.fullName)} type="text" autoComplete="name" value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputClass(errors.fullName)} />
                  </FormField>
                )}

                {/* Amount */}
                <FormField id="amount" label="Donation amount (BDT)" required error={errors.amount}>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {donationConfig.quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        aria-pressed={normalizeAmount(v.amount) === String(q)}
                        onClick={() => set("amount", String(q))}
                        className={`min-h-11 rounded-lg border px-4 text-sm font-bold transition-colors ${normalizeAmount(v.amount) === String(q) ? "border-forest bg-forest text-white" : "border-forest/25 text-ink hover:border-forest/60"}`}
                      >
                        {formatMoney(q * 100)}
                      </button>
                    ))}
                  </div>
                  <input {...fieldAria("amount", errors.amount)} type="text" inputMode="decimal" placeholder="Enter a custom amount" value={v.amount} onChange={(e) => set("amount", e.target.value)} className={inputClass(errors.amount)} />
                  {amountNumber !== null && <p className="mt-1.5 text-sm font-semibold text-forest">You are donating {formatMoney(toMinor(amountNumber))}.</p>}
                </FormField>

                <FormField id="purpose" label="Donation purpose" optional hint="This is a preference, not a legal restriction on how funds are used.">
                  <select {...fieldAria("purpose", null, true)} value={v.purpose} onChange={(e) => set("purpose", e.target.value)} className={inputClass(false)}>
                    <option value="">No preference</option>
                    {donationConfig.purposes.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </FormField>

                <PaymentMethodSelector methods={methods} value={v.paymentMethod} onChange={(id) => set("paymentMethod", id)} error={errors.paymentMethod} />

                {method && (
                  <>
                    <FormField id="transactionId" label={method.transactionId.label} required={method.transactionId.required} optional={!method.transactionId.required} hint={method.transactionId.hint || undefined} error={errors.transactionId}>
                      <input {...fieldAria("transactionId", errors.transactionId, Boolean(method.transactionId.hint))} type="text" autoComplete="off" value={v.transactionId} onChange={(e) => set("transactionId", e.target.value)} className={inputClass(errors.transactionId)} />
                    </FormField>
                    <FormField id="phone" label="Phone number" required={method.needsPhone} optional={!method.needsPhone} hint={method.needsPhone ? "The number you used to send the payment. It is kept private." : "Kept private."} error={errors.phone}>
                      <input {...fieldAria("phone", errors.phone, true)} type="tel" autoComplete="tel" placeholder="01XXXXXXXXX" value={v.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass(errors.phone)} />
                    </FormField>
                  </>
                )}

                <FormField id="email" label="Email address" optional error={errors.email}>
                  <input {...fieldAria("email", errors.email)} type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} className={inputClass(errors.email)} />
                </FormField>

                <FormField id="message" label="Message" optional hint="Your message is private and is not displayed publicly." error={errors.message}>
                  <textarea {...fieldAria("message", errors.message, true)} rows={3} maxLength={600} value={v.message} onChange={(e) => set("message", e.target.value)} className={inputClass(errors.message)} />
                </FormField>

                {/* Public display preferences */}
                <fieldset className="rounded-xl bg-mist p-5">
                  <legend className="px-1 text-sm font-bold text-ink">Public supporter list</legend>
                  <p className="text-sm text-muted">Only confirmed donations can appear publicly, and only as you choose here. Both options are off by default.</p>
                  <div className="mt-3 space-y-2">
                    {v.donorType === "named" && (
                      <label className="flex min-h-11 cursor-pointer items-start gap-3 text-ink">
                        <input type="checkbox" checked={v.showName} onChange={(e) => set("showName", e.target.checked)} className="mt-1 size-4 accent-[#166534]" />
                        Show my name publicly
                      </label>
                    )}
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 text-ink">
                      <input type="checkbox" checked={v.showAmount} onChange={(e) => set("showAmount", e.target.checked)} className="mt-1 size-4 accent-[#166534]" />
                      Show my donation amount publicly
                    </label>
                  </div>
                </fieldset>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-ink">
                    <input {...fieldAria("consent", errors.consent)} type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 size-4 shrink-0 accent-[#166534]" />
                    <span>
                      I confirm that the information provided is accurate and understand that my donation will be verified before it is recorded as confirmed.
                      {privacyHref && <> See our <a href={privacyHref} className="font-semibold text-forest underline underline-offset-4">Privacy Policy</a>.</>}
                    </span>
                  </label>
                  {errors.consent && <p id="consent-error" className="mt-1.5 text-sm font-semibold text-[#b42318]">{errors.consent}</p>}
                </div>

                {phase === "error" && (
                  <p role="alert" className="flex items-start gap-3 rounded-xl border border-[#b42318]/40 bg-[#fef3f2] p-4 text-[#7a271a]">
                    <TriangleAlert size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
                    {errorText[errorCode] ?? errorText.server}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy || !submissionOpen}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-forest px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:bg-muted/60 sm:w-auto"
                >
                  {busy && <Loader2 size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
                  {busy ? "Submitting…" : submissionOpen ? "Submit Donation Details" : "Submissions Not Open Yet"}
                </button>
                <p className="text-sm text-muted">Submitting this form does not confirm your payment. Your donation is recorded as pending until it is verified.</p>
              </form>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <PaymentInstructions method={method} anyAvailable={anyAvailable} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
