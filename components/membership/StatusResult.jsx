import Link from "next/link";
import MembershipStatusBadge from "@/components/membership/MembershipStatusBadge";
import { statusCopy } from "@/data/membership";
import { membershipConfig } from "@/data/membershipConfig";

/** Plain-language explanation for a status the BACKEND returned. Approved access is still enforced server-side. */
export default function StatusResult({ status, reference, submittedAt }) {
  const dashboard = membershipConfig.memberDashboardHref;
  return (
    <div role="status" className="rounded-2xl border border-forest/15 bg-white p-7">
      <MembershipStatusBadge status={status} />
      <p className="mt-4 text-lg text-ink">{statusCopy[status].description}</p>
      {reference && <p className="mt-3 text-sm text-muted">Application reference: <span className="font-bold text-ink">{reference}</span></p>}
      {submittedAt && <p className="mt-1 text-sm text-muted">Submitted: <span className="font-bold text-ink">{submittedAt}</span></p>}
      {status === "approved" &&
        (dashboard ? (
          <Link href={dashboard} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-forest px-6 font-semibold text-white hover:bg-deep">Go to Member Dashboard</Link>
        ) : (
          <p className="mt-4 text-muted">The Member Dashboard isn’t available yet.</p>
        ))}
    </div>
  );
}
