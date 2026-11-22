"use client";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { MEMBER_NAV } from "./memberNav";
import { useMember } from "./MemberProvider";
import Avatar from "./Avatar";
import userData from "@/hooks/userData";
import Link from "next/link";

export default function MemberHeader({ onOpenMenu }) {
  const pathname = usePathname();
  const { member } = useMember();
  const current = MEMBER_NAV.find(
    (n) => pathname === n.href || pathname.startsWith(`${n.href}/`),
  );

  const user = userData();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-green-100 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="rounded-xl p-2 text-slate-600 transition hover:bg-green-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm font-bold text-slate-800">
          {current?.label || "Member Panel"}
        </p>
        <div>
          <button>
            
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold leading-tight text-slate-800">
            {user.name || " "}
          </p>
          <p className="text-xs text-slate-500">
            {member?.membershipId || " "}
          </p>
        </div>
        <Avatar
          name={member?.nameEn}
          photoUrl={member?.photoUrl}
          className="h-9 w-9 text-xs"
        />
      </div>
    </header>
  );
}
