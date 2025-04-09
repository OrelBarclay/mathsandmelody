import { NextResponse, NextRequest } from "next/server";
import { auth, db } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
    }

    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceDoc = await db.collection("services").doc(id).get();
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const service = {
      id: serviceDoc.id,
      ...serviceDoc.data(),
      createdAt: serviceDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: serviceDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching admin service:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
    }

    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceDoc = await db.collection("services").doc(id).get();
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const updateData = await request.json();
    
    // Update the service
    await db.collection("services").doc(id).update({
      ...updateData,
      updatedAt: new Date(),
    });

    // Fetch the updated service
    const updatedDoc = await db.collection("services").doc(id).get();
    const service = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
    }

    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceDoc = await db.collection("services").doc(id).get();
    if (!serviceDoc.exists) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await db.collection("services").doc(id).delete();

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}