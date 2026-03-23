import axios from "axios";
import Cookies from "js-cookie";

// Create a single axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api", // Fallback to local API
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// --- Request Interceptor ---
// Automatically attach the token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookie (managed by AuthContext/AuthService)
    const token = Cookies.get("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Handle global errors like 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If 401, we might want to trigger a logout or refresh
    // For now, we just pass the error through to be handled by the caller
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - 401");
      // Optional: Dispatch a custom event to redirect to login
      // window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
