import { NextResponse } from "next/server";
import { auth, setUserRole } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();
    
    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get current user claims
    const user = await auth.getUser(uid);
    console.log("Current user claims:", user.customClaims);

    // Set the admin role using the setUserRole function
    const success = await setUserRole(uid, "admin");
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to set admin role" },
        { status: 500 }
      );
    }

    // Get the user again to verify the claims were set
    const updatedUser = await auth.getUser(uid);
    console.log("Updated user claims:", updatedUser.customClaims);

    // Force token refresh by revoking all sessions
    await auth.revokeRefreshTokens(uid);

    return NextResponse.json({ 
      success: true,
      claims: updatedUser.customClaims,
      message: "Admin role set. Please sign out and sign back in to refresh your token."
    });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 