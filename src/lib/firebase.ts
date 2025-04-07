import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "mathandmelody-a677f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Configure Google provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
  redirect_uri: typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/signin`
    : 'https://mathsandmelodyacademy.com/auth/signin'
})

// Configure GitHub provider
const githubProvider = new GithubAuthProvider()
githubProvider.setCustomParameters({
  redirect_uri: typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/signin`
    : 'https://mathsandmelodyacademy.com/auth/signin'
})

// Set persistence based on environment
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  const isCustomDomain = hostname.includes('mathsandmelodyacademy.com');
  
  // Always use LOCAL persistence for custom domain
  if (isCustomDomain) {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  } else {
    // For local development, use SESSION persistence
    setPersistence(auth, browserSessionPersistence).catch((error) => {
      console.error('Error setting persistence:', error);
    });
  }
}

export { auth, db, storage, googleProvider, githubProvider } 