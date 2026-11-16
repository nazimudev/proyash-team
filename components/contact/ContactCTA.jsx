// src/components/contact/ContactCTA.jsx  (server component)
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// VERIFY: change href to your real projects/activities route.
export default function ContactCTA({ href = "/impact" }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-forest px-6 py-14 text-center text-white sm:px-12">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Let&apos;s Make a Difference Together
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-green-100">
          Your questions, ideas, and support can help us create meaningful
          change in our community.
        </p>
        <Link
          href={href}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-forest transition hover:bg-green-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
        >
          Explore Our Impact{" "}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
