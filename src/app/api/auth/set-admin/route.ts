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

    await auth.setCustomUserClaims(uid, { role: "admin" });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting admin role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 