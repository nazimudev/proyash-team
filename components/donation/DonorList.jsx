"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DonorCard from "@/components/donation/DonorCard";

const filters = [
  { id: "all", label: "All Donations" },
  { id: "named", label: "Named Donations" },
  { id: "anonymous", label: "Anonymous Donations" },
];

/** Public, privacy-safe supporter list. The filter appears only when both kinds exist; "Load more" pages long lists. */
export default function DonorList({ donations, pageSize }) {
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState(pageSize);

  const namedCount = donations.filter((d) => d.isNamed).length;
  const counts = { all: donations.length, named: namedCount, anonymous: donations.length - namedCount };
  const showFilters = counts.named > 0 && counts.anonymous > 0;
  const list = donations.filter((d) => filter === "all" || (filter === "named" ? d.isNamed : !d.isNamed));
  const visible = list.slice(0, shown);

  return (
    <section id="supporters" aria-labelledby="supporters-heading" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Supporters" title="Our Supporters" headingId="supporters-heading">
          Every confirmed contribution helps support our community efforts. We respect the privacy choices of our donors.
        </SectionHeading>

        {donations.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-forest/25 bg-paper px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest"><Users size={22} aria-hidden="true" /></span>
            <p className="mx-auto mt-4 max-w-md text-muted">Confirmed donor records will appear here as verified contributions are published.</p>
          </div>
        ) : (
          <>
            {showFilters && (
              <div role="group" aria-label="Filter supporters" className="mt-8 flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={filter === f.id}
                    onClick={() => { setFilter(f.id); setShown(pageSize); }}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${filter === f.id ? "border-forest bg-forest text-white" : "border-forest/20 bg-white text-ink hover:border-forest/50"}`}
                  >
                    {f.label}
                    <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${filter === f.id ? "bg-white/20" : "bg-mist text-forest"}`}>{counts[f.id]}</span>
                  </button>
                ))}
              </div>
            )}
            <p role="status" aria-live="polite" className="mt-5 text-sm font-semibold text-muted">
              Showing {visible.length} of {list.length} {list.length === 1 ? "supporter" : "supporters"}
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((d) => <DonorCard key={d.id} donor={d} />)}
            </ul>
            {visible.length < list.length && (
              <button type="button" onClick={() => setShown((n) => n + pageSize)} className="mt-8 inline-flex min-h-12 items-center rounded-lg border border-forest/30 px-6 font-semibold text-forest hover:bg-forest/5">
                Load more
              </button>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
