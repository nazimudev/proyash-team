import { PROJECT_FORM_CATEGORIES } from "@/data/projectOptions";
import { PROJECT_STATUSES } from "@/data/projectOptions";

export const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const LIMITS = {
  name: [3, 150],
  description: 2000,
  location: 150,
  fundingDetails: 500,
  notes: 2000,
};
export const MAX_BUDGET = 1_000_000_000;

// Order used to focus the first invalid field.
export const FIELD_ORDER = [
  "name",
  "category",
  "description",
  "cover",
  "location",
  "contact",
  "startDate",
  "endDate",
  "actualCompletionDate",
  "budget",
  "fundingDetails",
  "status",
  "progress",
  "notes",
];

export const emptyProjectForm = () => ({
  name: "",
  category: "",
  description: "",
  coverFile: null,
  location: "",
  responsiblePerson: "",
  contact: "",
  startDate: "",
  endDate: "",
  actualCompletionDate: "",
  budget: "",
  fundingSource: "",
  fundingDetails: "",
  status: "Planned",
  progress: "0",
  notes: "",
});

// Preview only. The backend must assign the real, unique project ID.
export function nextPreviewCode(projects) {
  const max = projects.reduce(
    (m, p) => Math.max(m, Number(String(p.code ?? "").replace(/\D/g, "")) || 0),
    0,
  );
  return `PRJ-${String(max + 1).padStart(3, "0")}`;
}

// Progress rules: Planned is fixed at 0, Completed is fixed at 100, other statuses are editable.
export const progressLocked = (status) =>
  status === "Planned" || status === "Completed";

export function validateProjectForm(v) {
  const e = {};
  const name = v.name.trim();
  if (!name) e.name = "Enter a project name.";
  else if (name.length < LIMITS.name[0])
    e.name = `Use at least ${LIMITS.name[0]} characters.`;
  else if (name.length > LIMITS.name[1])
    e.name = `Use ${LIMITS.name[1]} characters or fewer.`;

  if (!PROJECT_FORM_CATEGORIES.includes(v.category))
    e.category = "Choose a project category.";

  if (!v.description.trim())
    e.description =
      "Describe the project's purpose, objectives, and planned activities.";
  else if (v.description.length > LIMITS.description)
    e.description = `Use ${LIMITS.description} characters or fewer.`;

  if (v.coverFile) {
    if (!COVER_TYPES.includes(v.coverFile.type))
      e.cover = "Choose a JPG, PNG, or WebP image.";
    else if (v.coverFile.size > COVER_MAX_BYTES)
      e.cover = "The image must be 5 MB or smaller.";
  }

  if (!v.location.trim()) e.location = "Enter the project location.";
  else if (v.location.trim().length > LIMITS.location)
    e.location = `Use ${LIMITS.location} characters or fewer.`;
  if (v.contact.trim() && !/^\+?[\d\s-]{7,15}$/.test(v.contact.trim()))
    e.contact = "Enter a valid phone number.";

  if (!v.startDate) e.startDate = "Choose a start date.";
  if (!v.endDate) e.endDate = "Choose the expected end date.";
  else if (v.startDate && v.endDate < v.startDate)
    e.endDate = "The end date can't be earlier than the start date.";
  if (
    v.status === "Completed" &&
    v.actualCompletionDate &&
    v.startDate &&
    v.actualCompletionDate < v.startDate
  )
    e.actualCompletionDate =
      "The completion date can't be earlier than the start date.";

  const budget = Number(v.budget);
  if (!v.budget.trim() || !Number.isFinite(budget))
    e.budget = "Enter the allocated budget.";
  else if (budget <= 0) e.budget = "The budget must be greater than zero.";
  else if (budget > MAX_BUDGET) e.budget = "Enter a smaller amount.";
  if (v.fundingDetails.length > LIMITS.fundingDetails)
    e.fundingDetails = `Use ${LIMITS.fundingDetails} characters or fewer.`;

  if (!PROJECT_STATUSES.includes(v.status)) e.status = "Choose a status.";
  if (!/^\d{1,3}$/.test(v.progress.trim()) || Number(v.progress) > 100)
    e.progress = "Enter a whole number from 0 to 100.";
  if (v.notes.length > LIMITS.notes)
    e.notes = `Use ${LIMITS.notes} characters or fewer.`;
  return e;
}

// Builds a project object shaped like the records on the Projects overview (data/projects.js), plus the new fields.
// `id` and `code` are placeholders: the backend must assign the permanent ones.
export function formToProject(v, previewCode) {
  const t = (s) => s.trim();
  return {
    id: null,
    code: previewCode,
    name: t(v.name),
    category: v.category,
    description: t(v.description),
    location: t(v.location),
    responsiblePerson: t(v.responsiblePerson),
    contact: t(v.contact),
    startDate: v.startDate,
    endDate: v.endDate,
    actualCompletionDate:
      v.status === "Completed" && v.actualCompletionDate
        ? v.actualCompletionDate
        : null,
    budget: Number(v.budget),
    fundingSource: v.fundingSource || null,
    fundingDetails: t(v.fundingDetails),
    status: v.status,
    progress: Number(v.progress),
    totalExpenses: 0, // new projects start at zero; real totals come from recorded expenses
    internalNotes: t(v.notes),
    coverImage: null, // the file is not uploaded or stored in this prototype
    coverImageMeta: v.coverFile
      ? {
          name: v.coverFile.name,
          type: v.coverFile.type,
          size: v.coverFile.size,
        }
      : null,
  };
}
