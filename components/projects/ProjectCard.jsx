import Link from "next/link";
import { TreePine, MapPin, CalendarDays } from "lucide-react";
import Photo from "@/components/ui/Photo";
import StatusBadge from "@/components/projects/StatusBadge";

/** Whole card is clickable through one real link (stretched pseudo-element), so there are no nested links. */
export default function ProjectCard({ project: p }) {
  const planned = p.status === "planned";
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-deep/10 focus-within:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        planned ? "border-dashed border-muted/50" : "border-forest/10"
      }`}
    >
      <Photo
        src={p.cover?.src}
        alt={p.cover?.alt ?? ""}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
        className="aspect-[16/10]"
        fallback={<TreePine size={30} strokeWidth={1.25} aria-hidden="true" className="text-forest/40" />}
      />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">{p.categoryLabel}</span>
          <StatusBadge status={p.status} label={p.statusLabel} />
        </div>
        <h3 className="mt-4 text-xl font-extrabold leading-snug tracking-tight text-ink">{p.title}</h3>
        <p className="mt-2 line-clamp-3 leading-relaxed text-muted">{p.summary}</p>

        {(p.location || p.dateLabel) && (
          <ul className="mt-4 space-y-1.5 text-sm text-muted">
            {p.location && (
              <li className="flex items-center gap-2">
                <MapPin size={15} aria-hidden="true" className="shrink-0 text-forest" />
                {p.location}
              </li>
            )}
            {p.dateLabel && (
              <li className="flex items-center gap-2">
                <CalendarDays size={15} aria-hidden="true" className="shrink-0 text-forest" />
                {p.dateLabel}
              </li>
            )}
          </ul>
        )}

        <Link
          href={`/projects/${p.slug}`}
          aria-label={`View project: ${p.title}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 font-semibold text-forest underline decoration-forest/30 underline-offset-[6px] after:absolute after:inset-0 after:content-[''] group-hover:decoration-forest focus-visible:outline-offset-[-4px]"
        >
          View Project
        </Link>
      </div>
    </article>
  );
}
