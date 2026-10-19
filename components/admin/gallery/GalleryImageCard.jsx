"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, Pencil, Globe, EyeOff, Trash2, CalendarDays } from "lucide-react";
import GalleryImage from "./GalleryImage";
import { formatDate } from "@/lib/galleryUtils";

export function PhotoStatusBadge({ status }) {
  const published = status === "published";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${published ? "bg-green-50 text-green-800 ring-green-200" : "bg-amber-50 text-amber-800 ring-amber-200"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

const CategoryBadge = ({ category }) => <span className="inline-flex max-w-full truncate rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{category}</span>;

function ActionsMenu({ photo, onAction }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;
  const published = photo.status === "published";
  const items = [
    { key: "view", label: "View Photo", Icon: Eye },
    { key: "edit", label: "Edit Details", Icon: Pencil },
    { key: "toggle", label: published ? "Unpublish" : "Publish", Icon: published ? EyeOff : Globe },
    { key: "delete", label: "Delete Photo", Icon: Trash2, danger: true },
  ];

  useEffect(() => {
    if (!open) return;
    const close = () => setPos(null);
    const onDown = (e) => { if (!menuRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) close(); };
    const onKey = (e) => { if (e.key === "Escape") { close(); btnRef.current?.focus(); } };
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
    setPos({ top: r.bottom + h > window.innerHeight ? Math.max(8, r.top - h) : r.bottom + 4, left: Math.max(8, r.right - 176) });
  };
  const onMenuKey = (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const btns = [...menuRef.current.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    btns[(i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length].focus();
  };

  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={`Actions for ${photo.title}`}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div ref={menuRef} role="menu" onKeyDown={onMenuKey} style={{ top: pos.top, left: pos.left }} className="fixed z-50 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map(({ key, label, Icon, danger }) => (
            <button key={key} type="button" role="menuitem" onClick={() => { setPos(null); onAction(key, photo); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none ${danger ? "text-red-700" : "text-gray-700"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />{label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default function GalleryImageCard({ photo, view, onAction }) {
  const date = formatDate(photo.activity_date);
  const open = () => onAction("view", photo);

  if (view === "list") {
    return (
      <li className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5">
        <button type="button" onClick={open} aria-label={`View ${photo.title}`} className="shrink-0 overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
          <GalleryImage photo={photo} className="h-16 w-20" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{photo.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <CategoryBadge category={photo.category} />
            <PhotoStatusBadge status={photo.status} />
            {date ? <span className="text-xs text-gray-500">{date}</span> : null}
          </div>
        </div>
        <ActionsMenu photo={photo} onAction={onAction} />
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <button type="button" onClick={open} aria-label={`View ${photo.title}`} className="block w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-600">
        <GalleryImage photo={photo} className="aspect-[4/3] w-full" />
      </button>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-1">
          <p className="line-clamp-2 text-sm font-medium text-gray-900">{photo.title}</p>
          <ActionsMenu photo={photo} onAction={onAction} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryBadge category={photo.category} />
          <PhotoStatusBadge status={photo.status} />
        </div>
        {date ? <p className="flex items-center gap-1 text-xs text-gray-500"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{date}</p> : null}
      </div>
    </li>
  );
}
