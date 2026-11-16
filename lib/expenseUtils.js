import { EXPENSE_PAYMENT_METHODS } from "@/data/expenseOptions";

export const EMPTY_EXPENSE_FILTERS = {
  search: "",
  category: "all",
  type: "all",
  project: "all",
  method: "all",
  startDate: "",
  endDate: "",
};
export const RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;

// Summary covers ALL recorded expenses and is not affected by the table filters.
// `currentMonth` is "YYYY-MM", set from an effect so nothing reads the clock during render.

export function calculateExpenseSummary(expenses, currentMonth) {
  const sum = (list) => list.reduce((s, x) => s + Number(x.amount || 0), 0);

  return {
    total: sum(expenses),

    thisMonth: currentMonth
      ? sum(
          expenses.filter((x) =>
            (x.date ?? x.expense_date ?? "").startsWith(currentMonth),
          ),
        )
      : null,

    project: sum(
      expenses.filter((x) => (x.type ?? x.expense_type) === "project"),
    ),

    general: sum(
      expenses.filter((x) => (x.type ?? x.expense_type) === "general"),
    ),
  };
}


export const dateRangeError = (f) =>
  f.startDate && f.endDate && f.startDate > f.endDate
    ? "Start date must be on or before the end date."
    : null;

export function filterExpenses(expenses, f) {
  const q = f.search.trim().toLowerCase();
  const rangeOk = !dateRangeError(f);
  return expenses
    .filter((x) => {
      if (f.category !== "all" && x.category !== f.category) return false;
      if (f.type !== "all" && x.type !== f.type) return false;
      if (f.project !== "all" && x.projectId !== f.project) return false;
      if (f.method !== "all" && x.paymentMethod !== f.method) return false;
      if (rangeOk && f.startDate && x.date < f.startDate) return false;
      if (rangeOk && f.endDate && x.date > f.endDate) return false;
      if (
        q &&
        ![x.id, x.title, x.paidTo, x.description]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

export function nextExpenseId(expenses) {
  const max = expenses.reduce(
    (m, x) => Math.max(m, Number(x.id.replace(/\D/g, "")) || 0),
    0,
  );
  return `EXP-${String(max + 1).padStart(4, "0")}`;
}

export const emptyExpenseValues = (today = "") => ({
  title: "",
  category_id: "",
  type: "general",
  projectId: "",
  amount: "",
  date: today,
  paymentMethod: "",
  paidTo: "",
  description: "",
  receiptFile: null,
  receiptName: null,
});


export const expenseToValues = (x) => ({
  title: x.title ?? "",

  category_id: String(x.expense_category_id ?? x.category_id ?? ""),

  type: x.expense_type ?? x.type ?? "general",

  projectId: String(x.project_id ?? x.projectId ?? ""),

  amount: String(x.amount ?? ""),

  date: (x.expense_date ?? x.date ?? "").slice(0, 10),

  paymentMethod: x.payment_method ?? x.paymentMethod ?? "",

  paidTo: x.paid_to ?? x.paidTo ?? "",

  description: x.description ?? "",

  receiptFile: null,

  receiptName: x.receipt_path ?? x.receipt_name ?? null,
});


export function validateExpenseForm(v, categories = []) {
  const e = {};

  if (!v.title.trim()) {
    e.title = "Enter an expense title.";
  } else if (v.title.trim().length > 120) {
    e.title = "Use 120 characters or fewer.";
  }

  // Category ID Validation
  const categoryExists = categories.some(
    (category) => Number(category.id) === Number(v.category_id),
  );

  if (!v.category_id || !categoryExists) {
    e.category_id = "Choose a valid expense category.";
  }

  if (v.type === "project" && !v.projectId) {
    e.projectId = "Choose the project this expense belongs to.";
  }

  const amount = Number(v.amount);

  if (!v.amount.trim() || !Number.isFinite(amount) || amount <= 0) {
    e.amount = "Enter an amount greater than zero.";
  }

  if (!v.date) {
    e.date = "Choose the expense date.";
  }

  if (!EXPENSE_PAYMENT_METHODS.includes(v.paymentMethod)) {
    e.paymentMethod = "Choose a payment method.";
  }

  if (v.description.length > 1000) {
    e.description = "Use 1,000 characters or fewer.";
  }

  if (v.receiptFile) {
    if (!RECEIPT_TYPES.includes(v.receiptFile.type)) {
      e.receipt = "Choose a JPG, PNG, WebP, or PDF file.";
    } else if (v.receiptFile.size > RECEIPT_MAX_BYTES) {
      e.receipt = "The file must be 5 MB or smaller.";
    }
  }

  return e;
}

// Only the file NAME is kept; the file itself is not stored anywhere.

export function valuesToExpense(v) {
  return {
    title: v.title.trim(),
    expense_category_id: Number(v.category_id),

    // Laravel Controller field
    expense_type: v.type,

    project_id: v.type === "project" ? Number(v.projectId) : null,

    amount: Number(v.amount),

    // Laravel Controller field
    expense_date: v.date,

    payment_method: v.paymentMethod,
    paid_to: v.paidTo.trim() || null,
    description: v.description.trim() || null,

    // Receipt file
    receipt: v.receiptFile || null,
  };
}


// CSV cells beginning with = + - @ are prefixed so spreadsheets don't treat them as formulas.
const cell = (v) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function expensesToCsv(rows, projectNames) {
  const head = [
    "Expense ID",
    "Title",
    "Category",
    "Type",
    "Project",
    "Amount (BDT)",
    "Date",
    "Payment Method",
    "Paid To",
    "Description",
  ];
  const lines = rows.map((x) =>
    [
      x.id,
      x.title,
      x.category,
      x.type === "project" ? "Project Expense" : "General Expense",
      x.projectId
        ? (projectNames[x.projectId] ?? x.projectId)
        : "General Expense",
      x.amount,
      x.date,
      x.paymentMethod,
      x.paidTo,
      x.description,
    ]
      .map(cell)
      .join(","),
  );
  return "\uFEFF" + [head.map(cell).join(","), ...lines].join("\r\n");
}

export function downloadCsv(csv, filename) {
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


export function mapExpenseFromApi(x) {
  return {
    id: String(x.id),
    title: x.title ?? "",

    category_id: x.expense_category_id,
    category: x.category?.name ?? "",

    type: x.expense_type ?? "general",

    projectId: String(x.project_id ?? ""),
    project: x.project?.name ?? "",

    amount: Number(x.amount ?? 0),

    date: (x.expense_date ?? "").slice(0, 10),

    paymentMethod: x.payment_method ?? "",
    paidTo: x.paid_to ?? "",
    description: x.description ?? "",

    receiptName: x.receipt_path ?? null,
    createdBy: x.creator?.name ?? "",
  };
}
