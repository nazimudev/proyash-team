import { Combine } from "lucide";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserRoundCheck,
  ClipboardList,
  HeartHandshake,
  FolderKanban,
  FolderPlus,
  HandCoins,
  Images,
  UserCog,
  MessageSquare,
  Settings,
  Globe,
  BangladeshiTaka,
  ChartBarDecreasing,
  Network,
  Coins,
  Newspaper,
  Contact,
  Wallet,
  CreditCardCheck,
  ScrollText,
  PencilSparkles,
  Send,
  Camera,
} from "lucide-react";
import Image from "next/image";

export const adminNavigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Members",
    icon: Users,
    children: [
      // {
      //   label: "Add Member",
      //   href: "/admin/members/create",
      //   icon: UserPlus,
      // },
      {
        label: "Member List",
        href: "/admin/members/list",
        icon: Users,
      },
    ],
  },
  {
    label: "Volunteers",
    icon: HeartHandshake,
    children: [
      {
        label: "All Volunteers",
        href: "/admin/volunteers",
        icon: HeartHandshake,
        exact: true,
      },
      {
        label: "Volunteer Requests",
        href: "/admin/volunteers/requests",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Projects",
    icon: FolderKanban,
    children: [
      {
        label: "All Projects",
        href: "/admin/projects",
        icon: FolderKanban,
        exact: true,
      },
      {
        label: "Add Project",
        href: "/admin/projects/create",
        icon: FolderPlus,
      },
      {
        label: "Add Images",
        href: "/admin/projects/images",
        icon: Camera,
      },
    ],
  },
  {
    label: "Donations",
    icon: HandCoins,
    children: [
      {
        label: "All Donations",
        href: "/admin/donations",
        icon: HandCoins,
        exact: true,
      },
      {
        label: "Expences",
        href: "/admin/donations/expences",
        icon: ChartBarDecreasing,
      },
      {
        label: "Payment Method",
        href: "/admin/donations/donation-settings",
        icon: BangladeshiTaka,
      },
    ],
  },
  {
    label: "Contributions",
    icon: Wallet,
    children: [
      {
        label: "Contribution",
        href: "/admin/contributions/list",
        icon: ScrollText,
      },
      {
        label: "Payments",
        href: "/admin/contributions/payments",
        icon: CreditCardCheck,
      },
      {
        label: "Generate",
        href: "/admin/contributions/generate",
        icon: PencilSparkles,
      },
      {
        label: "Payment Entry",
        href: "/admin/contributions/cash-entry",
        icon: Send,
      },
    ],
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Images,
    exact: true,
  },
  {
    label: "Blog News",
    href: "/admin/blog",
    icon: Newspaper,
    exact: true,
  },
  {
    label: "Advisor",
    href: "/admin/advisor",
    icon: UserCog,
    exact: true,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    exact: true,
  },
  {
    label: "Category",
    icon: Network,
    children: [
      {
        label: "Category",
        href: "/admin/category",
        icon: Network,
        exact: true,
      },
      {
        label: "Expense Category",
        href: "/admin/category/expense",
        icon: Coins,
        exact: true,
      },
    ],
  },
  {
    label: "Website",
    icon: Globe,
    children: [
      {
        label: "Home",
        href: "/admin/web/home",
        icon: HandCoins,
        exact: true,
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "Contact Settings",
        href: "/admin/settings/contact",
        icon: Contact,
        exact: true,
      },
    ],
  },
];

export function isActivePath(pathname, item) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
