"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, BadgeCheck, Ban, Pencil, Trash2 } from "lucide-react";

export default function DonationActionsMenu({ donation, onAction }) {
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const open = pos !== null;

  const items = [
    { key: "view", label: "View Details", Icon: Eye },
    ...(donation.status === "pending"
      ? [{ key: "verify", label: "Verify Donation", Icon: BadgeCheck }, { key: "reject", label: "Reject Donation", Icon: Ban }]
      : []),
    { key: "edit", label: "Edit Donation", Icon: Pencil },
    { key: "delete", label: "Delete Donation", Icon: Trash2, danger: true },
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
    const height = items.length * 38 + 16;
    const top = r.bottom + height > window.innerHeight ? Math.max(8, r.top - height) : r.bottom + 4;
    setPos({ top, left: Math.max(8, r.right - 192) });
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
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="menu" aria-expanded={open}
        aria-label={`Actions for ${donation.id}`}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600">
        <MoreVertical className="h-4 w-4" />
      </button>
      {open ? (
        <div ref={menuRef} role="menu" onKeyDown={onMenuKey} style={{ top: pos.top, left: pos.left }}
          className="fixed z-50 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {items.map(({ key, label, Icon, danger }) => (
            <button key={key} type="button" role="menuitem"
              onClick={() => { setPos(null); onAction(key, donation); }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none ${danger ? "text-red-700" : "text-gray-700"}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
