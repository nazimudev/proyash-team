// Routes referenced by the Project Management page. Some pages do not exist yet (see the delivery notes).
export const PROJECT_ROUTES = {
  list: "/admin/projects",
  create: "/admin/projects/create", // separate Add Project page, built later
  edit: (id) => `/admin/projects/${id}/edit`, // not built yet
  expenses: (id) => `/admin/expenses?project=${id}`, // the Expenses page exists but does not read this query yet
};

// Project expenses are derived from expense records (the single source of truth), never typed onto a project.
// Replace `expenses` with data from the Laravel API later, or use per-project totals the API supplies.
export function attachExpenseTotals(projects, expenses) {
  const totals = {};
  for (const x of expenses)
    if (x.type === "project" && x.projectId)
      totals[x.projectId] = (totals[x.projectId] ?? 0) + x.amount;
  return projects.map((pr) => ({ ...pr, totalExpenses: totals[pr.id] ?? 0 }));
}

export const remainingBudget = (pr) => pr.budget - pr.totalExpenses; // may be negative; callers show overspend explicitly

export function calculateProjectSummary(projects) {
  const count = (s) => projects.filter((x) => x.status === s).length;
  return {
    total: projects.length,
    completed: count("Completed"),
    running: count("In Progress"),
    planned: count("Planned"),
  };
}

export function calculateFinancials(projects) {
  const budget = projects.reduce((s, x) => s + x.budget, 0);
  const expenses = projects.reduce((s, x) => s + x.totalExpenses, 0);
  const remaining = budget - expenses;
  const spentPercent =
    budget > 0 ? (expenses / budget) * 100 : expenses > 0 ? 100 : 0; // safe for a zero budget
  return {
    budget,
    expenses,
    remaining: Math.max(0, remaining),
    overspend: Math.max(0, -remaining),
    spentPercent,
  };
}

export const EMPTY_PROJECT_FILTERS = {
  search: "",
  status: "all",
  category: "all",
  sort: "start-desc",
};

export const SORT_OPTIONS = [
  { value: "start-desc", label: "Start date (newest)" },
  { value: "start-asc", label: "Start date (oldest)" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "budget-desc", label: "Budget (high to low)" },
  { value: "budget-asc", label: "Budget (low to high)" },
  { value: "expenses-desc", label: "Expenses (high to low)" },
  { value: "expenses-asc", label: "Expenses (low to high)" },
];

const safeString = (value) => String(value ?? "");

const sorters = {
  "start-desc": (a, b) =>
    safeString(b.startDate).localeCompare(safeString(a.startDate)),

  "start-asc": (a, b) =>
    safeString(a.startDate).localeCompare(safeString(b.startDate)),

  "name-asc": (a, b) => safeString(a.name).localeCompare(safeString(b.name)),

  "name-desc": (a, b) => safeString(b.name).localeCompare(safeString(a.name)),

  "budget-desc": (a, b) => b.budget - a.budget,

  "budget-asc": (a, b) => a.budget - b.budget,

  "expenses-desc": (a, b) => b.totalExpenses - a.totalExpenses,

  "expenses-asc": (a, b) => a.totalExpenses - b.totalExpenses,
};

export function filterAndSortProjects(projects, f) {
  const q = f.search.trim().toLowerCase();
  return projects
    .filter(
      (x) =>
        (f.status === "all" || x.status === f.status) &&
        (f.category === "all" || x.category === f.category) &&
        (!q ||
          [x.name, x.id, x.code, x.location, x.responsiblePerson]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    )
    .sort(sorters[f.sort] ?? sorters["start-desc"]);
}

export function normalizeProject(project) {
  return {
    ...project,
    id: project.id,
    code: project.project_id ?? "",
    name: project.name ?? "",
    category: project.category.name ?? "",
    location: project.location ?? "",
    responsiblePerson: project.responsible_person ?? "",
    startDate: project.start_date ?? "",
    endDate: project.expected_end_date ?? "",
    budget: Number(project.allocated_budget ?? 0),
    totalExpenses: Number(project.total_expenses ?? 0),
    progress: Number(project.progress ?? 0),
    status: normalizeStatus(project.status),
  };
}

function normalizeStatus(status) {
  const statuses = {
    planned: "Planned",
    in_progress: "In Progress",
    complete: "Completed",
    cancelled: "Cancelled",
  };

  return statuses[status] ?? status ?? "Planned";
}
