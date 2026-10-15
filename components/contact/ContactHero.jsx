import Link from "next/link";
import { hero } from "@/data/contact";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-emerald-50"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
          <ol className="flex flex-wrap items-center gap-2">
            {hero.breadcrumb.map((item, i) => (
              <li key={item.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#1F4D2B] focus-visible:outline-2 focus-visible:outline-[#1F4D2B]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="font-medium text-[#1F4D2B]"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-600">
          {hero.eyebrow}
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-[#1F4D2B] sm:text-4xl lg:text-5xl">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          {hero.description}
        </p>
      </div>
    </section>
  );
}
