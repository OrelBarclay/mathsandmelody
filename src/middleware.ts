import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle Firebase auth iframe requests
  if (pathname.startsWith("/__/auth/")) {
    const authUrl = new URL(
      `https://mathandmelody-a677f.firebaseapp.com${pathname}${request.nextUrl.search}`
    )
    return NextResponse.rewrite(authUrl)
  }

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    // Skip session check for session creation endpoint and webhooks
    if (
      pathname === "/api/auth/session" ||
      pathname.startsWith("/api/webhooks/")
    ) {
      return NextResponse.next()
    }

    const session = request.cookies.get("session")?.value
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.next()
  }

  // Handle page routes
  const session = request.cookies.get("session")?.value
  const isAuthPage = pathname.startsWith("/auth/")
  const isAdminPage = pathname.startsWith("/admin/")
  const isDashboardPage = pathname === "/dashboard"
  const isBookingPage = pathname.startsWith("/booking/")

  // Allow access to auth pages regardless of session
  if (isAuthPage) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to sign in for protected routes
  if (!session && (isDashboardPage || isAdminPage || isBookingPage)) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect admin users from /dashboard to /admin if they're already on admin routes
  if (session && isDashboardPage && isAdminPage) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/__/auth/:path*",
    "/api/:path*",
    "/auth/:path*",
    "/dashboard",
    "/admin/:path*",
    "/booking/:path*",
  ],
}
