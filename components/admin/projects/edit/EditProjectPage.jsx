"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

import PageHeader from "@/components/admin/ui/PageHeader";
import { btnPrimary, btnSecondary } from "@/components/admin/donation/Modal";

import ProjectBasicInformationForm from "../ProjectBasicInformationForm";
import ProjectLocationForm from "../ProjectLocationForm";
import ProjectTimelineForm from "../ProjectTimelineForm";
import ProjectBudgetForm from "../ProjectBudgetForm";
import ProjectStatusForm from "../ProjectStatusForm";
import ProjectFormActions from "../ProjectFormActions";

import { PROJECT_ROUTES } from "@/lib/projectUtils";

import {
  emptyProjectForm,
  validateProjectForm,
  formToProject,
  FIELD_ORDER,
} from "@/lib/projectFormUtils";

import { fetchProjectById, updateProject } from "@/services/projectService";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [values, setValues] = useState(emptyProjectForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [projectName, setProjectName] = useState("");

  const inFlight = useRef(false);

  // Load existing project
  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        const response = await fetchProjectById(id);

        const project = response.data;

        if (!mounted) return;

        setProjectName(project.name);

        // Map Laravel fields to existing form fields
        setValues({
          ...emptyProjectForm(),

          name: project.name ?? "",
          project_id: project.project_id ?? "",
          category: project.category.name ? String(project.category.name) : "",
          description: project.description ?? "",
          location: project.location ?? "",
          responsiblePerson: project.responsible_person ?? "",
          contactPhone: project.contact_phone ?? "",

          startDate: project.start_date ?? "",
          endDate: project.expected_end_date ?? "",

          budget: String(project.allocated_budget ?? ""),
          fundingSource: project.funding_source ?? "",
          fundingDetails: project.funding_details ?? "",

          status: project.status ?? "planned",
          progress: String(project.progress ?? 0),

          internalNotes: project.internal_notes ?? "",

          // Keep existing image separately if your form supports it
          coverImage: project.cover_image ?? "",
        });
      } catch (error) {
        console.error(error);
        if (mounted) {
          setSubmitError(error.message || "Failed to load project.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) loadProject();

    return () => {
      mounted = false;
    };
  }, [id]);

  const onChange = (name, value) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (inFlight.current) return;

    const found = validateProjectForm(values);
    setErrors(found);

    const first = FIELD_ORDER.find((key) => found[key]);

    if (first) {
      document.getElementById(`pf-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = formToProject(values);

      await updateProject(id, payload);

      setUpdated(true);
    } catch (error) {
      console.error(error);
      setSubmitError(error.message || "Failed to update project.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl py-12 text-center text-gray-500">
        Loading project information...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Breadcrumb" className="mb-2 text-sm text-gray-500">
        Dashboard / Projects / Edit Project
      </nav>

      <PageHeader
        title="Edit Project"
        description="Update project information, timeline, budget, and progress."
        action={
          <Link href={PROJECT_ROUTES.list} className={btnSecondary}>
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        }
      />

      {updated ? (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-700" />

            <div className="space-y-3 text-sm text-green-900">
              <h2 className="text-base font-semibold">
                Project updated successfully!
              </h2>

              <p>{projectName} has been updated.</p>

              <Link href={PROJECT_ROUTES.list} className={btnPrimary}>
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          noValidate
          className="space-y-6"
          aria-label="Edit project"
        >
          <ProjectBasicInformationForm
            values={values}
            errors={errors}
            onChange={onChange}
            previewCode={values.project_id || ""}
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

          {submitError && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {submitError}
            </p>
          )}

          <ProjectFormActions
            submitting={submitting}
            errorCount={Object.values(errors).filter(Boolean).length}
          />
        </form>
      )}
    </div>
  );
}
