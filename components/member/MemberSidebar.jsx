"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronsLeft,
  ChevronsRight,
  HeartHandshake,
  LogOut,
} from "lucide-react";
import { MEMBER_NAV } from "./memberNav";
import { useMember } from "./MemberProvider";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import ConfirmationDialog from "./ConfirmationDialog";
import { Skeleton } from "./LoadingSkeleton";
import { ORG_LOGO_SRC, ORG_NAME } from "@/lib/member/config";
import { logoutMember } from "@/services/memberSettingsService";
import userData from "@/hooks/userData";

export function SidebarContent({ collapsed = false, onNavigate, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const { member, loading } = useMember();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const user = userData();

  async function handleLogout() {
    setBusy(true);
    try {
      const to = await logoutMember();
      toast.success("You have been signed out.");
      router.push(to);
    } catch (e) {
      toast.error(e.message || "Could not sign out. Please try again.");
      setBusy(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-green-950 text-green-50">
      <div
        className={`flex h-16 items-center gap-3 border-b border-white/10 ${collapsed ? "justify-center px-2" : "px-5"}`}
      >
        {ORG_LOGO_SRC ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ORG_LOGO_SRC}
            alt=""
            className="h-9 w-9 rounded-xl bg-white object-contain p-1"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-700 text-white">
            <HeartHandshake className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        {!collapsed && (
          <span className="text-[15px] font-extrabold leading-tight tracking-tight">
            {ORG_NAME}
          </span>
        )}
      </div>

      <nav
        aria-label="Member navigation"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {MEMBER_NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-green-300 ${collapsed ? "justify-center px-2" : "px-3"} ${active ? "bg-white text-green-900" : "text-green-100/80 hover:bg-white/10 hover:text-white"}`}
            >
              {active && !collapsed && (
                <span
                  className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-green-400"
                  aria-hidden="true"
                />
              )}
              <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              {!collapsed && <span>{label}</span>}
              {collapsed && <span className="sr-only">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        {loading && !member ? (
          <Skeleton className="h-14 bg-white/10" />
        ) : (
          <div
            className={`flex items-center gap-3 rounded-xl bg-white/5 p-2.5 ${collapsed ? "justify-center" : ""}`}
          >
            <Avatar
              name={member?.nameEn}
              photoUrl={member?.photoUrl}
              className="h-10 w-10 text-sm"
            />
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {user.name || "Member"}
                </p>
                {member?.status && (
                  <div className="mt-1">
                    <StatusBadge kind="membership" status={member.status} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          title={collapsed ? "Log out" : undefined}
          className={`flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-semibold text-green-100/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-green-300 ${collapsed ? "justify-center px-2" : "px-3"}`}
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          {collapsed ? <span className="sr-only">Log out</span> : "Log out"}
        </button>
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden w-full items-center gap-3 rounded-xl py-2 text-xs font-semibold text-green-200/60 transition hover:text-white lg:flex ${collapsed ? "justify-center px-2" : "px-3"}`}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" /> Collapse
              </>
            )}
          </button>
        )}
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        loading={busy}
        title="Log out?"
        description="You will need to sign in again to see your membership and contributions."
        confirmLabel="Log out"
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default function MemberSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden transition-[width] duration-200 motion-reduce:transition-none lg:block ${collapsed ? "w-20" : "w-72"}`}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}
