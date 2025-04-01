'use client'

import { createContext, useContext, useEffect, useState } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithRedirect,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth"
import { auth, googleProvider, githubProvider, db } from "@/lib/firebase"
import { getDoc, doc } from "firebase/firestore"

type UserRole = "student" | "admin" | "tutor"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  userRole: UserRole | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  updateProfile: (data: { displayName?: string }) => Promise<void>
  isAdmin: boolean
  isTutor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const createSessionCookie = async (user: User) => {
  const idToken = await user.getIdToken()
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  })

  if (!response.ok) {
    throw new Error("Failed to create session")
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
     const initializeAuth = async () => {
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence)
      } catch (err) {
        console.error("Error setting persistence:", err)
      }
    }

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
          // Create session cookie if needed
          if (!document.cookie.includes('session=')) {
            try {
              await createSessionCookie(user)
            } catch (cookieErr) {
              console.error("Error creating session cookie:", cookieErr)
            }
          }
        setIsAuthenticated(true);
        
        setUserRole("student") // Default role for new users
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in result:", result)
      
      // Update user state
      setUser(result.user)
      setIsAuthenticated(true)
       // Get user role
          try {
            const userDocRef = doc(db, "users", result.user.uid)
            const userDoc = await getDoc(userDocRef)
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role as UserRole)
            } else {
              setUserRole("student")
            }
          } catch (roleErr) {
            console.error("Error getting user role:", roleErr)
            setUserRole("student")
          }
      
      // Create session cookie
      await createSessionCookie(result.user)
      
      setLoading(false)
    } catch (err) {
      console.error("Google sign in error:", err)
      setError("Failed to sign in with Google")
      setLoading(false)
      throw err
    }
  }

  const signInWithGithub = async () => {
    try {
      setError(null)
      setLoading(true)
      // Force token refresh before redirect
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true)
      }
      await signInWithRedirect(auth, githubProvider)
    } catch (err) {
      console.error("GitHub sign in error:", err)
      setError("Failed to sign in with GitHub")
      setLoading(false)
      throw err
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await createSessionCookie(userCredential.user)
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Failed to sign in")
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await createSessionCookie(userCredential.user)
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Failed to sign up")
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await firebaseSignOut(auth)
    } catch (err) {
      console.error("Sign out error:", err)
      setError("Failed to sign out")
      throw err
    }
  }

  const updateProfile = async (data: { displayName?: string }) => {
    if (!user) throw new Error("No user logged in")
    await firebaseUpdateProfile(user, data)
    setUser({ ...user, ...data })
  }

  const isAdmin = userRole === "admin"
  const isTutor = userRole === "tutor"

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        userRole,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithGithub,
        updateProfile,
        isAdmin,
        isTutor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
