// src/lib/firebase-admin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const auth = getAuth(); // Firebase Admin Auth (Server-side)
export const db = getFirestore(); // Firestore (Server-side)

export async function setUserRole(uid: string, role: "student" | "admin" | "tutor") {
  try {
    await auth.setCustomUserClaims(uid, { role });
    return true;
  } catch (error) {
    console.error("Error setting user role:", error);
    return false;
  }
}

export async function getUserRole(uid: string) {
  try {
    const user = await auth.getUser(uid);
    return (user.customClaims?.role as "student" | "admin" | "tutor") || "student";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "student";
  }
}
