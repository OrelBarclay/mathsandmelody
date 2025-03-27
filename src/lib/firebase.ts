import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Log environment variables (without sensitive values)
console.log('Environment check:', {
  hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})

const firebaseConfig = {
  apiKey: "AIzaSyD0XObk_J9POLp8Z8dKpUd_VSI3OmcRRks",
  authDomain: "mathandmelody-a677f.firebaseapp.com",
  projectId: "mathandmelody-a677f",
  storageBucket: "mathandmelody-a677f.firebasestorage.app",
  messagingSenderId: "417011127689",
  appId: "1:417011127689:web:3509abac4a6250b0463d58"
}

// Initialize Firebase
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
} catch (error) {
  console.error('Error initializing Firebase:', error)
  app = null
}

// Initialize services
let auth: Auth | null = null
let db: Firestore | null = null
let storage = null

if (app) {
  try {
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error('Error initializing Firebase services:', error)
  }
}

// Initialize auth providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export { app, auth, db, storage, googleProvider, githubProvider } 