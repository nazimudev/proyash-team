"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import MemberPersonalInfoSection from "./MemberPersonalInfoSection";
import MemberAddressSection from "./MemberAddressSection";
import { MEMBERS_LIST_ROUTE } from "@/data/memberOptions";
import {
  emptyMemberForm,
  validateMemberForm,
  buildMemberRequest,
  todayIso,
  FIELD_ORDER,
  ADDRESS_PARTS,
} from "@/lib/memberFormUtils";
import { createMember } from "@/services/memberService";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:opacity-60";

export default function AddMemberPage() {
  const router = useRouter();
  const [values, setValues] = useState(emptyMemberForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // { tone: "success" | "error" | "info", text }
  const inFlight = useRef(false); // blocks double submits before state updates
  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const onChange = (name, value) => {
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (v.sameAddress && name.startsWith("permanent_"))
        next[name.replace("permanent_", "present_")] = value; // keep copy in sync
      return next;
    });
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const onSameChange = (checked) => {
    setValues((v) => {
      const next = { ...v, sameAddress: checked };
      if (checked)
        for (const p of ADDRESS_PARTS)
          next[`present_${p}`] = v[`permanent_${p}`];
      return next;
    });
    if (checked)
      setErrors((e) => ({
        ...e,
        present_village: undefined,
        present_post_office: undefined,
        present_upazila: undefined,
        present_district: undefined,
      }));
  };

  const focusFirst = (errs) => {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) document.getElementById(`mf-${first}`)?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    const found = validateMemberForm(values, todayIso());
    setErrors(found);
    setNotice(null);
    if (Object.keys(found).length) {
      focusFirst(found);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      await createMember(buildMemberRequest(values)); // resolves only when the backend confirms creation
      setNotice({
        tone: "success",
        text: "Member added. Taking you back to the members list…",
      });
      redirectTimer.current = setTimeout(
        () => router.push(MEMBERS_LIST_ROUTE),
        1200,
      );
    } catch (err) {
      if (err?.name === "BackendNotConnectedError") {
        setNotice({
          tone: "info",
          text: "The member was not created. The Add Member backend isn't connected yet, so nothing was saved. Your entries are still here.",
        });
      } else if (err?.fieldErrors) {
        setErrors(err.fieldErrors);
        focusFirst(err.fieldErrors);
        setNotice({
          tone: "error",
          text: "The server rejected some entries. Please correct the highlighted fields.",
        });
      } else {
        setNotice({
          tone: "error",
          text: "The member was not created because something went wrong. Your entries are still here. Please try again.",
        });
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const tone = {
    success: "border-green-200 bg-green-50 text-green-900",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> Members{" "}
        <span aria-hidden="true">/</span>{" "}
        <span className="text-gray-900">Add Member</span>
      </nav>
      <PageHeader
        title="Add Member"
        description="Register a new member of Proyash Songgothon."
      />

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-6"
        aria-label="Add member"
      >
        <MemberPersonalInfoSection
          values={values}
          errors={errors}
          onChange={onChange}
        />
        <MemberAddressSection
          values={values}
          errors={errors}
          onChange={onChange}
          onSameChange={onSameChange}
        />

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <ShieldCheck
              className="h-4 w-4 text-green-600"
              aria-hidden="true"
            />
            Membership
          </h2>
          <div className="mt-2 space-y-2 text-sm text-gray-600">
            <p>
              You are registering this member directly. No application or
              approval request is created, so please verify the details above
              before adding.
            </p>
            <p>
              The member&rsquo;s status and any linked account are set by the
              backend, not by this form. This form doesn&rsquo;t record
              agreement or consent on the member&rsquo;s behalf; follow
              Proyash&rsquo;s policy for that separately.
            </p>
          </div>
        </section>

        {notice ? (
          <p
            role={notice.tone === "success" ? "status" : "alert"}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${tone[notice.tone]}`}
          >
            {notice.tone === "success" ? (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            ) : notice.tone === "info" ? (
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            )}
            {notice.text}
          </p>
        ) : null}

        <div className="flex flex-col-reverse gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className="text-sm text-red-700">
            {errorCount > 0
              ? `Please fix ${errorCount} field${errorCount === 1 ? "" : "s"} before adding the member.`
              : ""}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={MEMBERS_LIST_ROUTE}
              aria-disabled={submitting}
              tabIndex={submitting ? -1 : undefined}
              className={`${btnBase} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`}
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`${btnBase} bg-green-600 text-white hover:bg-green-700`}
            >
              {submitting ? "Adding member…" : "Add Member"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
