export default function SectionHeading({
  eyebrow,
  title,
  children,
  tone = "light",
  align = "left",
  className = "",
}) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-4 flex items-center gap-3 text-sm font-bold tracking-wide ${
            dark ? "text-fresh" : "text-forest"
          } ${center ? "justify-center" : ""}`}
        >
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-balance text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {children && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            dark ? "text-white/75" : "text-muted"
          }`}
        >
          {children}
        </p>
      )}
    </div>
  );
}
