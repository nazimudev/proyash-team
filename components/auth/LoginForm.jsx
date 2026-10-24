"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, TriangleAlert } from "lucide-react";
import FormField, { inputClass, fieldAria } from "@/components/ui/FormField";
import PasswordInput from "@/components/ui/PasswordInput";
import StatusResult from "@/components/membership/StatusResult";
import { loginMember } from "@/lib/membershipService";
import { loginClosedNotice } from "@/data/membership";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/lib/auth";


const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const failureText = {
  "not-configured": "Sign-in isn’t available yet. Nothing was sent.",
  "invalid-credentials": "The email or password is incorrect.",
  "rate-limited": "Too many attempts. Please wait a little and try again.",
  network: "We couldn’t reach the server. Please check your connection and try again.",
  server: "Something went wrong on our side. Please try again later.",
  unexpected: "We couldn’t confirm your account status. Please try again later.",
  rejected: "We couldn’t sign you in. Please try again.",
};

/**
 * No "remember me" and no "forgot password" link: neither is supported by an implemented backend yet.
 * After sign-in the membership status shown is whatever the server returned; it is never decided here.
 */
export default function LoginForm({ signInOpen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [phase, setPhase] = useState("idle"); // idle | submitting | error | done
  const [failure, setFailure] = useState(null);
  const [status, setStatus] = useState(null);
  const busy = useRef(false);

  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    if (busy.current || !signInOpen) return;
    const found = {};
    if (!email.trim()) found.email = "Please enter your email address.";
    else if (!EMAIL.test(email.trim())) found.email = "Enter a valid email address.";
    if (!password) found.password = "Please enter your password.";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => document.querySelector('#login-form [aria-invalid="true"]')?.focus());
      return;
    }
    busy.current = true;
    setPhase("submitting");
    const res = await loginMember({ email: email.trim(), password });
    busy.current = false;
    setPassword(""); // never keep the password around
    if (res.ok) {
      saveAuth(res.token, res.user.role);
      localStorage.setItem("auth_user", JSON.stringify(res.user));

      const redirectTo = res.user.role === "admin" ? "/admin" : "/member";
      router.replace(redirectTo);
      return;



    } else {
      setFailure(res.code);
      setPhase("error");
    }
  }

  if (phase === "done") return <StatusResult status={status} />;

  return (
    <form id="login-form" onSubmit={onSubmit} noValidate className="space-y-6 rounded-2xl border border-forest/10 bg-white p-7 sm:p-9">
      {!signInOpen && (
        <p role="note" className="flex items-start gap-3 rounded-xl border border-dashed border-forest/30 bg-paper p-4 text-ink">
          <Lock size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
          {loginClosedNotice}
        </p>
      )}
      <FormField id="email" label="Email address" required error={errors.email}>
        <input {...fieldAria("email", errors.email)} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass(errors.email)} />
      </FormField>
      <FormField id="password" label="Password" required error={errors.password}>
        <PasswordInput aria={fieldAria("password", errors.password)} value={password} onChange={setPassword} invalid={errors.password} autoComplete="current-password" />
      </FormField>

      {phase === "error" && (
        <p role="alert" className="flex items-start gap-3 rounded-xl border border-[#b42318]/40 bg-[#fef3f2] p-4 text-[#7a271a]">
          <TriangleAlert size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
          {failureText[failure] ?? failureText.server}
        </p>
      )}

      <button type="submit" disabled={phase === "submitting" || !signInOpen} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-forest px-6 font-semibold text-white transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:bg-muted/60">
        {phase === "submitting" && <Loader2 size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
        {phase === "submitting" ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">
        Not a member yet? <Link href="/join" className="font-semibold text-forest underline underline-offset-4">Join Proyash</Link>
      </p>
    </form>
  );
}
