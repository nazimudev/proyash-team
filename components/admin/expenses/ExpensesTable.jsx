"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EmptyState from "@/components/admin/ui/EmptyState";
import { btnSecondary, inputCls } from "@/components/admin/donation/Modal";
import { formatCurrency, formatDate } from "@/lib/donationUtils";

export function TypeBadge({ type }) {
  return type === "project" ? (
    <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-200">
      Project Expense
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
      General Expense
    </span>
  );
}
export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
      {category}
    </span>
  );
}

function ActionsMenu({ expense, onAction }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;
  const items = [
    { key: "view", label: "View", Icon: Eye },
    { key: "edit", label: "Edit", Icon: Pencil },
    { key: "delete", label: "Delete", Icon: Trash2, danger: true },
  ];

  useEffect(() => {
    if (!open) return;
    const close = () => setPos(null);
    const onDown = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !btnRef.current?.contains(e.target)
      )
        close();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    menuRef.current?.querySelector("button")?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const toggle = () => {
    if (open) return setPos(null);
    const r = btnRef.current.getBoundingClientRect();
    const h = items.length * 38 + 16;
    setPos({
      top:
        r.bottom + h > window.innerHeight
          ? Math.max(8, r.top - h)
          : r.bottom + 4,
      left: Math.max(8, r.right - 160),
    });
  };
  const onMenuKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = [...menuRef.current.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    btns[
      (i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length
    ].focus();
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${expense.id}`}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          onKeyDown={onMenuKey}
          style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {items.map(({ key, label, Icon, danger }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              onClick={() => {
                setPos(null);
                onAction(key, expense);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none ${danger ? "text-red-700" : "text-gray-700"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

const PAGE_SIZES = [5, 10, 25];
const HEADERS = [
  "Expense ID",
  "Expense Title",
  "Category",
  "Expense Type",
  "Project",
  "Amount",
  "Expense Date",
  "Payment Method",
  "Paid To",
  "Actions",
];

export default function ExpensesTable({
  expenses,
  projectNames,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onAction,
  hasFilters,
}) {
  if (expenses.length === 0 && totalCount === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Inbox}
          title="No expenses match these filters"
          description={
            hasFilters
              ? "Try a different search or clear the filters."
              : "Add an expense to get started."
          }
        />
      </div>
    );
  }
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = expenses.slice(start, start + pageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-275 text-left text-sm">
          <caption className="sr-only">Expenses</caption>
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              {HEADERS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-4 py-3 font-medium ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((x) => (
              <tr key={x.id} className="hover:bg-gray-50/60">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {x.id}
                </td>
                <td className="px-4 py-3 text-gray-900">{x.title}</td>
                <td className="px-4 py-3">
                  <CategoryBadge category={x.category} />
                </td>
                <td className="px-4 py-3">
                  <TypeBadge type={x.type} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {x.projectId
                    ? (projectNames[x.projectId] ?? x.projectId)
                    : "General Expense"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {formatCurrency(x.amount)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDate(x.date)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {x.paymentMethod}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {x.paidTo || (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu expense={x} onAction={onAction} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {start + 1}–{start + rows.length} of {totalCount} expense
          {totalCount === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`${inputCls} w-auto py-1`}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <span>
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage <= 1}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
          </button>
          <button
            type="button"
            className={btnSecondary}
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage >= totalPages}
          >
            Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
