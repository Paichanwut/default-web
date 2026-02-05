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

type SidebarItemType = MenuItem;

interface SidebarItemProps {
  item: SidebarItemType;
  depth?: number;
  isOpen?: boolean; // Controlled state
  onToggle?: () => void; // Controlled toggle handler
}

const SidebarItem: React.FC<SidebarItemProps> = React.memo(
  ({ item, depth = 0, isOpen: controlledIsOpen, onToggle }) => {
    const pathname = usePathname();

    // Internal state for uncontrolled usage (e.g. nested items if not controlled)
    const [internalIsOpen, setInternalIsOpen] = useState(() => {
      if (item.children) {
        return hasActiveChild(item.children, pathname);
      }
      return false;
    });

    // Determine effective state: controlled takes precedence if provided (not undefined)
    const isExpanded =
      controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const isActive = item.path
      ? pathname === item.path
      : item.children
        ? hasActiveChild(item.children, pathname)
        : false;

    const hasChildren = item.children && item.children.length > 0;
    const isSection = item.type === "section";

    // Handle toggle
    const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onToggle) {
        onToggle();
      } else {
        setInternalIsOpen(!internalIsOpen);
      }
    };

    // --- Render Section Header ---
    if (isSection) {
      return (
        <div className={styles.menu_group}>
          <div className={styles.menu_section_title} onClick={handleToggle}>
            <span>{item.title}</span>
            <span className={styles.section_letter}>
              {item.title.charAt(0)}
            </span>
            <span
              className={`${styles.chevron} ${isExpanded ? styles.rotate : ""}`}
            >
              <ChevronDown size={14} />
            </span>
          </div>
          <div
            className={`${styles.sub_menu_container} ${isExpanded ? styles.expanded : ""}`}
          >
            {item.children!.map((child, index) => (
              <SidebarItem key={index} item={child} depth={depth} />
            ))}
          </div>
          <div className={styles.section_separator} />
        </div>
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
            {item.icon ? (
              <item.icon className={styles.icon} />
            ) : (
              <span className={styles.fallback_icon}>
                {item.title.charAt(0)}
              </span>
            )}
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
          onClick={handleToggle}
          title={item.title}
        >
          <div className={styles.link_wrapper}>
            {item.icon ? (
              <item.icon className={styles.icon} />
            ) : (
              <span className={styles.fallback_icon}>
                {item.title.charAt(0)}
              </span>
            )}
            <span className={styles.label}>{item.title}</span>
          </div>

          <ChevronRight
            className={`${styles.arrow} ${isExpanded ? styles.rotate_down : ""}`}
            size={16}
          />
        </div>

        <div
          className={`${styles.sub_menu_container} ${isExpanded ? styles.expanded : ""}`}
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
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  toggleCollapse,
}) => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Accordion State: Track the ID/Title of the currently open top-level menu
  const pathname = usePathname();
  // Initialize state based on current path to avoid "closed then open" flash on load
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(() => {
    // Find the item that contains the active path
    const activeItem = MENU_DATA.find(
      (item) => item.children && hasActiveChild(item.children, pathname),
    );
    return activeItem ? activeItem.title : null;
  });

  // Sync with path changes (navigation)
  useEffect(() => {
    // Find the item that contains the active path
    const activeItem = MENU_DATA.find(
      (item) => item.children && hasActiveChild(item.children, pathname),
    );
    // Only update if we found an active item and it's different (or null, though usually we want to keep one open)
    if (activeItem) {
      setOpenMenuKey(activeItem.title);
    }
  }, [pathname]);

  const handleToggleMenu = (title: string) => {
    // User requested: "Keep it open forever, even if I press it"
    // So we just set the key to the title. We do NOT toggle it to null.
    setOpenMenuKey(title);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
        onClick={onClose}
      />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${isCollapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logo_icon}>
              <span>M</span>
            </div>
            <span>MetronicCloud</span>
          </Link>

          {/* Toggle Button in Header */}
          <div
            onClick={toggleCollapse}
            className={`${styles.toggle_button} ${isCollapsed ? styles.collapsed_toggle : ""}`}
            style={{ marginLeft: isCollapsed ? 0 : "auto" }} // Keep this minimal override if slightly complex, or move to class logic fully if possible.
            // Note: The class logic 'collapsed_toggle' handles margin-left: 0, and default is auto. So we can try removing inline style.
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <div className={styles.toggle_icon_wrapper}>
                <div className={styles.toggle_icon_box}>
                  <ChevronRight
                    size={16}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.scroll_area}>
          <div className={styles.nav_search}>
            <Search />
            <input type="text" placeholder="Search" />
            <span className={styles.shortcut}>cmd + /</span>
          </div>

          <nav className={styles.navigation_root}>
            {isLoading && !user ? (
              // Navigation Skeleton - Only show if loading AND strictly no user data yet
              <div className={styles.skeleton_nav}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.skeleton_item}>
                    <div className={styles.skeleton_box} />
                    {!isCollapsed && <div className={styles.skeleton_line} />}
                  </div>
                ))}
              </div>
            ) : (
              MENU_DATA.filter((item) => {
                // 1. If user is not logged in, maybe show only basic public items (optional)
                //    But currently sidebar is protected.
                // 2. If item has generic access (no roles), show it.
                if (!item.roles || item.roles.length === 0) return true;

                // 3. User must have one of the required roles
                if (user && item.roles.includes(user.role)) return true;

                return false;
              }).map((item, index) => (
                <SidebarItem
                  key={item.title} // Use title as stable key instead of index
                  item={item}
                  // Control logic:
                  // Pass isOpen only if we are controlling this item.
                  // For top level items, we control them via openMenuKey.
                  isOpen={
                    item.children ? openMenuKey === item.title : undefined
                  }
                  onToggle={
                    item.children
                      ? () => handleToggleMenu(item.title)
                      : undefined
                  }
                />
              ))
            )}
          </nav>
        </div>

        {/* Dynamic User Profile */}
        <div className={styles.user_profile}>
          {isLoading && !user ? (
            // Simple Skeleton Loader
            <div className={styles.skeleton_profile}>
              <div className={styles.skeleton_avatar} />
              <div className={styles.skeleton_text_col}>
                <div className={styles.skeleton_text_lg} />
                <div className={styles.skeleton_text_sm} />
              </div>
            </div>
          ) : user ? (
            <>
              <img src={user.avatar} alt="User" />
              <div
                className={styles.user_info}
                style={{ display: isCollapsed ? "none" : "flex" }}
              >
                <span className={styles.user_name}>{user.name}</span>
                <span className={styles.user_role}>{user.role}</span>
              </div>
              <div
                className={styles.actions}
                style={{ display: isCollapsed ? "none" : "flex" }}
              >
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
                className={styles.icon_button}
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
