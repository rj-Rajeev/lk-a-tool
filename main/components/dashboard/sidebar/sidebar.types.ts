import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  primary?: boolean; // ✅ optional
};

export type SidebarSection = {
  section: string;
  items: SidebarItem[];
};
