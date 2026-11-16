/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Download } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/admin/ui/PageHeader";
import { btnPrimary, btnSecondary } from "@/components/admin/donation/Modal";

import ExpenseSummaryCards from "./ExpenseSummaryCards";
import ExpenseFilters from "./ExpenseFilters";
import ExpensesTable from "./ExpensesTable";
import ExpenseFormModal from "./ExpenseFormModal";
import ExpenseDetailsModal from "./ExpenseDetailsModal";
import DeleteExpenseDialog from "./DeleteExpenseDialog";

import { todayIso } from "@/lib/donationUtils";

import { fetchProjects } from "@/services/projectService";
import { fetchActiveExpenseCategories } from "@/services/categoryExpenceService";

import {
  createExpense,
  updateExpense,
  deleteExpense,
  fetchExpenses,
} from "@/services/expenseService";

import {
  EMPTY_EXPENSE_FILTERS,
  calculateExpenseSummary,
  filterExpenses,
  dateRangeError,
  emptyExpenseValues,
  expenseToValues,
  valuesToExpense,
  expensesToCsv,
  downloadCsv,
  mapExpenseFromApi,
} from "@/lib/expenseUtils";

export default function ExpensesPage() {
  // API data
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading states
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Filters and pagination
  const [filters, setFilters] = useState(EMPTY_EXPENSE_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Summary
  const [currentMonth, setCurrentMonth] = useState("");

  // Dialog
  const [dialog, setDialog] = useState(null);

  // Fetch expenses
  const loadExpenses = async () => {
    try {
      const result = await fetchExpenses();
      setExpenses(result.data || []);
      const list = Array.isArray(result) ? result : (result?.data ?? []);
      setExpenses(list.map(mapExpenseFromApi));
    } catch (error) {
      console.error("Expenses loading failed:", error);
      toast.error(error.message || "Failed to load expenses.");
    } finally {
      setLoadingExpenses(false);
    }
  };

  // Fetch projects
  const loadProjects = async () => {
    try {
      const result = await fetchProjects();
      setProjects(result || []);
    } catch (error) {
      console.error("Projects loading failed:", error);
      toast.error("Failed to load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch categories
  const loadCategories = async () => {
    try {
      const result = await fetchActiveExpenseCategories();
      setCategories(result || []);
    } catch (error) {
      console.error("Categories loading failed:", error);
      toast.error("Failed to load expense categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Initial API loading
  useEffect(() => {
    loadExpenses();
    loadProjects();
    loadCategories();

    setCurrentMonth(todayIso().slice(0, 7));
  }, []);

  // Dialog
  const close = () => setDialog(null);

  const onAction = (type, expense) => {
    if (type === "edit") {
      setDialog({
        type,
        expense,
        values: expenseToValues(expense),
      });
      return;
    }

    setDialog({ type, expense });
  };

  // Create / Update
  
const handleExpenseSubmit = async (values) => {
  try {
    const data = {
      title: values.title.trim(),

      expense_category_id: Number(values.category_id),

      // Laravel field names
      expense_type: values.type,

      project_id: values.type === "project" ? Number(values.projectId) : null,

      amount: Number(values.amount),

      expense_date: values.date,

      payment_method: values.paymentMethod,

      paid_to: values.paidTo?.trim() || null,

      description: values.description?.trim() || null,

      receipt: values.receiptFile || null,
    };

    console.log("Sending Expense Data:", data);

    if (dialog.type === "edit") {
      await updateExpense(dialog.expense.id, data);
      toast.success("Expense updated successfully.");
    } else {
      await createExpense(data);
      toast.success("Expense created successfully.");
    }

    await loadExpenses();
    close();
  } catch (error) {
    console.error("Expense Error:", error);
    console.error("Validation Errors:", error.errors);

    toast.error(error.message || "Failed to save expense.");
  }
};


  // Delete
  const confirmDelete = async () => {
    if (!dialog?.expense) return;

    try {
      await deleteExpense(dialog.expense.id);

      toast.success("Expense deleted successfully.");

      close();

      await loadExpenses();
    } catch (error) {
      console.error("Expense deletion failed:", error);
      toast.error(error.message || "Failed to delete expense.");
    }
  };

  // Project names for table, details and CSV
  const projectNames = useMemo(
    () =>
      Object.fromEntries(
        projects.map((project) => [
          String(project.id),
          project.project_name ?? project.name,
        ]),
      ),
    [projects],
  );

  // Category names for table and CSV
  const categoryNames = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [String(category.id), category.name]),
      ),
    [categories],
  );

  // Summary
  const summary = useMemo(
    () => calculateExpenseSummary(expenses, currentMonth),
    [expenses, currentMonth],
  );

  // Filter expenses
  const filtered = useMemo(
    () => filterExpenses(expenses, filters),
    [expenses, filters],
  );

  const hasFilters =
    JSON.stringify(filters) !== JSON.stringify(EMPTY_EXPENSE_FILTERS);

  const changeFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPage(1);
  };

  // CSV export
  const exportCsv = () => {
    if (!filtered.length) {
      toast.error("No expenses available to export.");
      return;
    }

    const csv = expensesToCsv(filtered, projectNames, categoryNames);

    downloadCsv(csv, "expenses-export.csv");

    toast.success(`${filtered.length} expense(s) exported successfully.`);
  };

  return (
    <div>
      <PageHeader
        title="Expenses Management"
        description="Track, organize, and manage organizational expenses."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className={btnSecondary}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={() =>
                setDialog({
                  type: "add",
                  values: emptyExpenseValues(todayIso()),
                })
              }
              disabled={loadingCategories || categories.length === 0}
              className={btnPrimary}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        }
      />

      {/* Summary */}
      <div className="mb-6">
        <ExpenseSummaryCards summary={summary} />
      </div>

      {/* Expenses */}
      <section
        className="rounded-xl border border-gray-200 bg-white"
        aria-label="Expenses"
      >
        <ExpenseFilters
          filters={filters}
          onChange={changeFilter}
          onReset={() => {
            setFilters(EMPTY_EXPENSE_FILTERS);
            setPage(1);
          }}
          projects={projects}
          categories={categories}
          rangeError={dateRangeError(filters)}
          hasFilters={hasFilters}
        />

        {loadingExpenses ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Loading expenses...
          </div>
        ) : (
          <ExpensesTable
            expenses={filtered}
            totalCount={filtered.length}
            projectNames={projectNames}
            categoryNames={categoryNames}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
            onAction={onAction}
            hasFilters={hasFilters}
          />
        )}
      </section>

      {/* Add / Edit */}
      <ExpenseFormModal
        open={dialog?.type === "add" || dialog?.type === "edit"}
        mode={dialog?.type}
        initialValues={dialog?.values}
        expense={dialog?.expense}
        projects={projects}
        categories={categories}
        loadingCategories={loadingCategories}
        onCancel={close}
        onSubmit={handleExpenseSubmit}
      />

      {/* Details */}
      <ExpenseDetailsModal
        expense={dialog?.type === "view" ? dialog.expense : null}
        projectName={
          dialog?.expense?.projectId
            ? projectNames[String(dialog.expense.projectId)]
            : null
        }
        onClose={close}
      />

      {/* Delete */}
      <DeleteExpenseDialog
        expense={dialog?.type === "delete" ? dialog.expense : null}
        onCancel={close}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
