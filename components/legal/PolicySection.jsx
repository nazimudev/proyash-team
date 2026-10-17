import { Info } from "lucide-react";

/** One numbered policy section. The id is the anchor used by the table of contents. */
export default function PolicySection({ section, number }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-24 border-t border-forest/10 pt-10 first:border-t-0 first:pt-0">
      <h2 id={`${section.id}-heading`} className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        <span className="text-forest">{number}.</span> {section.title}
      </h2>
      <div className="mt-5 space-y-4">
        {section.blocks.map((b, i) => {
          if (b.p) return <p key={i} className="text-[17px] leading-relaxed text-ink/90">{b.p}</p>;
          if (b.h3) return <h3 key={i} className="pt-2 text-lg font-extrabold text-ink">{b.h3}</h3>;
          if (b.ul)
            return (
              <ul key={i} className="list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-ink/90 marker:text-forest">
                {b.ul.map((item) => <li key={item}>{item}</li>)}
              </ul>
            );
          if (b.note)
            return (
              <p key={i} role="note" className="flex items-start gap-3 rounded-xl bg-mist p-4 text-[16px] leading-relaxed text-ink">
                <Info size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-forest" />
                {b.note}
              </p>
            );
          return null;
        })}
      </div>
    </section>
  );
}
