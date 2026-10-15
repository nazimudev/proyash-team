import SectionHeading from "./SectionHeading";
import CommunityIllustration from "./CommunityIllustration";
import { getIcon } from "./iconMap";

export default function OrganizationIntro({ content }) {
  return (
    <section
      id={content.id}
      aria-labelledby="intro-heading"
      className="scroll-mt-24 bg-neutral-50 py-16 sm:py-24 dark:bg-neutral-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="intro-heading"
              title={content.title}
              subtitle={content.subtitle}
            />
            <div className="mt-8 max-w-xl space-y-5 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-4xl bg-white p-8 ring-1 ring-emerald-900/10 dark:bg-neutral-950 dark:ring-emerald-100/10">
              <CommunityIllustration
                variant="steps"
                label={content.visualAlt}
              />
            </div>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-3">
          {content.highlights.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <li
                key={item.title}
                className="rounded-2xl bg-white p-6 ring-1 ring-emerald-900/10 dark:bg-neutral-950 dark:ring-emerald-100/10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white dark:bg-amber-400 dark:text-emerald-950">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold leading-snug text-emerald-950 dark:text-emerald-50">
                  {item.title}
                </h3>
                <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-300">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
