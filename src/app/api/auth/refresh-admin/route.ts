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

    // Get user and verify admin role
    const user = await auth.getUser(uid);
    const isAdmin = user.customClaims?.role === "admin";

    if (!isAdmin) {
      return NextResponse.json(
        { error: "User is not an admin" },
        { status: 403 }
      );
    }

    // Force token refresh
    await auth.revokeRefreshTokens(uid);

    return NextResponse.json({ 
      success: true,
      message: "Admin token refreshed. Please sign out and sign back in."
    });
  } catch (error) {
    console.error("Error refreshing admin token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 