import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD0XObk_J9POLp8Z8dKpUd_VSI3OmcRRks",
  authDomain: "mathsandmelodyacademy.com",
  projectId: "mathandmelody-a677f",
  storageBucket: "mathandmelody-a677f.firebasestorage.app",
  messagingSenderId: "417011127689",
  appId: "1:417011127689:web:3509abac4a6250b0463d58"
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

// Initialize services
const auth = getAuth(app)
auth.useDeviceLanguage() // Use browser's language

// Configure auth settings
if (typeof window !== 'undefined') {
  const hostname = window.location.hostname;
  if (hostname.includes('mathsandmelodyacademy.com')) {
    auth.updateCurrentUser(auth.currentUser) // Force token refresh
  }
}

const db = getFirestore(app)
const storage = getStorage(app)

// Initialize auth providers
const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

export { app, auth, db, storage, googleProvider, githubProvider } 