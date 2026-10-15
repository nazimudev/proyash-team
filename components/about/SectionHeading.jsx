export default function SectionHeading({
  id,
  title,
  subtitle,
  intro,
  align = "left",
  tone = "light",
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor =
    tone === "dark" ? "text-white" : "text-emerald-950 dark:text-emerald-50";
  const subColor =
    tone === "dark" ? "text-amber-300" : "text-emerald-700 dark:text-amber-300";
  const introColor =
    tone === "dark"
      ? "text-emerald-100"
      : "text-neutral-600 dark:text-neutral-300";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      <h2
        id={id}
        className={`text-3xl font-bold leading-[1.35] sm:text-4xl ${titleColor}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-base font-medium ${subColor}`} lang="en">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className={`mt-4 text-lg leading-8 ${introColor}`}>{intro}</p>
      )}
    </div>
  );
}
