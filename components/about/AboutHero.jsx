import ActionLink from "./ActionLink";
import CommunityIllustration from "./CommunityIllustration";

export default function AboutHero({ content }) {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden bg-white dark:bg-neutral-950"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <p className="inline-block border-l-4 border-amber-400 pl-3 text-sm font-semibold tracking-wide text-emerald-800 dark:text-amber-300">
            {content.eyebrow}
          </p>
          <h1
            id="about-hero-heading"
            className="mt-6 text-4xl font-bold leading-[1.3] text-emerald-950 sm:text-5xl lg:text-6xl dark:text-emerald-50"
          >
            {content.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
            {content.intro}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ActionLink href={content.primaryCta.href} variant="primary">
              {content.primaryCta.label}
            </ActionLink>
            <ActionLink href={content.secondaryCta.href} variant="secondary">
              {content.secondaryCta.label}
            </ActionLink>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-4xl bg-emerald-50 p-8 dark:bg-emerald-950/60">
            <CommunityIllustration variant="ring" label={content.visualAlt} />
          </div>
        </div>
      </div>
    </section>
  );
}
