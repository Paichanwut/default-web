"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Settings,
  Home,
  Search,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Wallet,
  BarChart,
  Globe,
  Shield,
  CreditCard,
  UserCircle,
  Clock,
  FileText,
  Lock,
  Copyright as CopyrightIcon,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import styles from "./Sidebar.module.scss";

// --- Types ---
interface MenuItem {
  title: string;
  icon?: React.ElementType;
  path?: string;
  children?: MenuItem[];
  type?: "link" | "section";
  roles?: string[]; // Allowed roles. If empty/undefined, allowed for all.
}

// --- Helper Functions ---
const hasActiveChild = (items: MenuItem[], pathname: string): boolean => {
  return items.some(
    (child) =>
      (child.path && pathname === child.path) ||
      (child.children && hasActiveChild(child.children, pathname)),
  );
};

// --- Data Configuration ---
const MENU_DATA: MenuItem[] = [
  {
    title: "Overview",
    icon: Home,
    path: "/",
    type: "link",
  },
  {
    title: "Public Profile",
    icon: Users,
    path: "/profile",
    type: "link",
    children: [
      { title: "Profiles", path: "/profile/profiles" },
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

// --- Recursive Component ---
const SidebarItem = React.memo(
  ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(() => {
      if (item.children) {
        return hasActiveChild(item.children, pathname);
      }
      return false;
    });

    useEffect(() => {
      if (item.children && hasActiveChild(item.children, pathname)) {
        setIsOpen(true);
      }
    }, [pathname, item.children]);

    const isActive = item.path === pathname;
    const hasChildren = item.children && item.children.length > 0;

    // --- Render Section Header ---
    if (item.type === "section") {
      return (
        <>
          <div className={styles.section_separator} />

          <div className={styles.menu_group}>
            <div
              className={styles.menu_section_title}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span>{item.title}</span>
              <span
                className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`}
              >
                <ChevronDown size={14} />
              </span>
            </div>
            <div
              className={`${styles.sub_menu_container} ${isOpen ? styles.expanded : ""}`}
            >
              {item.children?.map((child, index) => (
                <SidebarItem
                  key={index}
                  item={{ ...child, type: "link" }}
                  depth={0}
                />
              ))}
            </div>
          </div>
        </>
      );
    }

    // --- Render Leaf Node (Link) ---
    if (item.path && !hasChildren) {
      return (
        <Link
          href={item.path}
          className={`${styles.menu_item} ${isActive ? styles.active_item : ""}`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          title={item.title}
        >
          <div className={styles.link_wrapper}>
            {item.icon && <item.icon className={styles.icon} />}
            <span className={styles.label}>{item.title}</span>
          </div>
        </Link>
      );
    }

    // --- Render Folder (Expandable) ---
    return (
      <>
        <div
          className={`${styles.menu_item} ${isActive ? styles.active_item : ""}`}
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          title={item.title}
        >
          <div className={styles.link_wrapper}>
            {item.icon && <item.icon className={styles.icon} />}
            <span className={styles.label}>{item.title}</span>
          </div>

          <ChevronRight
            className={`${styles.arrow} ${isOpen ? styles.rotate_down : ""}`}
            size={16}
          />
        </div>

        <div
          className={`${styles.sub_menu_container} ${isOpen ? styles.expanded : ""}`}
        >
          {item.children!.map((child, index) => (
            <SidebarItem key={index} item={child} depth={depth + 1} />
          ))}
        </div>
      </>
    );
  },
);

SidebarItem.displayName = "SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <div
              style={{
                width: 30,
                height: 30,
                background: "#252F4A",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: "bold" }}>M</span>
            </div>
            MetronicCloud
          </Link>
        </div>

        <div className={styles.scroll_area}>
          <div className={styles.nav_search}>
            <Search />
            <input type="text" placeholder="Search" />
            <span className={styles.shortcut}>cmd + /</span>
          </div>

          <nav className={styles.navigation_root}>
            {MENU_DATA.filter((item) => {
              // 1. If user is not logged in, maybe show only basic public items (optional)
              //    But currently sidebar is protected.
              // 2. If item has generic access (no roles), show it.
              if (!item.roles || item.roles.length === 0) return true;

              // 3. User must have one of the required roles
              if (user && item.roles.includes(user.role)) return true;

              return false;
            }).map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
          </nav>
        </div>

        {/* Dynamic User Profile */}
        <div className={styles.user_profile}>
          {isLoading ? (
            // Simple Skeleton Loader
            <div
              style={{
                width: "100%",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#F1F1F2",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: 12,
                    background: "#F1F1F2",
                    borderRadius: 4,
                  }}
                />
                <div
                  style={{
                    width: "40%",
                    height: 10,
                    background: "#F1F1F2",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          ) : user ? (
            <>
              <img src={user.avatar} alt="User" />
              <div className={styles.user_info}>
                <span className={styles.user_name}>{user.name}</span>
                <span className={styles.user_role}>{user.role}</span>
              </div>
              <div className={styles.actions}>
                <button
                  title={
                    theme === "light"
                      ? "Switch to Dark Mode"
                      : "Switch to Light Mode"
                  }
                  onClick={toggleTheme}
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                <button title="Logout" onClick={logout}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <button
                title={
                  theme === "light"
                    ? "Switch to Dark Mode"
                    : "Switch to Light Mode"
                }
                onClick={toggleTheme}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-gray)",
                  padding: "8px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
