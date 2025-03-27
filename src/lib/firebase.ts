import { initializeApp, getApps } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
}

// Validate required config
const requiredFields = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
] as const

const missingFields = requiredFields.filter(field => !firebaseConfig[field])
if (missingFields.length > 0) {
  console.error('Missing required Firebase config fields:', missingFields)
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