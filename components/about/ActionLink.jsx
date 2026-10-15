import Link from "next/link";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";

const variants = {
  primary:
    "bg-emerald-800 text-white hover:bg-emerald-900 focus-visible:ring-emerald-500/50 dark:bg-amber-400 dark:text-emerald-950 dark:hover:bg-amber-300 dark:focus-visible:ring-amber-300/50 dark:focus-visible:ring-offset-neutral-950",
  secondary:
    "border-2 border-emerald-800 text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-500/50 dark:border-emerald-300 dark:text-emerald-100 dark:hover:bg-emerald-900/40 dark:focus-visible:ring-offset-neutral-950",
  // For use on the amber CTA band
  onAccentPrimary:
    "bg-emerald-950 text-white hover:bg-emerald-900 focus-visible:ring-emerald-950/40 focus-visible:ring-offset-amber-400",
  onAccentSecondary:
    "border-2 border-emerald-950 text-emerald-950 hover:bg-emerald-950/10 focus-visible:ring-emerald-950/40 focus-visible:ring-offset-amber-400",
};

export default function ActionLink({ href, variant = "primary", children }) {
  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  );
}
