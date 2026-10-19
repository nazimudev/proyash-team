import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/admin/donation/Modal";
import { PROJECT_ROUTES } from "@/lib/projectUtils";

export default function ProjectFormActions({ submitting, errorCount }) {
  return (
    <div className="flex flex-col-reverse gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <p role="status" className="text-sm text-red-700">
        {errorCount > 0
          ? `Please fix ${errorCount} field${errorCount === 1 ? "" : "s"} before creating the project.`
          : ""}
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={PROJECT_ROUTES.list}
          className={btnSecondary}
          aria-disabled={submitting}
          tabIndex={submitting ? -1 : undefined}
        >
          Cancel
        </Link>
        <button type="submit" disabled={submitting} className={btnPrimary}>
          {submitting ? "Creating…" : "Create Project"}
        </button>
      </div>
    </div>
  );
}
