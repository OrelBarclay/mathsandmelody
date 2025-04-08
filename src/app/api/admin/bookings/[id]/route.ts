import { NextResponse, NextRequest } from "next/server";
import { auth, db } from "@/lib/firebase-admin";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) { 
  try {
    const { params } = context; 
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookingDoc = await db.collection("bookings").doc(id).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
      createdAt: bookingDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: bookingDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error fetching admin booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, context: any) {
  try {
    const { params } = context;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
    }

    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookingDoc = await db.collection("bookings").doc(id).get();
    if (!bookingDoc.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const updateData = await request.json();
    
    // Update the booking
    await db.collection("bookings").doc(id).update({
      ...updateData,
      updatedAt: new Date(),
    });

    // Fetch the updated booking
    const updatedDoc = await db.collection("bookings").doc(id).get();
    const booking = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
