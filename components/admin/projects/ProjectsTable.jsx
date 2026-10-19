"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, Eye, Pencil, Receipt, FolderSearch } from "lucide-react";
import EmptyState from "@/components/admin/ui/EmptyState";
import { ProjectStatusBadge, ProgressBar } from "./ProjectBadges";
import { formatCurrency, formatDate } from "@/lib/donationUtils";
import { PROJECT_ROUTES } from "@/lib/projectUtils";

const HEADERS = [
  "Project Name",
  "Category",
  "Location",
  "Responsible Person",
  "Start Date",
  "End Date",
  "Budget",
  "Total Expenses",
  "Progress",
  "Status",
  "Actions",
];

function ActionsMenu({ project, onView }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;

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
    menuRef.current?.querySelector('[role="menuitem"]')?.focus();
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
    const h = 3 * 38 + 16;
    setPos({
      top:
        r.bottom + h > window.innerHeight
          ? Math.max(8, r.top - h)
          : r.bottom + 4,
      left: Math.max(8, r.right - 176),
    });
  };
  const onMenuKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = [...menuRef.current.querySelectorAll('[role="menuitem"]')];
    const i = items.indexOf(document.activeElement);
    items[
      (i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
    ].focus();
  };
  const itemCls =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${project.name}`}
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
          className="fixed z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            className={itemCls}
            onClick={() => {
              setPos(null);
              onView(project);
            }}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            View Details
          </button>
          <Link
            href={PROJECT_ROUTES.edit(project.id)}
            role="menuitem"
            className={itemCls}
            onClick={() => setPos(null)}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Project
          </Link>
          <Link
            href={PROJECT_ROUTES.expenses(project.id)}
            role="menuitem"
            className={itemCls}
            onClick={() => setPos(null)}
          >
            <Receipt className="h-4 w-4" aria-hidden="true" />
            View Expenses
          </Link>
        </div>
      ) : null}
    </>
  );
}

export default function ProjectsTable({ projects, hasFilters, onView }) {
  if (projects.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={FolderSearch}
          title="No projects match these filters"
          description={
            hasFilters
              ? "Try a different search or clear the filters."
              : "Projects will appear here once they are added."
          }
        />
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-312.5 text-left text-sm">
        <caption className="sr-only">Projects</caption>
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
          {projects.map((x) => {
            const over = x.totalExpenses > x.budget;
            return (
              <tr key={x.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{x.name}</p>
                  <p className="text-xs text-gray-500">{x.code}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{x.category}</td>
                <td className="px-4 py-3 text-gray-700">{x.location}</td>
                <td className="px-4 py-3 text-gray-700">
                  {x.responsiblePerson}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDate(x.startDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDate(x.endDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                  {formatCurrency(x.budget)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`font-medium ${over ? "text-red-700" : "text-gray-900"}`}
                  >
                    {formatCurrency(x.totalExpenses)}
                  </span>
                  {over ? (
                    <p className="text-xs text-red-700">Over budget</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <ProgressBar
                    value={x.progress}
                    label={`${x.name} progress`}
                  />
                </td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge status={x.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu project={x} onView={onView} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
