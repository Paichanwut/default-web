import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't need authentication
  const isPublicPath = 
    path === "/auth/login" || 
    path === "/auth/register" || 
    path.startsWith("/_next") ||
    path.startsWith("/public") ||
    path.startsWith("/api/public");

  // Get the token from cookies
  const token = request.cookies.get("auth_token")?.value || "";

  // Logic: 
  // 1. If user has token and visits login page, redirect to home
  // 2. If user has NO token and visits protected page, redirect to login

  if (isPublicPath && token) {
    // If authenticated user tries to access login, send them to dashboard
    if (path === "/auth/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!isPublicPath && !token) {
    // If unauthenticated user tries to access protected route, send to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Ensure middleware runs on relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes can be protected separately if needed, or included here)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
