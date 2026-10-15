import Link from "next/link";
import { cta } from "@/data/contact";

export default function ContactCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#1F4D2B] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <h2
          id="cta-heading"
          className="text-2xl font-bold sm:text-3xl lg:text-4xl"
        >
          {cta.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-emerald-50/90">
          {cta.description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={cta.primary.href}
            className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#1F4D2B] transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            {cta.primary.label}
          </Link>
          <Link
            href={cta.secondary.href}
            className="w-full rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
          >
            {cta.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
