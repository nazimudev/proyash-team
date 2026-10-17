"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Lock, TriangleAlert } from "lucide-react";
import Container from "@/components/ui/Container";
import MembershipStepper from "@/components/membership/MembershipStepper";
import ErrorSummary from "@/components/membership/ErrorSummary";
import PersonalInformationForm from "@/components/membership/PersonalInformationForm";
import AddressInformationForm from "@/components/membership/AddressInformationForm";
import AccountCredentialsForm from "@/components/membership/AccountCredentialsForm";
import MembershipAgreement from "@/components/membership/MembershipAgreement";
import ApplicantDeclaration from "@/components/membership/ApplicantDeclaration";
import ApplicationReview from "@/components/membership/ApplicationReview";
import MembershipSuccess from "@/components/membership/MembershipSuccess";
import { applyForMembership } from "@/lib/membershipService";
import { validateStep, validateAll, validatePhoto, stepOfField, stepFields } from "@/lib/membershipValidation";
import { personalFields, joinSteps, joinClosedNotice, addressParts, sameAddressLabel } from "@/data/membership";

const blankValues = Object.fromEntries([...stepFields.flat(), "same_address"].map((k) => [k, k.endsWith("_accepted") || k === "same_address" ? false : ""]));
const labels = {
  ...Object.fromEntries(personalFields.map((f) => [f.name, f.label])),
  ...Object.fromEntries(addressParts.flatMap((a) => [[`permanent_${a.part}`, `Permanent ${a.label.toLowerCase()}`], [`present_${a.part}`, `Present ${a.label.toLowerCase()}`]])),
  password: "Password", password_confirmation: "Confirm password",
  membership_agreement_accepted: "Membership conditions", declaration_accepted: "Applicant declaration", privacy_terms_accepted: "Privacy Policy and Terms of Service",
  same_address: sameAddressLabel, profile_photo: "Profile photo",
};
const failureText = {
  "not-configured": "We’re not accepting online applications yet. Your details were not sent or saved.",
  network: "We couldn’t reach the server. Your application was not submitted. Please check your connection and try again.",
  "rate-limited": "Too many attempts. Please wait a little and try again.",
  server: "Something went wrong on our side. Your application was not recorded. Please try again later.",
  rejected: "Your application could not be accepted. Please review your details and try again.",
  validation: "The server couldn’t accept some of your details. Please review the form and try again.",
};
const emptyPhoto = { file: null, url: null };

/**
 * Four-step application. State lives only in memory: nothing (and never the password) is written to
 * localStorage/sessionStorage. Success is shown only after the backend confirms the application was saved.
 */
