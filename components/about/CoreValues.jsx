import SectionHeading from "./SectionHeading";
import { getIcon } from "./iconMap";

export default function CoreValues({ content }) {
  return (
    <section
      id={content.id}
      aria-labelledby="values-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-24 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="values-heading"
          title={content.title}
          subtitle={content.subtitle}
          intro={content.intro}
          align="center"
        />
        {/* One bordered block divided by hairlines (gap-px over a tinted bg) */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-emerald-900/15 bg-emerald-900/15 sm:grid-cols-2 lg:grid-cols-3 dark:border-emerald-100/15 dark:bg-emerald-100/15">
          {content.items.map((value) => {
            const Icon = getIcon(value.icon);
            return (
              <li
                key={value.title}
                className="bg-white p-8 transition-colors duration-200 hover:bg-emerald-50 dark:bg-neutral-950 dark:hover:bg-emerald-950/60"
              >
                <Icon
                  className="h-8 w-8 text-emerald-700 dark:text-amber-300"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-xl font-semibold text-emerald-950 dark:text-emerald-50">
                  {value.title}
                </h3>
                <p className="mt-2 leading-7 text-neutral-700 dark:text-neutral-300">
                  {value.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
