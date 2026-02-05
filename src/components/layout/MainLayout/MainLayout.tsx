"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.scss";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { isLoading: isGlobalLoading } = useLoading();
  const { isLoading: isAuthLoading } = useAuth(); // Initial auth check

  const isAuthPage = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ].includes(pathname);

  // 1. Full Screen Loading Logic
  // - Initial App Load (isAuthLoading)
  // - OR User is on an auth page and perform action (isGlobalLoading)
  const showFullScreenLoading =
    isAuthLoading || (isAuthPage && isGlobalLoading);

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
          <div className={styles.mobile_topbar}>
            <button onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
            <span className={styles.title}>MetronicCloud</span>
            <div style={{ width: 24 }} />
          </div>
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
