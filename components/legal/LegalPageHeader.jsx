import Link from "next/link";
import Container from "@/components/ui/Container";
import { formatDate } from "@/lib/impact";

/**
 * Green page header for legal pages. A light band (the navbar height) sits above the green block because the
 * shared navbar is transparent with dark text at the top of the page and would be unreadable on solid green.
 */
/** Effective/updated dates render only when a valid date is configured. */
export default function LegalPageHeader({ title, intro, effectiveDate, lastUpdated }) {
  const dates = [
    ["Effective date", formatDate(effectiveDate)],
    ["Last updated", formatDate(lastUpdated)],
  ].filter(([, v]) => v);

  return (
    <section className="bg-paper pt-[4.5rem]">
      <div className="on-dark bg-forest pb-14 pt-10 text-white sm:pb-16 sm:pt-12">
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline">Home</Link></li>
            <li aria-hidden="true" className="text-white/60">/</li>
            <li aria-current="page" className="font-semibold text-white">{title}</li>
          </ol>
        </nav>
        <h1 className="mt-8 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{intro}</p>
        {dates.length > 0 && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-1 text-sm">
            {dates.map(([label, value]) => (
              <div key={label}>
                <dt className="inline font-bold text-white">{label}: </dt>
                <dd className="inline text-white/85">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Container>
      </div>
    </section>
  );
}
