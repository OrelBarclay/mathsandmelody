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

  // Allow access to public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;

  if (!session) {
    console.log("No session found, redirecting to signin");
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  try {
    // Verify session with Firebase Auth REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: session,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Invalid session');
    }

    const data = await response.json();
    const user = data.users[0];
    
    // Check for admin role in customAttributes
    let isAdmin = false;
    try {
      const customAttributes = JSON.parse(user?.customAttributes || '{}');
      isAdmin = customAttributes.role === "admin";
    } catch (e) {
      console.error("Error parsing customAttributes:", e);
    }
    

    // If trying to access admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      console.log("Redirecting to admin dashboard", isAdmin);
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // If trying to access dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      if (isAdmin) {
        console.log("Redirecting to admin dashboard");
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      console.log("Redirecting to user dashboard");
    }

    return NextResponse.next();
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
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
