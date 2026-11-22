"use client";
import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { MemberProvider } from "./MemberProvider";
import MemberSidebar from "./MemberSidebar";
import MemberMobileNavigation from "./MemberMobileNavigation";
import MemberHeader from "./MemberHeader";
import DemoBanner from "./DemoBanner";
import { MEMBER_RENDERS_TOASTER } from "@/lib/member/config";

export default function MemberShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <MemberProvider>
      <div className="min-h-screen bg-[#f4f8f4] text-slate-800">
        <a
          href="#member-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <MemberSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
        <MemberMobileNavigation open={drawerOpen} onClose={closeDrawer} />
        <div
          className={`transition-[padding] duration-200 motion-reduce:transition-none ${collapsed ? "lg:pl-20" : "lg:pl-72"}`}
        >
          <MemberHeader onOpenMenu={() => setDrawerOpen(true)} />
          <main
            id="member-main"
            className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
          >
            <DemoBanner />
            {children}
          </main>
        </div>
        {MEMBER_RENDERS_TOASTER && (
          <Toaster position="top-right" richColors closeButton />
        )}
      </div>
    </MemberProvider>
  );
}
