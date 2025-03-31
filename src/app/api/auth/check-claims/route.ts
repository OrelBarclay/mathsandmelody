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

    return NextResponse.json({ 
      claims: user.customClaims,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    });
  } catch (error) {
    console.error("Error checking claims:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 