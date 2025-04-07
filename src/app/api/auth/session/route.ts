import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      )
    }

    // Create a session cookie using Firebase Admin
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Get the domain from the request
    const domain = request.headers.get('host')?.split(':')[0] || '';
    const isCustomDomain = domain.includes('mathsandmelodyacademy.com');

    console.log('Session creation:', {
      domain,
      isCustomDomain,
      idTokenLength: idToken.length,
      sessionCookieLength: sessionCookie.length
    });

    // Set the session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
      domain: isCustomDomain ? '.mathsandmelodyacademy.com' : undefined // Include subdomains for custom domain
    })

    return response
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Failed to create session", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  // Get the domain from the request
  const domain = request.headers.get('host')?.split(':')[0] || '';
  const isCustomDomain = domain.includes('mathsandmelodyacademy.com');

  const response = NextResponse.json({ success: true })
  response.cookies.delete({
    name: "session",
    path: "/",
    domain: isCustomDomain ? '.mathsandmelodyacademy.com' : undefined
  })
  return response
} 