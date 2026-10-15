/**
 * Inline SVG illustrations so the page has no dependency on image files.
 * Swap for real photography later by replacing the usage in
 * AboutHero / OrganizationIntro with <Image /> (width/height required).
 */
export default function CommunityIllustration({ variant = "ring", label }) {
  if (variant === "steps") {
    const bars = [
      { x: 40, h: 80 },
      { x: 125, h: 130 },
      { x: 210, h: 180 },
      { x: 295, h: 230 },
    ];
    return (
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label={label}
        className="h-auto w-full"
      >
        {bars.map((b, i) => (
          <g key={b.x}>
            <rect
              x={b.x}
              y={340 - b.h}
              width="65"
              height={b.h}
              rx="14"
              className={
                i % 2 === 0
                  ? "fill-emerald-700 dark:fill-emerald-500"
                  : "fill-emerald-500 dark:fill-emerald-700"
              }
            />
            <circle
              cx={b.x + 32.5}
              cy={340 - b.h - 28}
              r="17"
              className="fill-amber-400"
            />
          </g>
        ))}
        <rect
          x="20"
          y="340"
          width="360"
          height="6"
          rx="3"
          className="fill-emerald-900/20 dark:fill-emerald-100/20"
        />
      </svg>
    );
  }

  const nodes = [
    [325, 200],
    [262.5, 308.3],
    [137.5, 308.3],
    [75, 200],
    [137.5, 91.7],
    [262.5, 91.7],
  ];
  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={label}
      className="h-auto w-full"
    >
      <circle
        cx="200"
        cy="200"
        r="125"
        fill="none"
        strokeWidth="3"
        strokeDasharray="4 10"
        strokeLinecap="round"
        className="stroke-emerald-700/50 dark:stroke-emerald-300/50"
      />
      {nodes.map(([cx, cy], i) => (
        <g key={i}>
          <line
            x1="200"
            y1="200"
            x2={cx}
            y2={cy}
            strokeWidth="2"
            className="stroke-emerald-700/25 dark:stroke-emerald-300/25"
          />
          <circle
            cx={cx}
            cy={cy}
            r="34"
            className={
              i % 2 === 0
                ? "fill-emerald-800 dark:fill-emerald-500"
                : "fill-emerald-600 dark:fill-emerald-700"
            }
          />
        </g>
      ))}
      <circle cx="200" cy="200" r="52" className="fill-amber-400" />
      <circle cx="200" cy="200" r="22" className="fill-emerald-950" />
    </svg>
  );
}
