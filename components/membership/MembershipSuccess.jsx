import Link from "next/link";
import { CircleCheck } from "lucide-react";
import MembershipStatusBadge from "@/components/membership/MembershipStatusBadge";
import Button from "@/components/ui/Button";
import { statusCopy } from "@/data/membership";

/** Shown ONLY after the backend confirmed the application was saved. Reference appears only if the backend sent one. */
export default function MembershipSuccess({ reference, status }) {
  return (
    <div role="status" className="rounded-2xl border border-forest/20 bg-white p-8 sm:p-10">
      <CircleCheck size={36} aria-hidden="true" className="text-forest" />
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">Application submitted</h2>
      <p className="mt-3 text-lg text-muted">Thank you for applying to join Proyash. We have received your application and your account has been created.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <MembershipStatusBadge status={status} />
        {reference && <p className="text-sm text-ink">Application reference: <span className="font-bold">{reference}</span></p>}
      </div>
      <p className="mt-4 text-muted">{statusCopy[status].description}</p>
      <p className="mt-2 text-muted">Submitting an application does not guarantee membership.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/login">Sign in to check your status</Button>
        <Button href="/" variant="outline">Back to home</Button>
      </div>
      <p className="mt-6 text-sm text-muted">Questions? <Link href="/#contact" className="font-semibold text-forest underline underline-offset-4">Contact us</Link>.</p>
    </div>
  );
}
