import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase-admin";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

export async function GET(request: Request) {
  try {
    const session = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the session and get the user
    const decodedClaims = await auth.verifySessionCookie(session);
    const userId = decodedClaims.uid;

    // Get the user's bookings from Firestore
    const bookingsSnapshot = await db.collection("bookings").where("userId", "==", userId).get();

    const bookings = bookingsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user bookings" },
      { status: 500 }
    );
  }
} 