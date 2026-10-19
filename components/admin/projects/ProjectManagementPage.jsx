"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import { btnPrimary } from "@/components/admin/donation/Modal";
import ProjectSummaryCards from "./ProjectSummaryCards";
import ProjectFinancialOverview from "./ProjectFinancialOverview";
import ProjectFilters from "./ProjectFilters";
import ProjectsTable from "./ProjectsTable";
import ProjectDetailsModal from "./ProjectDetailsModal";
import { sampleProjects } from "@/data/projectsAdmin";
import { demoExpenses } from "@/data/expenses"; // shared with the Expenses page so totals stay consistent
import {
  PROJECT_ROUTES,
  EMPTY_PROJECT_FILTERS,
  attachExpenseTotals,
  calculateProjectSummary,
  calculateFinancials,
  filterAndSortProjects,
} from "@/lib/projectUtils";

export default function ProjectManagementPage() {
  // FUTURE API: replace these two sources with Laravel responses (projects, and per-project expense totals or records).
  const [projects] = useState(sampleProjects);
  const [expenses] = useState(demoExpenses);
  const [filters, setFilters] = useState(EMPTY_PROJECT_FILTERS);
  const [selected, setSelected] = useState(null);

  const all = useMemo(
    () => attachExpenseTotals(projects, expenses),
    [projects, expenses],
  );
  const summary = useMemo(() => calculateProjectSummary(all), [all]);
  const financials = useMemo(() => calculateFinancials(all), [all]);
  const visible = useMemo(
    () => filterAndSortProjects(all, filters),
    [all, filters],
  );
  const hasFilters =
    JSON.stringify(filters) !== JSON.stringify(EMPTY_PROJECT_FILTERS);

  return (
    <div>
      <PageHeader
        title="Project Management"
        description="Monitor projects, track progress, and review budgets and expenses."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              {summary.total} project{summary.total === 1 ? "" : "s"}
            </span>
            <Link href={PROJECT_ROUTES.create} className={btnPrimary}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add Project
            </Link>
          </div>
        }
      />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Sample data only. Summary and budget figures cover all projects, not
        just the filtered rows.
      </p>

      <div className="space-y-6">
        <ProjectSummaryCards summary={summary} financials={financials} />
        <ProjectFinancialOverview financials={financials} />

        <section
          className="rounded-xl border border-gray-200 bg-white"
          aria-label="Projects"
        >
          <ProjectFilters
            filters={filters}
            hasFilters={hasFilters}
            onChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
            onReset={() => setFilters(EMPTY_PROJECT_FILTERS)}
          />
          <ProjectsTable
            projects={visible}
            hasFilters={hasFilters}
            onView={setSelected}
          />
          <p className="border-t border-gray-100 px-4 py-3 text-sm text-gray-600">
            Showing {visible.length} of {all.length} projects
          </p>
        </section>
      </div>

      <ProjectDetailsModal
        project={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
