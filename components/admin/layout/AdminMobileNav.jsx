"use client";

import { X } from "lucide-react";
import { AdminBrand, AdminNavLinks } from "./AdminSidebar";

export default function AdminMobileNav({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-gray-900/40" />
      <div className="relative flex h-full w-72 max-w-[85%] flex-col gap-8 bg-white px-4 py-6 shadow-xl">
        <div className="flex items-center justify-between px-2">
          <AdminBrand />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <AdminNavLinks onNavigate={onClose} />
      </div>
    </div>
  );
}
