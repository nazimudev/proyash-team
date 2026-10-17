import { Check } from "lucide-react";
import { joinSteps } from "@/data/membership";

/** Progress indicator. Current step is announced via aria-current; completed steps via text, not colour alone. */
export default function MembershipStepper({ current }) {
  return (
    <nav aria-label="Application progress">
      <p className="mb-3 text-sm font-bold text-forest sm:hidden">Step {current + 1} of {joinSteps.length}: {joinSteps[current].title}</p>
      <ol className="flex items-center gap-2 sm:gap-3">
        {joinSteps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s.id} aria-current={active ? "step" : undefined} className={`flex items-center gap-2 ${i < joinSteps.length - 1 ? "flex-1" : ""}`}>
              <span className={`grid size-9 shrink-0 place-items-center rounded-full border-2 text-sm font-extrabold ${done ? "border-forest bg-forest text-white" : active ? "border-forest bg-white text-forest" : "border-forest/25 bg-white text-muted"}`}>
                {done ? <Check size={16} aria-hidden="true" /> : i + 1}
              </span>
              <span className={`hidden text-sm font-bold sm:inline ${active ? "text-ink" : "text-muted"}`}>
                {s.title}
                {done && <span className="sr-only"> (completed)</span>}
              </span>
              {i < joinSteps.length - 1 && <span aria-hidden="true" className={`h-0.5 flex-1 rounded ${done ? "bg-forest" : "bg-forest/20"}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