export default function MembershipForm({ applicationsOpen }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(blankValues);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [photo, setPhoto] = useState(emptyPhoto);
  const [photoError, setPhotoError] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | submitting | success | error
  const [failure, setFailure] = useState(null);
  const [result, setResult] = useState(null);
  const submitting = useRef(false);
  const requestId = useRef(null);
  const summaryRef = useRef(null);
  const headingRef = useRef(null);
  const photoUrl = useRef(null);

  useEffect(() => () => photoUrl.current && URL.revokeObjectURL(photoUrl.current), []);

  const allErrors = photoError ? { ...errors, profile_photo: photoError } : errors;
  const focusSoon = (ref) => requestAnimationFrame(() => ref.current?.focus());

  function set(name, value) {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (prev.same_address && name.startsWith("permanent_")) next[name.replace("permanent_", "present_")] = value;
      return next;
    });
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  }
  function setSame(checked) {
    setValues((prev) => {
      const next = { ...prev, same_address: checked };
      if (checked) addressParts.forEach(({ part }) => (next[`present_${part}`] = prev[`permanent_${part}`]));
      return next;
    });
    setErrors((p) => ({ ...p, ...Object.fromEntries(addressParts.map(({ part }) => [`present_${part}`, undefined])) }));
  }
  function selectPhoto(file) {
    const problem = validatePhoto(file);
    setPhotoError(problem);
    if (problem) return;
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
    photoUrl.current = URL.createObjectURL(file);
    setPhoto({ file, url: photoUrl.current });
  }
  function removePhoto() {
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
    photoUrl.current = null;
    setPhoto(emptyPhoto);
    setPhotoError(null);
  }
  function goTo(i) {
    setStep(i);
    setShowSummary(false);
    focusSoon(headingRef);
  }

  function next() {
    const found = validateStep(step, values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setShowSummary(true);
      focusSoon(summaryRef);
      return;
    }
    goTo(step + 1);
  }

  async function submit() {
    if (submitting.current || !applicationsOpen) return;
    const found = validateAll(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = Math.min(...Object.keys(found).map((k) => stepOfField(k) ?? 0));
      setStep(first);
      setShowSummary(true);
      focusSoon(summaryRef);
      return;
    }

    submitting.current = true;
    setPhase("submitting");
    requestId.current ??= crypto.randomUUID();
    const fd = new FormData();
    const add = (k, v) => v !== undefined && v !== null && String(v).trim() !== "" && fd.append(k, String(v).trim());
    personalFields.forEach((f) => add(f.name, f.name === "mobile_number" ? values.mobile_number.replace(/[\s-]/g, "") : values[f.name]));
    addressParts.forEach(({ part }) => {
      add(`permanent_${part}`, values[`permanent_${part}`]);
      add(`present_${part}`, values.same_address ? values[`permanent_${part}`] : values[`present_${part}`]);
    });
    fd.append("password", values.password);
    fd.append("password_confirmation", values.password_confirmation);
    ["membership_agreement_accepted", "declaration_accepted"].forEach((k) => fd.append(k, "1"));
    fd.append("privacy_policy_accepted", "1");
    fd.append("terms_accepted", "1");
    fd.append("client_request_id", requestId.current);
    if (photo.file) fd.append("profile_photo", photo.file);

    const res = await applyForMembership(fd);
    submitting.current = false;

    if (res.ok) {
      setResult({ reference: res.reference, status: res.status });
      setValues(blankValues);
      removePhoto();
      requestId.current = null;
      setPhase("success");
      return;
    }
    if (res.code === "validation") {
      const mapped = {};
      for (const [field, msg] of Object.entries(res.fieldErrors ?? {})) {
        if (field === "profile_photo") setPhotoError(msg);
        else mapped[field] = msg;
      }
      const known = Object.keys({ ...mapped, ...(res.fieldErrors?.profile_photo ? { profile_photo: 1 } : {}) });
      setErrors(mapped);
      if (known.length > 0) {
        setStep(Math.min(...known.map((k) => stepOfField(k) ?? 0)));
        setShowSummary(true);
        focusSoon(summaryRef);
      }
    }
    setFailure(res.code);
    setPhase("error");
  }

  if (phase === "success") {
    return (
      <section aria-label="Application result" className="bg-mist py-14 sm:py-20">
        <Container className="max-w-3xl"><MembershipSuccess reference={result.reference} status={result.status} /></Container>
      </section>
    );
  }

  const busy = phase === "submitting";
  const last = step === joinSteps.length - 1;

  return (
    <section id="application" aria-label="Membership application" className="scroll-mt-20 bg-mist py-14 sm:py-20">
      <Container className="max-w-4xl">
        {!applicationsOpen && (
          <p role="note" className="mb-6 flex items-start gap-3 rounded-xl border border-dashed border-forest/30 bg-white p-4 text-ink">
            <Lock size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
            {joinClosedNotice}
          </p>
        )}
        <div className="rounded-2xl border border-forest/10 bg-white p-6 sm:p-10">
          <MembershipStepper current={step} />
          <p className="mt-6 text-sm text-muted"><span aria-hidden="true" className="font-bold text-forest">*</span> Required field</p>

          <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{joinSteps[step].title}</h2>

          {showSummary && <div className="mt-6"><ErrorSummary errors={allErrors} labels={labels} innerRef={summaryRef} /></div>}

          <form noValidate onSubmit={(e) => { e.preventDefault(); last ? submit() : next(); }} className="mt-8">
            {step === 0 && <PersonalInformationForm values={values} errors={errors} onChange={set} photo={photo} photoError={photoError} onPhotoSelect={selectPhoto} onPhotoRemove={removePhoto} />}
            {step === 1 && <AddressInformationForm values={values} errors={errors} onChange={set} onSameChange={setSame} />}
            {step === 2 && (
              <div className="space-y-12">
                <AccountCredentialsForm values={values} errors={errors} onChange={set} />
                <MembershipAgreement checked={values.membership_agreement_accepted} error={errors.membership_agreement_accepted} onChange={(v) => set("membership_agreement_accepted", v)} />
                <ApplicantDeclaration values={values} errors={errors} onChange={set} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <p className="text-muted">Please check your details. Use Edit to change anything before submitting.</p>
                <ApplicationReview values={values} photo={photo} onEdit={goTo} />
                <p role="note" className="rounded-xl bg-mist p-4 text-ink">Submitting this application does not guarantee membership. Your application will be reviewed by the Proyash administration.</p>
              </div>
            )}

            {phase === "error" && (
              <p role="alert" className="mt-8 flex items-start gap-3 rounded-xl border border-[#b42318]/40 bg-[#fef3f2] p-4 text-[#7a271a]">
                <TriangleAlert size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
                {failureText[failure] ?? failureText.server}
              </p>
            )}

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-forest/10 pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-forest/30 px-6 font-semibold text-forest hover:bg-forest/5 disabled:opacity-50">
                  <ArrowLeft size={18} aria-hidden="true" /> Previous
                </button>
              ) : <span />}
              <button
                type="submit"
                disabled={busy || (last && !applicationsOpen)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-forest px-7 font-semibold text-white transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:bg-muted/60"
              >
                {busy && <Loader2 size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
                {last ? (busy ? "Submitting…" : "Submit Application") : <>Continue <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
