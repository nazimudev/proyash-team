"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, Pencil } from "lucide-react";
import { formatJoinDate, getInitials } from "@/lib/memberUtils";
import Image from "next/image";

function Avatar({ member }) {
  const [failed, setFailed] = useState(false);
  if (member.photo && !failed) {
    return (
      <Image
        src={member.photo}
        alt=""
        onError={() => setFailed(true)}
        className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700"
    >
      {getInitials(member.name)}
    </span>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${active ? "bg-green-50 text-green-800 ring-green-200" : "bg-gray-100 text-gray-700 ring-gray-200"}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-600" : "bg-gray-400"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

const Missing = () => <span className="text-gray-400">Not provided</span>;

// View Details and Edit Member pages don't exist yet, so these items are clearly marked placeholders and do nothing.
function ActionsMenu({ member }) {
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
    const h = 2 * 40 + 44;
    setPos({
      top:
        r.bottom + h > window.innerHeight
          ? Math.max(8, r.top - h)
          : r.bottom + 4,
      left: Math.max(8, r.right - 208),
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
  const item =
    "flex w-full cursor-not-allowed items-center gap-2 px-3 py-2 text-left text-sm text-gray-400 focus-visible:bg-gray-50 focus-visible:outline-none";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${member.name}`}
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
          className="fixed z-50 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            aria-disabled="true"
            className={item}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            View Details
          </button>
          <button
            type="button"
            role="menuitem"
            aria-disabled="true"
            className={item}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit Member
          </button>
          <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-500">
            Placeholder. These pages aren&rsquo;t built yet.
          </p>
        </div>
      ) : null}
    </>
  );
}

const HEADERS = [
  "Member",
  "Member ID",
  "Phone",
  "Email",
  "Join Date",
  "Status",
  "Actions",
];

export default function MembersTable({ members }) {
  return (
    <>
      {/* Tablet and desktop: table, scrolls sideways when the screen is narrow */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-215 text-left text-sm">
          <caption className="sr-only">Members</caption>
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
            {members.map((x) => (
              <tr key={x.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar member={x} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {x.name}
                      </p>
                      <p className="text-xs text-gray-500">Proyash Member</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {x.memberId ?? <Missing />}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {x.phone ?? <Missing />}
                </td>
                <td className="max-w-[16rem] wrap-break-word px-4 py-3 text-gray-700">
                  {x.email ?? <Missing />}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {formatJoinDate(x.joinDate)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={x.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu member={x} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: compact cards */}
      <ul className="divide-y divide-gray-100 md:hidden">
        {members.map((x) => (
          <li key={x.id} className="flex items-start gap-3 p-4">
            <Avatar member={x} />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{x.name}</p>
                  <p className="text-xs text-gray-500">
                    Proyash Member{x.memberId ? ` · ${x.memberId}` : ""}
                  </p>
                </div>
                <ActionsMenu member={x} />
              </div>
              <p className="text-sm text-gray-700">{x.phone ?? <Missing />}</p>
              <p className="break-all text-sm text-gray-700">
                {x.email ?? <Missing />}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500">
                  Joined {formatJoinDate(x.joinDate)}
                </span>
                <StatusBadge status={x.status} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
