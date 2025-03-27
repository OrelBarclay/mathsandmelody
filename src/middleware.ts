import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/firebase-admin"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decodedToken = await auth.verifySessionCookie(session)
    const isAdmin = decodedToken.admin === true

    // If trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // If trying to access dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    }

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
} 