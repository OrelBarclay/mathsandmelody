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
      return request.nextUrl.pathname === route;
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
    // Check admin status using our new endpoint
    const adminCheckResponse = await fetch(new URL("/api/auth/check-admin", request.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: session,
      }),
    });

    if (!adminCheckResponse.ok) {
      console.error("Admin check failed:", await adminCheckResponse.text());
      throw new Error('Invalid session');
    }

    const data = await adminCheckResponse.json();
    const isAdmin = data.isAdmin;

    // If trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // If trying to access dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("Session verification error:", error);
    return NextResponse.redirect(new URL("/auth/signin", request.url));
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico|__/auth).*)",
  ],
};
