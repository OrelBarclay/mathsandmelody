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
    // For non-API routes, check for exact match or if it's the root path
    return route === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(route);
  });

  // Create response
  const response = NextResponse.next();

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return response;
  }

  const session = request.cookies.get("session")?.value;

  if (!session) {
    console.log("No session found, redirecting to signin");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    // Get the base URL for the admin check
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const adminCheckUrl = `${protocol}://${host}/api/auth/check-admin`;

    // Check admin status
    const adminCheckResponse = await fetch(adminCheckUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${session}` // Pass the session cookie
      },
      body: JSON.stringify({ idToken: session }),
    });

    if (!adminCheckResponse.ok) {
      console.error("Admin check failed:", await adminCheckResponse.text());
      // Don't throw error here, just assume not admin
      return response;
    }

    const data = await adminCheckResponse.json();
    const isAdmin = data.isAdmin;

    // If trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Allow access to dashboard for all authenticated users
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return response;
    }

    return response;
  } catch (error) {
    console.error("Session verification error:", error);
    // Don't redirect on error, just continue
    return response;
  }
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
