import React from "react";
import {
  Users,
  Settings,
  Home,
  LayoutGrid,
  Wallet,
  BarChart,
  Globe,
  Shield,
  Clock,
  FileText,
  Copyright as CopyrightIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  icon?: React.ElementType;
  path?: string;
  children?: MenuItem[];
  type?: "link" | "section";
  roles?: string[]; // Allowed roles. If empty/undefined, allowed for all.
}

export const MENU_DATA: MenuItem[] = [
  {
    title: "Overview",
    icon: Home,
    path: "/",
    type: "link",
  },
  {
    title: "Components Demo",
    icon: LayoutGrid,
    type: "link",
    children: [{ title: "Table & Pagination", path: "/table-demo" }],
  },
  {
    title: "Public Profile",
    icon: Users,
    // url removed to prevent 404 (Group header only)
    type: "link",
    children: [
      { title: "Profiles", path: "/profile/profiles" },
      { title: "Blogger", path: "/profile/profiles/blogger" },
      { title: "Teams", path: "/profile/teams" },
    ],
  },
  {
    title: "My Account",
    icon: Settings,
    type: "link",
    roles: ["Admin"], // Only Admin can see this
    children: [
      { title: "Account Home", path: "/account/home" },
      { title: "Billing", path: "/account/billing" },
      { title: "Security", path: "/account/security" },
      {
        title: "Members & Roles",
        children: [
          { title: "Teams Starter", path: "/account/members/starter" },
          { title: "Teams", path: "/account/members/teams" },
          { title: "Team Info", path: "/account/members/info" },
        ],
      },
    ],
  },
  {
    title: "Network",
    icon: Users,
    type: "link",
    children: [{ title: "Connections", path: "/network/connections" }],
  },
  {
    title: "Authentication",
    icon: Shield,
    type: "link",
    children: [{ title: "Logins", path: "/auth/logins" }],
  },
  {
    title: "Store - Client",
    icon: Wallet,
    type: "link",
    children: [{ title: "Products", path: "/store/products" }],
  },
  // Sections
  {
    title: "Spaces",
    type: "section",
    children: [
      { title: "Metrics Hub", icon: LayoutGrid, path: "/spaces/metrics" },
      { title: "Data Lab", icon: BarChart, path: "/spaces/datalab" },
      { title: "Creative Commons", icon: Globe, path: "/spaces/commons" },
      { title: "KPI Monitor", icon: Shield, path: "/spaces/kpi" },
    ],
  },
  {
    title: "Favorites",
    type: "section",
    children: [
      { title: "Post Date", icon: Clock, path: "/favorites/post-date" },
      {
        title: "Creative Licenses",
        icon: FileText,
        path: "/favorites/licenses",
      },
      { title: "Open Content", icon: Users, path: "/favorites/open-content" },
      { title: "Copyright", icon: CopyrightIcon, path: "/favorites/copyright" },
    ],
  },
];
