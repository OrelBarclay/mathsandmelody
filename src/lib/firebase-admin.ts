import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}

const apps = getApps()

if (!apps.length) {
  initializeApp(firebaseAdminConfig)
}

export const adminAuth = getAuth()

export async function setUserRole(uid: string, role: "student" | "admin" | "tutor") {
  try {
    await adminAuth.setCustomUserClaims(uid, { role })
    return true
  } catch (error) {
    console.error("Error setting user role:", error)
    return false
  }
}

export async function getUserRole(uid: string) {
  try {
    const user = await adminAuth.getUser(uid)
    return user.customClaims?.role as "student" | "admin" | "tutor" || "student"
  } catch (error) {
    console.error("Error getting user role:", error)
    return "student"
  }
} 