"use client";

import { useState } from "react";
import { STATUS_META, formatDate, getInitials } from "@/lib/memberRequestUtils";
import { btnPrimary, btnSecondary } from "./ModalShell";
import Image from "next/image";

export function Avatar({ app, size = "h-10 w-10" }) {
  const [failed, setFailed] = useState(false);

  const photo = app.profile_photo_url;

  if (photo && !failed) {
    return (
      <Image
        src={photo}
        alt={app.full_name_en || "Member"}
        width={80}
        height={80}
        unoptimized
        onError={() => setFailed(true)}
        className={`${size} shrink-0 rounded-full border border-gray-200 object-cover`}
      />
    );
  }

  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700`}
    >
      {getInitials(app.full_name_en)}
    </span>
  );
}

export function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

const Missing = () => <span className="text-gray-400">Not provided</span>;

function Actions({ app, onView, onReview, onDelete }) {
  const pending = app.status === "pending";

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <button
        type="button"
        onClick={() => onView(app)}
        className={`${btnSecondary} px-3 py-1.5`}
      >
        View Application
      </button>

      {pending ? (
        <button
          type="button"
          onClick={() => onReview(app)}
          className={`${btnPrimary} px-3 py-1.5`}
        >
          Review Request
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onDelete(app)}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Delete
        </button>
      )}
    </div>
  );
}

const HEADERS = [
  "Applicant",
  "Mobile Number",
  "Email",
  "Submitted Date",
  "Status",
  "Actions",
];

export default function RequestsTable({ applications, onView, onReview, onDelete }) {
  console.log(applications);
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-225 text-left text-sm">
          <caption className="sr-only">Membership applications</caption>
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
            {applications.map((x) => (
              <tr key={x.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar app={x} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {x.user.name}
                      </p>
                      {/* <p className="text-xs text-gray-500">{x.id}</p> */}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {x.mobile_number ?? <Missing />}
                </td>
                <td className="max-w-56 wrap-break-word px-4 py-3 text-gray-700">
                  {x.user.email ?? <Missing />}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatDate(x.created_at)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={x.status} />
                </td>
                <td className="px-4 py-3">
                  <Actions
                    app={x}
                    onView={onView}
                    onReview={onReview}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-gray-100 md:hidden">
        {applications.map((x) => (
          <li key={x.id} className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Avatar app={x} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {x.full_name_en}
                    </p>
                    <p className="text-xs text-gray-500">{x.id}</p>
                  </div>
                  <StatusBadge status={x.status} />
                </div>
                <p className="mt-1 text-sm text-gray-700">
                  {x.mobile_number ?? <Missing />}
                </p>
                <p className="break-all text-sm text-gray-700">
                  {x.email ?? <Missing />}
                </p>
                <p className="text-xs text-gray-500">
                  Submitted {formatDate(x.submitted_at)}
                </p>
              </div>
            </div>
            <Actions
              app={x}
              onView={onView}
              onReview={onReview}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
