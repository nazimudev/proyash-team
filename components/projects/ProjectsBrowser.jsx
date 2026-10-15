"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectsEmptyState from "@/components/projects/ProjectsEmptyState";

/** Client island: category + status filters share one state and always combine (AND). */
export default function ProjectsBrowser({ projects, categories, statuses, loadState = "ready" }) {
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const matches = (p, c, s) => (c === "all" || p.category === c) && (s === "all" || p.status === s);
  const visible = projects.filter((p) => matches(p, category, status));
  const categoryCounts = Object.fromEntries(categories.map((c) => [c.id, projects.filter((p) => matches(p, c.id, status)).length]));
  const statusCounts = Object.fromEntries(statuses.map((s) => [s.id, projects.filter((p) => matches(p, category, s.id)).length]));
  const reset = () => {
    setCategory("all");
    setStatus("all");
  };

  let body;
  if (loadState !== "ready") body = <ProjectGrid projects={[]} status={loadState} />;
  else if (projects.length === 0) body = <ProjectsEmptyState variant="none" />;
  else if (visible.length === 0) body = <ProjectsEmptyState variant="filtered" onReset={reset} />;
  else body = <ProjectGrid projects={visible} />;

  return (
    <section id="projects-list" aria-label="Projects" className="scroll-mt-20 bg-mist py-16 sm:py-24">
      <Container>
        <ProjectFilters
          categories={categories}
          statuses={statuses}
          categoryCounts={categoryCounts}
          statusCounts={statusCounts}
          category={category}
          status={status}
          onCategory={setCategory}
          onStatus={setStatus}
        />
        {projects.length > 0 && loadState === "ready" && (
          <p role="status" aria-live="polite" className="mt-5 text-sm font-semibold text-muted">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
          </p>
        )}
        <div className={projects.length > 0 ? "mt-8" : ""}>{body}</div>
      </Container>
    </section>
  );
}
