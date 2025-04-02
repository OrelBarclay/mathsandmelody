import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase-admin";
import { NextRequest } from "next/server";

type Props = {
  params: {
    id: string;
  };
};

export async function GET(
  request: NextRequest,
  props: Props
) {
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

    // Get the booking from Firestore
    const bookingDoc = await db.collection("bookings").doc(props.params.id).get();

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
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: Props
) {
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

    const updates = await request.json();

    // Update the booking in Firestore
    await db.collection("bookings").doc(props.params.id).update({
      ...updates,
      updatedAt: new Date(),
    });

    // Get the updated booking
    const bookingDoc = await db.collection("bookings").doc(props.params.id).get();

    const booking = {
      id: bookingDoc.id,
      ...bookingDoc.data(),
      createdAt: bookingDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: bookingDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Error updating admin booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: Props
) {
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

    // Delete the booking from Firestore
    await db.collection("bookings").doc(props.params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
} 