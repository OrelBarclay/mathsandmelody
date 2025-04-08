import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/firebase-admin"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/admin", "/booking"]
const authPaths = ["/auth/signin", "/auth/signup"]

export async function middleware(request: NextRequest) {
  // Get the hostname and standardize it
  const hostname = request.headers.get("host") || ""
  const isProduction = hostname.includes("mathsandmelodyacademy.com")
  const isFirebaseHosting = hostname.includes("mathsandmelody--mathandmelody-a677f.us-central1.hosted.app")
  
  // Redirect non-www to www in production
  if (isProduction && !hostname.startsWith("www.")) {
    const url = new URL(request.url)
    url.hostname = `www.${hostname}`
    return NextResponse.redirect(url, { status: 301 })
  }

  // Redirect Firebase hosting URL to main domain
  if (isFirebaseHosting) {
    const url = new URL(request.url)
    url.hostname = "www.mathsandmelodyacademy.com"
    return NextResponse.redirect(url, { status: 301 })
  }

  const path = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p))
  const isAuthPath = authPaths.some((p) => path.startsWith(p))
  const isBookingPage = path.startsWith("/booking")

  // Check for session cookie
  const session = request.cookies.get("session")?.value

  // If on a protected path and no session, redirect to sign in
  if ((isProtectedPath || isBookingPage) && !session) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("from", path)
    return NextResponse.redirect(signInUrl)
  }

  // If on auth path and has session, redirect to dashboard
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Verify session for protected paths
  if (session && (isProtectedPath || isBookingPage)) {
    try {
      const decodedClaims = await auth.verifySessionCookie(session)
      
      // Check admin access
      if (path.startsWith("/admin") && decodedClaims.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      // Check tutor access
      if (path.startsWith("/dashboard/tutor") && decodedClaims.role !== "tutor") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    } catch (error) {
      console.error("Session verification failed:", error)
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("from", path)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/booking/:path*",
  ],
}
