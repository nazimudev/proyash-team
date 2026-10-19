/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Download, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/admin/ui/PageHeader";
import { btnPrimary, btnSecondary } from "@/components/admin/donation/Modal";
import ExpenseSummaryCards from "./ExpenseSummaryCards";
import ExpenseFilters from "./ExpenseFilters";
import ExpensesTable from "./ExpensesTable";
import ExpenseFormModal from "./ExpenseFormModal";
import ExpenseDetailsModal from "./ExpenseDetailsModal";
import DeleteExpenseDialog from "./DeleteExpenseDialog";
import { demoExpenses } from "@/data/expenses";
import { sampleExpenseProjects } from "@/data/expenseOptions";
import { todayIso } from "@/lib/donationUtils";
import {
  EMPTY_EXPENSE_FILTERS, calculateExpenseSummary, filterExpenses, dateRangeError, nextExpenseId,
  emptyExpenseValues, expenseToValues, valuesToExpense, expensesToCsv, downloadCsv,
} from "@/lib/expenseUtils";

// Data handling lives in these small functions so each can later be swapped for an API call.
// Today they only touch React state.
const createExpenseLocal = (list, data) => [{ ...data, id: nextExpenseId(list) }, ...list];
const updateExpenseLocal = (list, id, data) => list.map((x) => (x.id === id ? { ...x, ...data } : x));
const deleteExpenseLocal = (list, id) => list.filter((x) => x.id !== id);

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(demoExpenses);
  const [filters, setFilters] = useState(EMPTY_EXPENSE_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [currentMonth, setCurrentMonth] = useState(null); // set in an effect so prerendering never reads the date
  const [dialog, setDialog] = useState(null); // { type: add|edit|view|delete, expense?, values? }
  const [toast, setToast] = useState(null);

  useEffect(() => { setCurrentMonth(todayIso().slice(0, 7)); }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const projectNames = useMemo(() => Object.fromEntries(sampleExpenseProjects.map((p) => [p.id, p.name])), []);
  const summary = useMemo(() => calculateExpenseSummary(expenses, currentMonth), [expenses, currentMonth]);
  const filtered = useMemo(() => filterExpenses(expenses, filters), [expenses, filters]);
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_EXPENSE_FILTERS);

  const changeFilter = (key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); };
  const close = () => setDialog(null);

  const onAction = (type, expense) => {
    if (type === "edit") return setDialog({ type, expense, values: expenseToValues(expense) });
    setDialog({ type, expense });
  };

  const save = (values) => {
    const data = valuesToExpense(values);
    if (dialog.type === "edit") setExpenses((l) => updateExpenseLocal(l, dialog.expense.id, data));
    else { setExpenses((l) => createExpenseLocal(l, data)); setPage(1); }
    setToast(dialog.type === "edit" ? "Expense updated." : "Expense added.");
    close();
  };

  const confirmDelete = () => {
    const { expense } = dialog;
    setExpenses((l) => deleteExpenseLocal(l, expense.id));
    setToast(`${expense.id} deleted.`);
    close();
  };

  const exportCsv = () => { downloadCsv(expensesToCsv(filtered, projectNames), "expenses-export.csv"); setToast(`Exported ${filtered.length} expense${filtered.length === 1 ? "" : "s"}.`); };

  return (
    <div>
      <PageHeader
        title="Expenses Management"
        description="Track, organize, and manage organizational expenses."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className={btnSecondary}>
              <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
            </button>
            <button type="button" onClick={() => setDialog({ type: "add", values: emptyExpenseValues(todayIso()) })} className={btnPrimary}>
              <Plus className="h-4 w-4" aria-hidden="true" /> Add Expense
            </button>
          </div>
        }
      />
      <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Demo data only. Changes live in this browser session and are lost on reload. Summary cards cover all recorded expenses, not just the filtered rows.
      </p>

      <div className="mb-6"><ExpenseSummaryCards summary={summary} /></div>

      <section className="rounded-xl border border-gray-200 bg-white" aria-label="Expenses">
        <ExpenseFilters filters={filters} onChange={changeFilter} onReset={() => { setFilters(EMPTY_EXPENSE_FILTERS); setPage(1); }}
          projects={sampleExpenseProjects} rangeError={dateRangeError(filters)} hasFilters={hasFilters} />
        <ExpensesTable expenses={filtered} totalCount={filtered.length} projectNames={projectNames} page={page} pageSize={pageSize}
          onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} onAction={onAction} hasFilters={hasFilters} />
      </section>

      <ExpenseFormModal open={dialog?.type === "add" || dialog?.type === "edit"} mode={dialog?.type} initialValues={dialog?.values}
        expense={dialog?.expense} projects={sampleExpenseProjects} onCancel={close} onSubmit={save} />
      <ExpenseDetailsModal expense={dialog?.type === "view" ? dialog.expense : null}
        projectName={dialog?.expense?.projectId ? projectNames[dialog.expense.projectId] : null} onClose={close} />
      <DeleteExpenseDialog expense={dialog?.type === "delete" ? dialog.expense : null} onCancel={close} onConfirm={confirmDelete} />

      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-60">
        {toast ? (
          <div className="pointer-events-auto flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />{toast}
          </div>
        ) : null}
      </div>
    </div>
  );
}
