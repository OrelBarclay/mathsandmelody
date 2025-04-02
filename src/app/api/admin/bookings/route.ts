import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the session and get the user
    const decodedClaims = await auth.verifySessionCookie(session);
    
    // Check if user is admin
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all bookings from Firestore
    const bookingsSnapshot = await db.collection("bookings").get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
} 