"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

import AdminMobileNav from "./AdminMobileNav";

export default function AdminTopbar({ user, onLogout }) {
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userName = user?.name || "Admin";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      {/* Mobile Menu */}
      <button
        type="button"
        onClick={() => setNavOpen(true)}
        aria-label="Open menu"
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden text-sm text-gray-500 lg:block">
        Welcome back, {userName}!
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Account Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 transition hover:bg-gray-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
              {initial}
            </span>

            <span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 sm:block">
              {userName}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl shadow-gray-200/50"
            >
              {/* User Info */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="mt-1 truncate text-xs text-gray-500">
                  {user?.email || "Administrator"}
                </p>
              </div>

              {/* Profile */}
              <Link
                href="/admin/profile"
                onClick={() => setDropdownOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <UserRound size={17} />
                My Profile
              </Link>

              {/* Settings */}
              <Link
                href="/admin/profile/settings"
                onClick={() => setDropdownOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-green-700"
              >
                <Settings size={17} />
                Settings
              </Link>

              <div className="my-2 border-t border-gray-100" />

              {/* Logout */}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout?.();
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <AdminMobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </header>
  );
}
