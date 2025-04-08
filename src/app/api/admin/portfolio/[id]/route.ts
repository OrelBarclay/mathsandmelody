import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import { AdminService } from "@/lib/services/admin-service"

const adminService = new AdminService()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = request.headers.get("Cookie")?.split("session=")[1]?.split(";")[0]
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await auth.verifySessionCookie(session)
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const item = await adminService.getPortfolioItem(params.id)
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio item" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = request.headers.get("Cookie")?.split("session=")[1]?.split(";")[0]
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await auth.verifySessionCookie(session)
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const item = await adminService.updatePortfolioItem(params.id, data)
    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return NextResponse.json({ error: "Failed to update portfolio item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = request.headers.get("Cookie")?.split("session=")[1]?.split(";")[0]
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await auth.verifySessionCookie(session)
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await adminService.deletePortfolioItem(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return NextResponse.json({ error: "Failed to delete portfolio item" }, { status: 500 })
  }
} 