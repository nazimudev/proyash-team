"use client";

import Modal, { btnSecondary } from "@/components/admin/donation/Modal";
import { ProjectStatusBadge, ProgressBar } from "./ProjectBadges";
import { formatCurrency, formatDate } from "@/lib/donationUtils";
import { remainingBudget } from "@/lib/projectUtils";
import Image from "next/image";

function Item({ label, children, wide }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs text-gray-500">{label}</dt>
      <dd className="mt-0.5 wrap-break-word text-sm text-gray-900">
        {children || <span className="text-gray-400">Not provided</span>}
      </dd>
    </div>
  );
}

export default function ProjectDetailsModal({ project, onClose }) {
  const x = project;
  const remaining = x ? remainingBudget(x) : 0;
  return (
    <Modal
      open={!!x}
      onClose={onClose}
      size="lg"
      title={x ? x.name : ""}
      description={x ? x.code : ""}
      footer={
        <button type="button" onClick={onClose} className={btnSecondary}>
          Close
        </button>
      }
    >
      {x ? (
        <div className="space-y-4">
          {x.coverImage ? (
            <Image
              src={x.coverImage}
              alt={`Cover for ${x.name}`}
              className="max-h-48 w-full rounded-lg border border-gray-200 object-cover"
            />
          ) : null}
          <dl className="grid gap-4 sm:grid-cols-2">
            <Item label="Category">{x.category}</Item>
            <Item label="Status">
              <ProjectStatusBadge status={x.status} />
            </Item>
            <Item label="Location">{x.location}</Item>
            <Item label="Responsible person">{x.responsiblePerson}</Item>
            <Item label="Start date">{formatDate(x.startDate)}</Item>
            <Item label="Expected completion">{formatDate(x.endDate)}</Item>
            <Item label="Progress">
              <ProgressBar value={x.progress} label="Project progress" />
            </Item>
            <Item label="Allocated budget">{formatCurrency(x.budget)}</Item>
            <Item label="Recorded expenses">
              {formatCurrency(x.totalExpenses)}
            </Item>
            <Item label={remaining < 0 ? "Over budget by" : "Remaining budget"}>
              <span
                className={remaining < 0 ? "font-semibold text-red-700" : ""}
              >
                {formatCurrency(Math.abs(remaining))}
              </span>
            </Item>
            <Item label="Description" wide>
              {x.description}
            </Item>
          </dl>
        </div>
      ) : null}
    </Modal>
  );
}
