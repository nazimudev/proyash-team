import ActionLink from "./ActionLink";

export default function AboutCTA({ content }) {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="bg-amber-400 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="about-cta-heading"
          className="text-3xl font-bold leading-[1.35] text-emerald-950 sm:text-4xl lg:text-5xl"
        >
          {content.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-emerald-950/85">
          {content.text}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <ActionLink href={content.primary.href} variant="onAccentPrimary">
            {content.primary.label}
          </ActionLink>
          <ActionLink href={content.secondary.href} variant="onAccentSecondary">
            {content.secondary.label}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}
