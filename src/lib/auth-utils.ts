import { auth } from "@/lib/firebase-admin"

export async function verifySession(session: string) {
  try {
    const decodedToken = await auth.verifySessionCookie(session)
    return {
      uid: decodedToken.uid,
      isAdmin: decodedToken.admin === true
    }
  } catch (error) {
    return null
  }
} 