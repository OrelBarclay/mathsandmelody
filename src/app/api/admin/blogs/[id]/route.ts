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

    const blog = await adminService.getBlog(params.id)
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
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
    const blog = await adminService.updateBlog(params.id, data)
    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
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

    await adminService.deleteBlog(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
} 