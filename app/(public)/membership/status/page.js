import Link from "next/link";
import Container from "@/components/ui/Container";
import MembershipStatusView from "@/components/membership/MembershipStatusView";
import { isConfigured } from "@/lib/membershipService";

export const metadata = {
  title: "Application Status | Proyash Songgothon",
  description: "Check the status of your Proyash Songgothon membership application.",
  robots: { index: false },
};

export default function MembershipStatusPage() {
  return (
    <section className="bg-mist pb-20 pt-32 sm:pt-36">
      <Container className="max-w-2xl">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="font-semibold text-forest underline-offset-4 hover:underline">Home</Link></li>
            <li aria-hidden="true" className="text-muted">/</li>
            <li aria-current="page" className="font-semibold text-muted">Application Status</li>
          </ol>
        </nav>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink">Application Status</h1>
        <p className="mt-3 text-muted">Your application is reviewed by the Proyash administration. Only you can see your own status.</p>
        <div className="mt-8"><MembershipStatusView configured={isConfigured("status")} /></div>
      </Container>
    </section>
  );
}
