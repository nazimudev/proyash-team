import SectionHeading from "./SectionHeading";
import { getIcon } from "./iconMap";

export default function GoalsSection({ content }) {
  return (
    <section
      id={content.id}
      aria-labelledby="goals-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-24 dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="goals-heading"
          title={content.title}
          subtitle={content.subtitle}
          intro={content.intro}
        />
        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {content.items.map((goal) => {
            const Icon = getIcon(goal.icon);
            return (
              <li
                key={goal.title}
                className="group flex gap-5 rounded-2xl border border-emerald-900/15 bg-emerald-50/60 p-6 transition-colors duration-200 hover:border-emerald-700/40 hover:bg-emerald-50 sm:p-8 dark:border-emerald-100/10 dark:bg-emerald-950/40 dark:hover:border-emerald-300/40"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-800 text-white dark:bg-amber-400 dark:text-emerald-950">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold leading-snug text-emerald-950 dark:text-emerald-50">
                    {goal.title}
                  </h3>
                  <p className="mt-2 leading-7 text-neutral-700 dark:text-neutral-300">
                    {goal.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
