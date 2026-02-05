"use client";

import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./MainLayout.module.scss";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
  ].includes(pathname);

  return (
    <div className={styles.layout_container}>
      {!isAuthPage && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <main
        className={styles.main_content}
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
      </main>
    </div>
  );
};

export default MainLayout;
