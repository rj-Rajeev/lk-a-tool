import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import { SidebarSection } from "./sidebar.types";

export const sidebarItems: SidebarSection[] = [
  {
    section: "primary",
    items: [
      {
        label: "Create Post",
        icon: PenSquare,
        href: "/profile/linkedin",
        primary: true,
      },
    ],
  },
  {
    section: "workflow",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        label: "Scheduled",
        icon: Calendar,
        href: "/profile/linkedin/schedule",
      },
      {
        label: "published",
        icon: Calendar,
        href: "/profile/linkedin/published",
      },
      {
        label: "Templates",
        icon: FileText,
        href: "/templates",
      },
    ],
  },
  {
    section: "insight",
    items: [
      {
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
      },
    ],
  },
  {
    section: "system",
    items: [
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
      },
    ],
  },
];
