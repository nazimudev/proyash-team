"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import StatusResult from "@/components/membership/StatusResult";
import { getMembershipStatus } from "@/lib/membershipService";

/** Fetches the signed-in applicant's OWN status from the backend. With no endpoint it explains that instead of guessing. */
export default function MembershipStatusView({ configured }) {
  const [state, setState] = useState(configured ? { phase: "loading" } : { phase: "closed" });

  useEffect(() => {
    if (!configured) return;
    let alive = true;
    getMembershipStatus().then((res) => {
      if (!alive) return;
      if (res.ok) setState({ phase: "ready", ...res });
      else setState({ phase: res.code === "unauthenticated" ? "signed-out" : "error" });
    });
    return () => {
      alive = false;
    };
  }, [configured]);

  const signIn = <Link href="/login" className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-forest px-6 font-semibold text-white hover:bg-deep">Sign in</Link>;

  if (state.phase === "loading") {
    return <p role="status" className="flex items-center gap-3 text-muted"><Loader2 size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />Checking your application status…</p>;
  }
  if (state.phase === "ready") return <StatusResult status={state.status} reference={state.reference} submittedAt={state.submittedAt} />;

  const copy = {
    closed: ["Status checking isn’t available yet", "Once sign-in is available you’ll be able to check your application status here."],
    "signed-out": ["Please sign in", "Sign in to see the status of your own application."],
    error: ["We couldn’t load your status", "Please try again in a little while."],
  }[state.phase];
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 bg-white p-8">
      <h2 className="text-xl font-extrabold text-ink">{copy[0]}</h2>
      <p className="mt-2 text-muted">{copy[1]}</p>
      {state.phase !== "closed" && signIn}
    </div>
  );
}
