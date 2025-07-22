import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/admin", "/booking"];
const authPaths = ["/login", "/signup"];
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/services",
  "/gallery",
  "/testimonials",
  "/faq",
  "/terms",
  "/privacy",
];

const allowedPaths = [
  "/_next/image",
  "/_next/static",
  "/images",
  "/favicon.ico",
  "/firebase-messaging-sw.js",
  "/api",
  "/__/auth",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware processing path: ${pathname}`);

  if (allowedPaths.some((path) => pathname.startsWith(path))) {
    console.log("Allowing Firebase Auth or static access");
    return NextResponse.next();
  }

  if (publicPaths.includes(pathname)) {
    console.log("Allowing public access");
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;
  const auth = request.cookies.get("auth")?.value;

  if (auth && !session) {
    console.log("Auth token present, creating session");
    try {
      const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: auth }),
      });

      if (!sessionResponse.ok) {
        console.error("Failed to create session:", await sessionResponse.text());
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const sessionData = await sessionResponse.json();
      const setCookie = sessionResponse.headers.get("set-cookie");

      if (setCookie) {
        console.log("Session created, setting cookie and redirecting");
        const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
        redirectResponse.headers.set("Set-Cookie", setCookie);
        redirectResponse.headers.set("x-user-id", sessionData.userId || '');
        return redirectResponse;
      }
    } catch (error) {
      console.error("Error creating session:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (session) {
      try {
        const checkResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
          headers: { Cookie: `session=${session}` },
        });

        if (checkResponse.ok) {
          const { isAdmin } = await checkResponse.json();
          return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }
    return NextResponse.next();
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!session) {
      console.log("No session, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const checkResponse = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        headers: { Cookie: `session=${session}` },
      });

      if (!checkResponse.ok) {
        console.error("Session check failed:", await checkResponse.text());
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const { isAdmin } = await checkResponse.json();
      console.log(`User is admin: ${isAdmin}`);

      if (pathname.startsWith("/admin") && !isAdmin) {
        console.log("Non-admin user accessing admin route, redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (pathname.startsWith("/dashboard") && isAdmin) {
        console.log("Admin user accessing dashboard route, redirecting to admin");
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch (error) {
      console.error("Error checking session:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};