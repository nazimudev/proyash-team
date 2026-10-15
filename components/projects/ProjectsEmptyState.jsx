import { Sprout, SearchX } from "lucide-react";
import { projectsEmpty as c } from "@/data/projects";

/** variant "none": nothing published yet. variant "filtered": filters matched nothing (shows a reset button). */
export default function ProjectsEmptyState({ variant = "none", onReset }) {
  const filtered = variant === "filtered";
  const Icon = filtered ? SearchX : Sprout;
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 bg-white px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-mist text-forest">
        <Icon size={22} aria-hidden="true" />
      </span>
      {filtered ? (
        <>
          <p className="mt-5 text-lg font-extrabold text-ink">{c.noMatch}</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-forest/30 px-5 py-2.5 text-sm font-semibold text-forest transition-colors hover:border-forest hover:bg-forest/5"
          >
            Reset filters
          </button>
        </>
      ) : (
        <>
          <h3 className="mt-5 text-xl font-extrabold text-ink">{c.title}</h3>
          <p className="mx-auto mt-2 max-w-md text-muted">{c.text}</p>
        </>
      )}
    </div>
  );
}
