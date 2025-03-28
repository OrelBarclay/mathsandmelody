import { NextResponse } from "next/server"
import { auth, setUserRole } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    let userRecord
    try {
      // Try to get existing user
      userRecord = await auth.getUserByEmail(email)
    } catch (error) {
      // If user doesn't exist, create new user
      const firebaseError = error as { code?: string }
      if (firebaseError.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          emailVerified: true,
        })
      } else {
        throw error
      }
    }

    // Set admin role
    await setUserRole(userRecord.uid, "admin")

    return NextResponse.json({
      success: true,
      message: "Admin user setup completed successfully",
      uid: userRecord.uid,
    })
  } catch (error) {
    console.error("Error setting up admin user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to setup admin user" },
      { status: 500 }
    )
  }
} 