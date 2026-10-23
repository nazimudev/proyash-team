"use client";

import { Eye } from "lucide-react";
import { STATUS_META, formatDateTime } from "@/lib/contactMessageUtils";
import { btnSecondary } from "./ModalShell";

export function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.read;
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${m.cls}`}>{m.label}</span>;
}

const Missing = () => <span className="text-gray-400">Not provided</span>;
const HEADERS = ["Sender Name", "Phone Number", "Email Address", "Subject", "Message Preview", "Received Date", "Status", "Actions"];

export default function MessagesTable({ messages, onView }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <caption className="sr-only">Contact messages</caption>
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>{HEADERS.map((h) => <th key={h} scope="col" className={`px-4 py-3 font-medium ${h === "Actions" ? "text-right" : ""}`}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages.map((x) => {
              const isNew = x.status === "new";
              return (
                <tr key={x.id} onClick={() => onView(x)} className="cursor-pointer hover:bg-gray-50/60">
                  <td className={`px-4 py-3 text-gray-900 ${isNew ? "font-semibold" : "font-medium"}`}>{x.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{x.phone ?? <Missing />}</td>
                  <td className="max-w-[12rem] break-words px-4 py-3 text-gray-700">{x.email ?? <Missing />}</td>
                  <td className={`max-w-[14rem] px-4 py-3 text-gray-900 ${isNew ? "font-semibold" : ""}`}><span className="line-clamp-2 break-words">{x.subject}</span></td>
                  <td className="max-w-[18rem] px-4 py-3 text-gray-600"><span className="line-clamp-2 break-words">{x.message}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-700">{formatDateTime(x.created_at, { time: false })}</td>
                  <td className="px-4 py-3"><StatusBadge status={x.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={(e) => { e.stopPropagation(); onView(x); }} className={`${btnSecondary} px-3 py-1.5`}><Eye className="h-4 w-4" aria-hidden="true" />View Details</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-gray-100 md:hidden">
        {messages.map((x) => (
          <li key={x.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className={`truncate text-sm text-gray-900 ${x.status === "new" ? "font-semibold" : "font-medium"}`}>{x.name}</p>
                <p className="text-xs text-gray-500">{formatDateTime(x.created_at)}</p>
              </div>
              <StatusBadge status={x.status} />
            </div>
            <p className={`line-clamp-2 break-words text-sm text-gray-900 ${x.status === "new" ? "font-semibold" : ""}`}>{x.subject}</p>
            <p className="line-clamp-2 break-words text-sm text-gray-600">{x.message}</p>
            <button type="button" onClick={() => onView(x)} className={`${btnSecondary} px-3 py-1.5`}><Eye className="h-4 w-4" aria-hidden="true" />View Details</button>
          </li>
        ))}
      </ul>
    </>
  );
}
