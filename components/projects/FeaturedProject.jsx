import { TreePine, MapPin, CalendarDays, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import StatusBadge from "@/components/projects/StatusBadge";

/** Rendered only when a published, verified project is flagged isFeatured (see lib/projects.js). */
export default function FeaturedProject({ project: p }) {
  return (
    <section aria-labelledby="featured-project-heading" className="bg-white py-16 sm:py-20">
      <Container>
        <article className="group grid overflow-hidden rounded-2xl border border-forest/10 bg-paper lg:grid-cols-12">
          <Photo
            src={p.cover?.src}
            alt={p.cover?.alt ?? ""}
            priority
            sizes="(min-width: 1024px) 700px, 100vw"
            className="aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[26rem]"
            fallback={<TreePine size={40} strokeWidth={1.25} aria-hidden="true" className="text-forest/40" />}
          />
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-5">
            <p className="flex items-center gap-3 text-sm font-bold text-forest">
              <span aria-hidden="true" className="h-px w-8 bg-current" />
              Featured project
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">{p.categoryLabel}</span>
              <StatusBadge status={p.status} label={p.statusLabel} />
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest">
                <ShieldCheck size={14} aria-hidden="true" /> Verified
              </span>
            </div>
            <h2 id="featured-project-heading" className="mt-4 text-balance text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{p.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
            {(p.location || p.dateLabel) && (
              <ul className="mt-5 space-y-1.5 text-sm text-muted">
                {p.location && <li className="flex items-center gap-2"><MapPin size={15} aria-hidden="true" className="text-forest" />{p.location}</li>}
                {p.dateLabel && <li className="flex items-center gap-2"><CalendarDays size={15} aria-hidden="true" className="text-forest" />{p.dateLabel}</li>}
              </ul>
            )}
            <Button href={`/projects/${p.slug}`} className="mt-8 self-start">View Project</Button>
          </div>
        </article>
      </Container>
    </section>
  );
}
