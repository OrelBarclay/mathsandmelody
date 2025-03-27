import { NextResponse } from "next/server"
import { adminAuth, setUserRole, getUserRole } from "@/lib/firebase-admin"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    const userRole = await getUserRole(decodedClaims.uid)

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await adminAuth.listUsers()
    const usersWithRoles = await Promise.all(
      users.users.map(async (user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: await getUserRole(user.uid),
      }))
    )

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")?.value
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie)
    const userRole = await getUserRole(decodedClaims.uid)

    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { uid, role } = await request.json()
    if (!uid || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const success = await setUserRole(uid, role)
    if (!success) {
      return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 