import Link from "next/link";
import { TreePine, MapPin, CalendarDays, ShieldCheck, ExternalLink, CircleCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import StatusBadge from "@/components/projects/StatusBadge";
import ProjectTimeline from "@/components/projects/ProjectTimeline";

function Block({ id, title, children }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Every section renders only when the project has documented content for it. */
export default function ProjectDetails({ project: p }) {
  const hasTimeline = p.startLabel || p.completionLabel || p.milestones.length > 0;
  const hasSidebar = p.location || hasTimeline;

  return (
    <>
      <section className="bg-paper pb-10 pt-28 sm:pt-32">
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
              <li><Link href="/" className="font-semibold text-forest underline-offset-4 hover:underline">Home</Link></li>
              <li aria-hidden="true" className="text-muted">/</li>
              <li><Link href="/projects" className="font-semibold text-forest underline-offset-4 hover:underline">Projects</Link></li>
              <li aria-hidden="true" className="text-muted">/</li>
              <li aria-current="page" className="font-semibold text-muted">{p.title}</li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-bold text-forest">{p.categoryLabel}</span>
            <StatusBadge status={p.status} label={p.statusLabel} />
            {p.isVerified && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-forest">
                <ShieldCheck size={14} aria-hidden="true" /> Verified
              </span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">{p.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{p.summary}</p>
          {(p.location || p.dateLabel) && (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted">
              {p.location && <li className="flex items-center gap-2"><MapPin size={16} aria-hidden="true" className="text-forest" />{p.location}</li>}
              {p.dateLabel && <li className="flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" className="text-forest" />{p.dateLabel}</li>}
            </ul>
          )}

          <div className="group mt-10">
            <Photo
              src={p.cover?.src}
              alt={p.cover?.alt ?? ""}
              priority
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="aspect-[16/9] rounded-2xl"
              fallback={<TreePine size={44} strokeWidth={1.25} aria-hidden="true" className="text-forest/40" />}
            />
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <Container>
          <div className={`grid gap-12 ${hasSidebar ? "lg:grid-cols-12 lg:gap-14" : ""}`}>
            <div className={`space-y-14 ${hasSidebar ? "lg:col-span-8" : "max-w-3xl"}`}>
              {p.paragraphs.length > 0 && (
                <Block id="overview" title="Project Overview">
                  <div className="space-y-4 text-lg leading-relaxed text-muted">
                    {p.paragraphs.map((t) => <p key={t}>{t}</p>)}
                  </div>
                </Block>
              )}

              {p.objectives.length > 0 && (
                <Block id="objectives" title="Objectives">
                  <ul className="space-y-3">
                    {p.objectives.map((o) => (
                      <li key={o} className="flex items-start gap-3 text-ink">
                        <CircleCheck size={20} aria-hidden="true" className="mt-1 shrink-0 text-forest" />{o}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {p.activities.length > 0 && (
                <Block id="activities" title="Activities">
                  <ul className="divide-y divide-forest/10 rounded-2xl border border-forest/10">
                    {p.activities.map((a) => (
                      <li key={a.title} className="p-5">
                        <h3 className="font-extrabold text-ink">{a.title}</h3>
                        {a.dateLabel && <p className="text-sm font-semibold text-muted">{a.dateLabel}</p>}
                        {a.description && <p className="mt-1.5 text-muted">{a.description}</p>}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {p.outcomes.length > 0 && (
                <Block id="outcomes" title="Outcomes">
                  <ul className="space-y-4">
                    {p.outcomes.map((o) => (
                      <li key={o.title} className="rounded-2xl bg-mist p-5">
                        <h3 className="font-extrabold text-ink">{o.title}</h3>
                        {o.description && <p className="mt-1.5 text-muted">{o.description}</p>}
                        {o.evidenceUrl && (
                          <a
                            href={o.evidenceUrl}
                            {...(o.evidenceUrl.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                            className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                          >
                            View supporting record <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
            </div>

            {hasSidebar && (
              <aside aria-label="Project facts" className="space-y-10 lg:col-span-4">
                {p.location && (
                  <Block id="location" title="Location">
                    <p className="flex items-start gap-2 text-lg text-ink"><MapPin size={20} aria-hidden="true" className="mt-1 shrink-0 text-forest" />{p.location}</p>
                  </Block>
                )}
                {hasTimeline && (
                  <Block id="timeline" title="Project Timeline">
                    <ProjectTimeline project={p} />
                  </Block>
                )}
              </aside>
            )}
          </div>
        </Container>
      </section>

      {p.gallery.length > 0 && (
        <section aria-labelledby="project-gallery-heading" className="bg-paper py-16 sm:py-20">
          <Container>
            <h2 id="project-gallery-heading" className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Photo Gallery</h2>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.gallery.map((g) => (
                <li key={g.src}>
                  <figure className="group">
                    <Photo src={g.src} alt={g.alt} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] rounded-xl" />
                    {g.caption && <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
