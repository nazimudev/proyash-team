"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import { btnPrimary, btnSecondary } from "@/components/admin/donation/Modal";
import ProjectBasicInformationForm from "./ProjectBasicInformationForm";
import ProjectLocationForm from "./ProjectLocationForm";
import ProjectTimelineForm from "./ProjectTimelineForm";
import ProjectBudgetForm from "./ProjectBudgetForm";
import ProjectStatusForm from "./ProjectStatusForm";
import ProjectFormActions from "./ProjectFormActions";
import { sampleProjects } from "@/data/projectsAdmin";
import { PROJECT_ROUTES } from "@/lib/projectUtils";
import {
  emptyProjectForm,
  validateProjectForm,
  formToProject,
  nextPreviewCode,
  FIELD_ORDER,
} from "@/lib/projectFormUtils";
import { createProject } from "@/services/projectService";

export default function AddProjectPage() {
  const [values, setValues] = useState(emptyProjectForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [created, setCreated] = useState(null);
  const inFlight = useRef(false); // blocks double submits before state updates
  const previewCode = useMemo(() => nextPreviewCode(sampleProjects), []);

  const onChange = (name, value) => {
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (name === "status") {
        if (value === "Planned") next.progress = "0";
        if (value === "Completed") next.progress = "100";
        if (value !== "Completed") next.actualCompletionDate = "";
      }
      return next;
    });
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
    if (name === "startDate" || name === "endDate")
      setErrors((e) => ({ ...e, endDate: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (inFlight.current) return;
    const found = validateProjectForm(values);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`pf-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      setCreated(await createProject(formToProject(values, previewCode))); // values stay intact if this throws
    } catch {
      setSubmitError(
        "Something went wrong and the project was not created. Your entries are still here. Please try again.",
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const reset = () => {
    setValues(emptyProjectForm());
    setErrors({});
    setCreated(null);
  };
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard <span aria-hidden="true">/</span> Projects{" "}
        <span aria-hidden="true">/</span>{" "}
        <span className="text-gray-900">Add Project</span>
      </nav>
      <PageHeader
        title="Add New Project"
        description="Create a project and define its objectives, timeline, budget, and responsible person."
        action={
          <Link href={PROJECT_ROUTES.list} className={btnSecondary}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to
            Projects
          </Link>
        }
      />

      {created ? (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-green-700"
              aria-hidden="true"
            />
            <div className="space-y-2 text-sm text-green-900">
              <h2 className="text-base font-semibold">
                “{created.name}” was created locally (prototype)
              </h2>
              <p>
                Nothing was saved to a server. The Projects page won&rsquo;t
                list it, and it will be gone after a reload, until the Laravel
                API is connected. A permanent project ID will be assigned by the
                backend.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href={PROJECT_ROUTES.list} className={btnPrimary}>
                  Back to Projects
                </Link>
                <button type="button" onClick={reset} className={btnSecondary}>
                  Add another project
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-6"
          aria-label="Add project"
        >
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Prototype: submitting creates the project in this page only. Nothing
            is saved to a server yet.
          </p>
          <ProjectBasicInformationForm
            values={values}
            errors={errors}
            onChange={onChange}
            previewCode={previewCode}
          />
          <ProjectLocationForm
            values={values}
            errors={errors}
            onChange={onChange}
          />
          <ProjectTimelineForm
            values={values}
            errors={errors}
            onChange={onChange}
          />
          <ProjectBudgetForm
            values={values}
            errors={errors}
            onChange={onChange}
          />
          <ProjectStatusForm
            values={values}
            errors={errors}
            onChange={onChange}
          />
          {submitError ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
              {submitError}
            </p>
          ) : null}
          <ProjectFormActions submitting={submitting} errorCount={errorCount} />
        </form>
      )}
    </div>
  );
}
