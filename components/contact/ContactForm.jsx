/* eslint-disable react-hooks/static-components */
"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { formCopy, subjectOptions, contactDetails } from "@/data/contact";
import { submitContactForm } from "@/lib/contactApi";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\-\s\d]{7,20}$/;
const MIN_MESSAGE = 20;

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Please enter your full name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = "Please enter a valid email address.";
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim()))
    e.phone = "Please enter a valid phone number.";
  if (!v.subject) e.subject = "Please select a subject.";
  if (!v.message.trim()) e.message = "Please write a message.";
  else if (v.message.trim().length < MIN_MESSAGE)
    e.message = `Your message should be at least ${MIN_MESSAGE} characters.`;
  if (!v.consent) e.consent = "Please confirm you agree to the privacy terms.";
  return e;
}

const inputBase =
  "mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition focus:border-[#1F4D2B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D2B]/40";

const fieldClass = (hasError) =>
  `${inputBase} ${hasError ? "border-red-500" : "border-neutral-300"}`;

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const submittingRef = useRef(false);

  const id = (name) => `${uid}-${name}`;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    const found = validate(values);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(id(firstKey))?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");
    setErrorMsg("");

    const result = await submitContactForm({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      subject: values.subject,
      message: values.message.trim(),
    });

    submittingRef.current = false;

    if (result.ok) {
      setStatus("success");
      setValues(EMPTY);
    } else {
      setStatus("error");
      setErrorMsg(
        result.code === "NOT_CONFIGURED"
          ? "Messaging is not available right now. Please try again later."
          : "We couldn't send your message. Please check your connection and try again.",
      );
    }
  }

  const invalidAttrs = (name) =>
    errors[name]
      ? { "aria-invalid": true, "aria-describedby": id(`${name}-err`) }
      : {};

  const ErrorText = ({ name }) =>
    errors[name] ? (
      <p id={id(`${name}-err`)} className="mt-1.5 text-sm text-red-600">
        {errors[name]}
      </p>
    ) : null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1F4D2B] sm:text-3xl">
        {formCopy.heading}
      </h2>
      <p className="mt-3 text-neutral-600">{formCopy.description}</p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={id("name")}
              className="block text-sm font-medium text-neutral-800"
            >
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              id={id("name")}
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleChange}
              className={fieldClass(errors.name)}
              {...invalidAttrs("name")}
            />
            <ErrorText name="name" />
          </div>

          <div>
            <label
              htmlFor={id("email")}
              className="block text-sm font-medium text-neutral-800"
            >
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id={id("email")}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              className={fieldClass(errors.email)}
              {...invalidAttrs("email")}
            />
            <ErrorText name="email" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor={id("phone")}
              className="block text-sm font-medium text-neutral-800"
            >
              Phone Number <span className="text-neutral-400">(optional)</span>
            </label>
            <input
              id={id("phone")}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={values.phone}
              onChange={handleChange}
              className={fieldClass(errors.phone)}
              {...invalidAttrs("phone")}
            />
            <ErrorText name="phone" />
          </div>

          <div>
            <label
              htmlFor={id("subject")}
              className="block text-sm font-medium text-neutral-800"
            >
              Subject <span className="text-red-600">*</span>
            </label>
            <select
              id={id("subject")}
              name="subject"
              required
              value={values.subject}
              onChange={handleChange}
              className={fieldClass(errors.subject)}
              {...invalidAttrs("subject")}
            >
              <option value="">Select a subject</option>
              {subjectOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ErrorText name="subject" />
          </div>
        </div>

        <div>
          <label
            htmlFor={id("message")}
            className="block text-sm font-medium text-neutral-800"
          >
            Message <span className="text-red-600">*</span>
          </label>
          <textarea
            id={id("message")}
            name="message"
            rows={5}
            required
            placeholder="Tell us how we can help..."
            value={values.message}
            onChange={handleChange}
            className={fieldClass(errors.message)}
            {...invalidAttrs("message")}
          />
          <ErrorText name="message" />
        </div>

        <div>
          <div className="flex items-start gap-3">
            <input
              id={id("consent")}
              name="consent"
              type="checkbox"
              checked={values.consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#1F4D2B] focus-visible:ring-2 focus-visible:ring-[#1F4D2B]/40"
              {...invalidAttrs("consent")}
            />
            <label
              htmlFor={id("consent")}
              className="text-sm leading-relaxed text-neutral-600"
            >
              I agree that the information I submit will be handled according to
              the organization&apos;s{" "}
              {contactDetails.privacyPolicyHref ? (
                <Link
                  href={contactDetails.privacyPolicyHref}
                  className="font-medium text-[#1F4D2B] underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
              ) : (
                <span className="font-medium text-neutral-800">
                  Privacy Policy
                </span>
              )}
              .
            </label>
          </div>
          <ErrorText name="consent" />
        </div>

        <div aria-live="polite">
          {status === "success" && (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
             {` Thank you. Your message has been sent. We'll review it and get
              back to you.`}
            </p>
          )}
          {status === "error" && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              {errorMsg}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4D2B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173A21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D2B] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2
                size={18}
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              Sending...
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
