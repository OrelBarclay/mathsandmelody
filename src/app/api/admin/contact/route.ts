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

    const contact = await adminService.getContactInfo()
    return NextResponse.json({ contact })
  } catch (error) {
    console.error("Error fetching contact info:", error)
    return NextResponse.json({ error: "Failed to fetch contact info" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
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
    const contact = await adminService.updateContactInfo(data)
    return NextResponse.json({ contact })
  } catch (error) {
    console.error("Error updating contact info:", error)
    return NextResponse.json({ error: "Failed to update contact info" }, { status: 500 })
  }
} 