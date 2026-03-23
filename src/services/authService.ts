import Cookies from "js-cookie";
import { encryptData, decryptData } from "@/utils/security";

// Types
export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "app_user";

export const authService = {
  // --- Simulation: Mock Login ---
  login: async (email: string, password?: string): Promise<LoginResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock User Generation based on email
    const namePart = email.split("@")[0];
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: displayName,
      role: email.toLowerCase().includes("admin") ? "Admin" : "User",
      email: email,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };

    // Mock JWT Token (Base64 encoded JSON for realism, though not signed)
    const mockTokenPayload = {
      sub: mockUser.id,
      email: mockUser.email,
      role: mockUser.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    };
    const mockToken = btoa(JSON.stringify(mockTokenPayload));

    // Store Session
    authService.setSession(mockToken, mockUser);

    return { user: mockUser, token: mockToken };
  },

  // --- Session Management ---
  setSession: (token: string, user: User) => {
    // 1. Store Token in Cookie (for Middleware & API Client)
    Cookies.set(TOKEN_KEY, token, { expires: 1, path: "/" });

    // 2. Store Encrypted User in LocalStorage (for UI Persistence)
    const encryptedUser = encryptData(user);
    localStorage.setItem(USER_KEY, encryptedUser);
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY, { path: "/" });
    localStorage.removeItem(USER_KEY);
  },

  // --- Helpers ---
  isAuthenticated: (): boolean => {
    return !!Cookies.get(TOKEN_KEY);
  },

  getUser: (): User | null => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) return null;
    return decryptData(storedUser);
  },
  
  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  }
};
