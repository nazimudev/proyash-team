import {
  CalendarDays,
  Contact,
  LayoutDashboard,
  Receipt,
  Settings,
  User,
} from "lucide-react";

export const MEMBER_NAV = [
  { href: "/member/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/member/membership", label: "My Membership", icon: Contact },
  {
    href: "/member/contributions",
    label: "Monthly Contributions",
    icon: CalendarDays,
  },
  { href: "/member/payments", label: "Payment History", icon: Receipt },
  { href: "/member/profile", label: "My Profile", icon: User },
  { href: "/member/settings", label: "Settings", icon: Settings },
];
