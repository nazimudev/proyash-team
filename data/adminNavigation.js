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
} from "lucide-react";

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
      {
        label: "All Members",
        href: "/admin/members",
        icon: Users,
        exact: true,
      },
      {
        label: "Add Member",
        href: "/admin/members/create",
        icon: UserPlus,
      },
      {
        label: "Member Requests",
        href: "/admin/members/requests",
        icon: ClipboardList,
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
        label: "Pending Verification",
        href: "/admin/donations/pending",
        icon: UserRoundCheck,
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
    label: "Team",
    href: "/admin/team",
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
    label: "Website",
    icon: Globe,
    children: [
      {
        label: "Home",
        href: "/admin/web/home",
        icon: HandCoins,
        exact: true,
      },
    ]
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    exact: true,
  },
];

export function isActivePath(pathname, item) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
