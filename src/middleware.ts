import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // List of public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/booking",
    "/booking/success",
    "/images",
    "/api/auth",
    "/services",
    "/portfolio",
    "/contact",
    "/about",
    "/blog",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.startsWith("/api/")) {
      return request.nextUrl.pathname.startsWith(route);
    }
    return route === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(route);
  });

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const session = request.cookies.get("session");
  if (!session) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // For admin routes, let the API handle the admin check
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // We'll let the page handle the admin check
    return NextResponse.next();
  }

  // For all other authenticated routes (like dashboard)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - __/auth (Firebase Auth routes)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|__/auth|.*\\..*|assets).*)",
  ],
};
