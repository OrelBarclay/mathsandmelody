import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"
import { AdminService } from "@/lib/services/admin-service"

const adminService = new AdminService()

export async function GET(request: Request) {
  try {
    const session = request.headers.get("Cookie")?.split("session=")[1]?.split(";")[0]
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await auth.verifySessionCookie(session)
    if (decodedClaims.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const items = await adminService.getAllPortfolioItems()
    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
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
    const item = await adminService.createPortfolioItem(data)
    return NextResponse.json({ item })
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 })
  }
} 