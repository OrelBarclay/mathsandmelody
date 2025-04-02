import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // For page routes, redirect to sign in if no session
  if (!session && (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/tutor")
  )) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect admin users from /dashboard to /admin
  if (session && request.nextUrl.pathname.startsWith("/dashboard")) {
    // Check if user is already on admin routes or has admin in their path
    const currentPath = request.nextUrl.pathname;
    if (currentPath.includes("/admin") || request.headers.get("referer")?.includes("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

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
