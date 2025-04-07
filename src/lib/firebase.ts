import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Always use the Firebase domain for auth, even with custom domains
const firebaseConfig = {
  apiKey: "AIzaSyD0XObk_J9POLp8Z8dKpUd_VSI3OmcRRks",
  authDomain: "mathandmelody-a677f.firebaseapp.com", // Use Firebase domain for auth
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
  const isCustomDomain = hostname.includes('mathsandmelodyacademy.com');
  
  // Set the auth domain based on the current hostname
  if (isCustomDomain) {
    auth.updateCurrentUser(auth.currentUser); // Force token refresh
  }
}

const db = getFirestore(app)
const storage = getStorage(app)

// Initialize auth providers with custom configuration
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set custom parameters for Google sign-in
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const githubProvider = new GithubAuthProvider()

export { app, auth, db, storage, googleProvider, githubProvider } 