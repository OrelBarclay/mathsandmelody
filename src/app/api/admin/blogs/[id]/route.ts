import { NextResponse, NextRequest } from "next/server";
import { auth, db } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = {
      id: blogDoc.id,
      ...blogDoc.data(),
      createdAt: blogDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: blogDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const updateData = await request.json();

    // Update the blog
    await db.collection("blogs").doc(id).update({
      ...updateData,
      updatedAt: new Date(),
    });

    // Fetch the updated blog
    const updatedDoc = await db.collection("blogs").doc(id).get();
    const blog = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest // Remove the 'context' parameter
) {
  try {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(session);
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the 'id' param directly from the request URL
    const id = request.url.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
    }

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await db.collection("blogs").doc(id).delete();

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}