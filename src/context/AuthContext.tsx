"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Import Security Utils
// Import js-cookie
// @ts-ignore
import Cookies from "js-cookie";
import { encryptData, decryptData } from "@/utils/security";

// --- Provider ---
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Load user from local storage on mount (Simulation)
  useEffect(() => {
    const storedUser = localStorage.getItem("app_user");
    if (storedUser) {
      // Decrypt data before using it
      const decryptedUser = decryptData(storedUser);
      if (decryptedUser) {
        setUser(decryptedUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // Simulate API call and dynamic data
    // Extract name from email (e.g. admin@demo.com -> Admin)
    const namePart = email.split("@")[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const mockUser: User = {
      id: "1",
      name: displayName,
      role: "Admin", // Could correspond to specific emails if needed
      email: email,
      avatar: "https://i.pravatar.cc/150?img=11",
    };

    setUser(mockUser);

    // Encrypt data before saving
    const encryptedUser = encryptData(mockUser);
    localStorage.setItem("app_user", encryptedUser);

    // Set cookie for Middleware (expires in 1 day)
    Cookies.set("auth_token", "valid_token", { expires: 1, path: "/" });

    router.push("/"); // Redirect to home after login
  };

  const logout = async () => {
    setIsLoggingOut(true);
    // Simulate brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser(null);
    localStorage.removeItem("app_user");
    Cookies.remove("auth_token", { path: "/" });
    router.push("/auth/login");
    // Reset state after a short delay to ensure redirect happens while loader is up
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 500);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
