import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { auth } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role using ID token
    const decodedToken = await auth.verifyIdToken(session)
    if (decodedToken.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all users
    const listUsersResult = await auth.listUsers();
    console.log("List users result:", listUsersResult);
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: JSON.parse(user.customClaims?.customAttributes || "{}").role || "student",
      createdAt: user.metadata.creationTime,
      lastSignIn: user.metadata.lastSignInTime,
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
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin role using ID token
    const decodedToken = await auth.verifyIdToken(session)
    if (decodedToken.role !== "admin") {
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
    await auth.setCustomUserClaims(userId, { role })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    )
  }
} 