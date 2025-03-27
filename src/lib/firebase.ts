import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Only initialize Firebase if we have all required config
const app = getApps().length === 0 && firebaseConfig.apiKey
  ? initializeApp(firebaseConfig)
  : getApps()[0]

// Only initialize services if we have an app
const auth = app ? getAuth(app) : null
const db = app ? getFirestore(app) : null
const storage = app ? getStorage(app) : null

// Initialize auth providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export { app, auth, db, storage, googleProvider, githubProvider } 