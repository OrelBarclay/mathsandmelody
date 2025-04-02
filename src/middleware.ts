import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Handle API routes that require authentication
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For API routes, let the API handlers verify the session
    return NextResponse.next();
  }

  // Handle page routes
  if (!session) {
    // Redirect to signin for protected routes
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/tutor")
    ) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  // For protected routes, let the page components handle role-based access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/tutor/:path*",
    "/api/:path*",
  ],
};
