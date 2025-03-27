import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    const userRecord = await adminAuth.getUser(decodedClaims.uid)

    // Check if user is admin
    const isAdmin = userRecord.customClaims?.admin === true
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const listUsersResult = await adminAuth.listUsers()
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.customClaims?.role || "student",
    }))

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    const userRecord = await adminAuth.getUser(decodedClaims.uid)

    // Check if user is admin
    const isAdmin = userRecord.customClaims?.admin === true
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      )
    }

    // Update user role
    await adminAuth.setCustomUserClaims(userId, { role })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
} 