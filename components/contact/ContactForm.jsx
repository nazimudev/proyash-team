"use client";

// src/components/contact/ContactForm.jsx
import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/services/contactApi";

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Enter your full name.";
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email.trim()))
    e.email = "Enter a valid email address.";
  if (v.phone && !/^[0-9+\-\s()]{5,30}$/.test(v.phone))
    e.phone = "Use digits, spaces, +, - and parentheses only.";
  if (!v.subject.trim()) e.subject = "Enter a subject.";
  if (!v.message.trim()) e.message = "Write your message.";
  else if (v.message.length > 5000)
    e.message = "Keep your message under 5,000 characters.";
  return e;
}

export default function ContactForm() {
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false); // blocks double submits before state updates

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((x) => ({ ...x, [name]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (lock.current) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    lock.current = true;
    setSubmitting(true);
    try {
      await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website, // honeypot
      });
      toast.success(
        "Your message has been sent successfully. Thank you for contacting Proyash Songgothon.",
      );
      setValues(INITIAL);
      setErrors({});
    } catch (err) {
      // Entered data is kept so the visitor can retry.
      if (err.errors && Object.keys(err.errors).length) {
        setErrors(
          Object.fromEntries(
            Object.entries(err.errors).map(([k, v]) => [k, v[0]]),
          ),
        );
      }
      toast.error(err.message);
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  }

  const field = (
    id,
    label,
    { required = false, as = "input", ...props } = {},
  ) => {
    const Tag = as;
    const err = errors[id];
    return (
      <div>
        <label
          htmlFor={`contact-${id}`}
          className="mb-1.5 block text-sm font-medium text-gray-800"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="text-red-600">
              {" "}
              *
            </span>
          )}
        </label>
        <Tag
          id={`contact-${id}`}
          name={id}
          value={values[id]}
          onChange={onChange}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(err)}
          aria-describedby={err ? `contact-${id}-error` : undefined}
          disabled={submitting}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/30 disabled:bg-gray-50 ${
            err ? "border-red-400" : "border-gray-300"
          }`}
          {...props}
        />
        {err && (
          <p
            id={`contact-${id}-error`}
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Full Name", {
          required: true,
          autoComplete: "name",
          maxLength: 255,
        })}
        {field("email", "Email Address", {
          required: true,
          type: "email",
          autoComplete: "email",
          maxLength: 255,
        })}
        {field("phone", "Phone Number (optional)", {
          type: "tel",
          autoComplete: "tel",
          maxLength: 30,
        })}
        {field("subject", "Subject", { required: true, maxLength: 255 })}
      </div>

      <div className="mt-5">
        {field("message", "Message", {
          required: true,
          as: "textarea",
          rows: 6,
          maxLength: 5000,
        })}
      </div>

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={onChange}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#14532d] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {submitting ? "Sending Message..." : "Send Message"}
      </button>
    </form>
  );
}
