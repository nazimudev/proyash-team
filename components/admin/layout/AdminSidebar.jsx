/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ChevronDown } from "lucide-react";

import { adminNavigation, isActivePath } from "@/data/adminNavigation";
import Logo from "@/components/ui/Logo";

export function AdminBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg text-white">
        <Logo />
      </span>

      <span className="leading-tight">
        <span className="block text-sm font-semibold text-gray-900">
          Proyash
        </span>
        <span className="block text-xs text-gray-500">Admin panel</span>
      </span>
    </div>
  );
}

export function AdminNavLinks({ onNavigate }) {
  const pathname = usePathname();

  const [openMenus, setOpenMenus] = useState({});

  // Automatically open the submenu containing the active route.
  useEffect(() => {
    const activeMenus = {};

    adminNavigation.forEach((item) => {
      if (item.children?.some((child) => isActivePath(pathname, child))) {
        activeMenus[item.label] = true;
      }
    });

    setOpenMenus((previous) => ({
      ...previous,
      ...activeMenus,
    }));
  }, [pathname]);

  function toggleMenu(label) {
    setOpenMenus((previous) => ({
      ...previous,
      [label]: !previous[label],
    }));
  }

  return (
    <nav aria-label="Admin" className="flex flex-col gap-1 bg-white">
      {adminNavigation.map((item) => {
        const Icon = item.icon;
        const hasChildren = Boolean(item.children?.length);

        const active = hasChildren
          ? item.children.some((child) => isActivePath(pathname, child))
          : isActivePath(pathname, item);

        const isOpen = Boolean(openMenus[item.label]);

        if (hasChildren) {
          return (
            <div key={item.label} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toggleMenu(item.label)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-green-600 ${
                  active
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      active ? "text-green-600" : "text-gray-400"
                    }`}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div className="ml-5 flex flex-col gap-1 border-l border-gray-200 pl-3">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = isActivePath(pathname, child);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        aria-current={childActive ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-green-600 ${
                          childActive
                            ? "bg-green-50 font-medium text-green-700"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {ChildIcon && (
                          <ChildIcon
                            className={`h-4 w-4 ${
                              childActive ? "text-green-600" : "text-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                        )}

                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-green-600 ${
              active
                ? "bg-green-50 text-green-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon
              className={`h-4 w-4 ${
                active ? "text-green-600" : "text-gray-400"
              }`}
              aria-hidden="true"
            />

            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-gray-200 bg-white px-4 py-6 lg:flex">
      <div className="px-2">
        <AdminBrand />
      </div>

      <AdminNavLinks />
    </aside>
  );
}
