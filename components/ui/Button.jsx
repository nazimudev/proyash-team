import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-200";

const variants = {
  primary: "rounded-lg bg-forest text-white hover:bg-deep",
  outline:
    "rounded-lg border border-forest/30 text-forest hover:border-forest hover:bg-forest/5",
  light: "rounded-lg bg-white text-forest hover:bg-mist",
  outlineLight:
    "rounded-lg border border-white/40 text-white hover:border-white hover:bg-white/10",
  link: "gap-1.5 text-forest underline decoration-forest/30 underline-offset-[6px] hover:decoration-forest",
  linkLight:
    "gap-1.5 text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white",
};

const sizes = {
  md: "min-h-12 px-6 py-3 text-[15px]",
  sm: "min-h-11 px-5 py-2.5 text-sm",
};

/**
 * Link-styled button. Internal hrefs use next/link; `external` opens safely in
 * a new tab. Link variants show an arrow icon to signal where they lead.
 */
export default function Button({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const isLink = variant === "link" || variant === "linkLight";
  const classes = `${base} ${variants[variant]} ${isLink ? "" : sizes[size]} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
        {isLink && <Icon size={16} aria-hidden="true" />}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
      {isLink && <Icon size={16} aria-hidden="true" />}
    </Link>
  );
}
