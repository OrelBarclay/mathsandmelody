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
      return NextResponse.json({ error: "Missing portfolio ID" }, { status: 400 });
    }

    const portfolioDoc = await db.collection("portfolio").doc(id).get();
    if (!portfolioDoc.exists) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    const portfolio = {
      id: portfolioDoc.id,
      ...portfolioDoc.data(),
      createdAt: portfolioDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: portfolioDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error fetching portfolio item:", error);
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing portfolio ID" }, { status: 400 });
    }

    const portfolioDoc = await db.collection("portfolio").doc(id).get();
    if (!portfolioDoc.exists) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    const updateData = await request.json();

    // Update the portfolio item
    await db.collection("portfolio").doc(id).update({
      ...updateData,
      updatedAt: new Date(),
    });

    // Fetch the updated portfolio item
    const updatedDoc = await db.collection("portfolio").doc(id).get();
    const portfolio = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt?.toDate().toISOString(),
      updatedAt: updatedDoc.data()?.updatedAt?.toDate().toISOString(),
    };

    return NextResponse.json({ portfolio });
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing portfolio ID" }, { status: 400 });
    }

    const portfolioDoc = await db.collection("portfolio").doc(id).get();
    if (!portfolioDoc.exists) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    await db.collection("portfolio").doc(id).delete();

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 });
  }
}