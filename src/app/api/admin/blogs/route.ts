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

    const blogs = await adminService.getAllBlogs()
    return NextResponse.json({ blogs })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
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
    const blog = await adminService.createBlog(data)
    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
} 