"use client";

import { useState } from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import AdminMobileNav from "./AdminMobileNav";

export default function AdminTopbar() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={() => setNavOpen(true)}
        aria-label="Open menu"
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden text-sm text-gray-500 lg:block">Welcome back</div>

      <div className="flex items-center gap-2">
        {/* Placeholder: wire to real notifications once the API exists. */}
        <button type="button" aria-label="Notifications" className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </button>
        {/* Placeholder: replace with the signed-in user's real name and role. */}
        <button type="button" className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 hover:bg-gray-50">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">A</span>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">Admin</span>
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </button>
      </div>

      <AdminMobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </header>
  );
}
