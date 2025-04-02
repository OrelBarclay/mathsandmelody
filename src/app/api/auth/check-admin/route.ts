import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token and get the user
    const decodedToken = await auth.verifyIdToken(idToken);
    const isAdmin = decodedToken.role === "admin";
    console.log("decodedToken", decodedToken);

    return NextResponse.json({ 
      isAdmin,
      uid: decodedToken.uid,
      claims: decodedToken
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 