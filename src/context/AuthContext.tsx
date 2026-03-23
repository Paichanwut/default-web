"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
// Re-using User type from authService to keep it consistent
// interface User { ... }
// We will alias the imported one for clarity or just use it directly.
type User = ServiceUser;

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
import { authService, User as ServiceUser } from "@/services/authService";

// --- Provider ---
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Load user from service on mount
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      // Use the authService to "simulate" API login
      const response = await authService.login(email);
      setUser(response.user);
      router.push("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    // Simulate brief delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    authService.logout();
    setUser(null);
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
