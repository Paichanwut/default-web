"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.scss";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { MENU_DATA, MenuItem } from "@/constants/sidebarData";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isLoading: isGlobalLoading } = useLoading();
  const { isLoading: isAuthLoading, isLoggingOut } = useAuth(); // Initial auth check

  const isAuthPage = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ].includes(pathname);

  // 1. Full Screen Loading Logic
  // - Initial App Load (isAuthLoading)
  // - OR User is on an auth page and perform action (isGlobalLoading)
  // - OR Logout is in progress (isLoggingOut)
  const showFullScreenLoading =
    isAuthLoading || (isAuthPage && isGlobalLoading) || isLoggingOut;

  // 2. Breadcrumbs Logic
  // Flatten menu to find titles by path
  // NOTE: This simple finder works for exact matches. For dynamic routes, we might need more logic.
  // 2. Breadcrumbs Logic
  // Tree Traversal to find the path in menu
  const getBreadcrumbs = () => {
    // Recursive function to find the chain of items leading to target path
    const findPathChain = (
      items: MenuItem[],
      targetPath: string,
    ): MenuItem[] | null => {
      for (const item of items) {
        // 1. Exact match?
        if (item.path === targetPath) {
          return [item];
        }
        // 2. Has children? Check if target is a descendant
        if (item.children) {
          const subChain = findPathChain(item.children, targetPath);
          if (subChain) {
            return [item, ...subChain];
          }
        }
      }
      return null;
    };

    // Find the chain for the current path
    const chain = findPathChain(MENU_DATA, pathname) || [];

    // Convert to breadcrumbs
    const crumbs = chain.map((item) => ({
      label: item.title,
      // Only clickable if it has a path AND it's not just the current page (optional)
      // User Req: If "menu has no path", don't link.
      // Also, logically parents like "My Account" don't have paths, so href becomes undefined.
      href: item.path,
    }));

    // Fallback: If no chain found (e.g. 404 or dynamic route not in menu), use path segments
    if (crumbs.length === 0 && pathname !== "/") {
      const segments = pathname.split("/").filter(Boolean);
      return [
        { label: "Home", href: "/" },
        ...segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          return {
            label:
              segment.charAt(0).toUpperCase() +
              segment.slice(1).replace(/-/g, " "),
            href: path,
          };
        }),
      ];
    }

    // ensure Home is first (if chain didn't start with root / )
    if (crumbs.length > 0 && crumbs[0].href !== "/") {
      crumbs.unshift({ label: "Home", href: "/" });
    } else if (crumbs.length > 0 && crumbs[0].href === "/") {
      // If the first item IS root, ensure label is "Home"
      crumbs[0].label = "Home";
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const pageTitle =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].label
      : "Overview"; // Default title

  return (
    <div className={styles.layout_container}>
      {/* Global / Auth Loading Overlay */}
      {showFullScreenLoading && <Loading fullScreen />}

      {!isAuthPage && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      )}

      <main
        className={`${styles.main_content} ${isCollapsed && !isAuthPage ? styles.collapsed : ""}`}
        style={isAuthPage ? { marginLeft: 0, padding: 0 } : {}}
      >
        {!isAuthPage && (
          <>
            <div className={styles.mobile_topbar}>
              <button onClick={() => setSidebarOpen(true)}>
                <Menu />
              </button>
              <span className={styles.title}>MetronicCloud</span>
              <div style={{ width: 24 }} />
            </div>

            {/* Dynamic Page Header */}
            <div style={{ padding: "0 24px" }}>
              {" "}
              {/* Add some padding to align with content */}
              <PageHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            </div>
          </>
        )}

        {children}

        {/* Contained Loading for Dashboard Actions */}
        {!isAuthPage && isGlobalLoading && !isAuthLoading && (
          <Loading contained />
        )}
      </main>
    </div>
  );
};

export default MainLayout;
