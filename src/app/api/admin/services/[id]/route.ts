import { NextResponse, NextRequest } from "next/server";
import { db, auth } from "@/lib/firebase-admin";

export async function PUT(request: NextRequest) {
  try {
    const session = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const decodedToken = await auth.verifySessionCookie(session);
    const customClaims = JSON.parse(decodedToken.customAttributes || "{}");
    if (customClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, duration, isActive } = body;

    // Extract service ID from the URL
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const serviceData = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      isActive,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("services").doc(id).update(serviceData);
    const service = { id, ...serviceData };

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = request.headers.get("cookie")?.split("session=")[1]?.split(";")[0];
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const decodedToken = await auth.verifySessionCookie(session);
    const customClaims = JSON.parse(decodedToken.customAttributes || "{}");
    if (customClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract service ID from the URL
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    await db.collection("services").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
