import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user directly to check claims
    const user = await auth.getUser(uid);
    console.log("User claims:", user.customClaims);
    console.log("User:", user);

    // Also check the session cookie if available
    const session = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    let sessionClaims = null;
    if (session) {
      try {
        const decodedToken = await auth.verifySessionCookie(session);
        sessionClaims = decodedToken;
        console.log("Session claims:", sessionClaims);
      } catch (error) {
        console.error("Error verifying session:", error);
      }
    }

    return NextResponse.json({ 
      claims: user.customClaims,
      sessionClaims,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin: user.customClaims?.role === "admin"
    });
  } catch (error) {
    console.error("Error checking claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 