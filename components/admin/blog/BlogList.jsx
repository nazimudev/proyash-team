"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Globe,
  EyeOff,
  Star,
  ImageOff,
} from "lucide-react";
import {
  formatBlogDate,
  getBlogStatusLabel,
  getBlogStatusColor,
  getBlogImageUrl,
} from "@/utils/blogUtils";
import Image from "next/image";

function Thumb({ post, className }) {
  const url = getBlogImageUrl(post.featured_image);
  const [failed, setFailed] = useState(null);
  if (!url || failed === url) {
    return (
      <div
        role="img"
        aria-label="No image"
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
      >
        <ImageOff className="h-5 w-5" aria-hidden="true" />
      </div>
    );
  }
  return (
    <Image
      src={url}
      alt=""
      loading="lazy"
      width={120}
      height={80}
      onError={() => setFailed(url)}
      className={`object-cover ${className}`}
    />
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${getBlogStatusColor(status)}`}
    >
      {getBlogStatusLabel(status)}
    </span>
  );
}

const Featured = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700">
    <Star
      className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
      aria-hidden="true"
    />
    Featured
  </span>
);

function ActionsMenu({ post, pending, onEdit, onDelete, onTogglePublish }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;
  const published = post.status === "published";

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
    const btns = [...menuRef.current.querySelectorAll("button")];
    const i = btns.indexOf(document.activeElement);
    btns[
      (i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length
    ].focus();
  };
  const item =
    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none";

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${post.title}`}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-green-600 disabled:opacity-50"
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
            className={`${item} text-gray-700`}
            onClick={() => {
              setPos(null);
              onEdit(post);
            }}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${item} text-gray-700`}
            onClick={() => {
              setPos(null);
              onTogglePublish(post);
            }}
          >
            {published ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Globe className="h-4 w-4" aria-hidden="true" />
            )}
            {published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${item} text-red-700`}
            onClick={() => {
              setPos(null);
              onDelete(post);
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </div>
      ) : null}
    </>
  );
}

const HEADERS = [
  "Post",
  "Category",
  "Author",
  "Published",
  "Status",
  "Actions",
];

export default function BlogList({
  posts,
  pendingIds = [],
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  const pending = (p) => pendingIds.includes(p.id);
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-215 text-left text-sm">
          <caption className="sr-only">Blog and news posts</caption>
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
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Thumb post={p} className="h-12 w-16 shrink-0 rounded-md" />
                    <div className="min-w-0">
                      <p className="line-clamp-2 wrap-break-word font-medium text-gray-900">
                        {p.title}
                      </p>
                      {p.is_featured ? <Featured /> : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {p.category?.name ?? (
                    <span className="text-gray-400">Uncategorized</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {p.author_name || <span className="text-gray-400">—</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                  {p.published_at ? (
                    formatBlogDate(p.published_at)
                  ) : (
                    <span className="text-gray-400">Not published</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <ActionsMenu
                    post={p}
                    pending={pending(p)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePublish={onTogglePublish}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-gray-100 md:hidden">
        {posts.map((p) => (
          <li key={p.id} className="flex gap-3 p-4">
            <Thumb post={p} className="h-16 w-20 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-1">
                <p className="line-clamp-2 wrap-break-word text-sm font-medium text-gray-900">
                  {p.title}
                </p>
                <ActionsMenu
                  post={p}
                  pending={pending(p)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTogglePublish={onTogglePublish}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={p.status} />
                {p.is_featured ? <Featured /> : null}
              </div>
              <p className="text-xs text-gray-500">
                {p.category?.name ?? "Uncategorized"}
                {p.author_name ? ` · ${p.author_name}` : ""}
              </p>
              <p className="text-xs text-gray-500">
                {p.published_at
                  ? formatBlogDate(p.published_at)
                  : "Not published"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
