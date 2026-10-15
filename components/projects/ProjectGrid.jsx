import ProjectCard from "@/components/projects/ProjectCard";

/** Pure list + loading/error states (ready for a future API). Empty states are handled by the browser. */
export default function ProjectGrid({ projects, status = "ready" }) {
  if (status === "loading") {
    return (
      <ul aria-busy="true" aria-label="Loading projects" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i} className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
            <div className="aspect-[16/10] animate-pulse bg-mist motion-reduce:animate-none" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-1/3 rounded bg-mist" />
              <div className="h-5 w-3/4 rounded bg-mist" />
              <div className="h-3 w-full rounded bg-mist" />
            </div>
          </li>
        ))}
      </ul>
    );
  }
  if (status === "error") {
    return (
      <div role="alert" className="rounded-2xl border border-forest/15 bg-white px-6 py-12 text-center">
        <h3 className="text-lg font-extrabold text-ink">We couldn’t load our projects</h3>
        <p className="mt-2 text-muted">Please refresh the page or try again a little later.</p>
      </div>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <li key={p.id}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  );
}
