import { Check } from "lucide-react"; // ASSUMPTION: lucide-react
import SectionHeading from "./SectionHeading";

export default function CommitmentSection({ content }) {
  return (
    <section
      id={content.id}
      aria-labelledby="commitment-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-24 dark:bg-neutral-950"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="commitment-heading"
            title={content.title}
            subtitle={content.subtitle}
            intro={content.intro}
          />
        </div>

        <ul className="divide-y divide-emerald-900/15 border-y border-emerald-900/15 dark:divide-emerald-100/15 dark:border-emerald-100/15">
          {content.items.map((item) => (
            <li key={item.title} className="flex gap-5 py-6">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-emerald-950">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-semibold leading-snug text-emerald-950 dark:text-emerald-50">
                  {item.title}
                </h3>
                <p className="mt-1 leading-7 text-neutral-700 dark:text-neutral-300">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
