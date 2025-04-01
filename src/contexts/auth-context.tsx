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
  signInWithPopup
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

  // useEffect(() => {
  //   // Ensure this code runs only on the client side
  //   if (typeof window === "undefined") return; // Skip for SSR

  //   const initializeAuth = async () => {
  //     try {
  //       // Set persistence to LOCAL
  //       await setPersistence(auth, browserLocalPersistence)
  //     } catch (err) {
  //       console.error("Error setting persistence:", err)
  //     }
  //   }

  //   initializeAuth()

  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     console.log("Auth state changed - Current user:", currentUser?.email ?? "No user")
  //     console.log("Current auth instance:", auth.currentUser?.email)
      
  //     try {
  //       if (currentUser) {
  //         setUser(currentUser)
  //         setIsAuthenticated(true)

  //         // Create session cookie if needed
  //         if (!document.cookie.includes('session=')) {
  //           try {
  //             await createSessionCookie(currentUser)
  //           } catch (cookieErr) {
  //             console.error("Error creating session cookie:", cookieErr)
  //           }
  //         }

  //         // Get user role
  //         try {
  //           const userDocRef = doc(db, "users", currentUser.uid)
  //           const userDoc = await getDoc(userDocRef)
  //           if (userDoc.exists()) {
  //             setUserRole(userDoc.data().role as UserRole)
  //           } else {
  //             setUserRole("student")
  //           }
  //         } catch (roleErr) {
  //           console.error("Error getting user role:", roleErr)
  //           setUserRole("student")
  //         }
  //       } else {
  //         console.log("No user found")
  //         setUser(null)
  //         setIsAuthenticated(false)
  //         setUserRole(null)
  //       }
  //     } catch (err) {
  //       console.error("Error in auth state change:", err)
  //       setError("Failed to update authentication state")
  //     }
  //   })

  //   // Check for redirect result
  //   const checkRedirect = async () => {
  //     try {
  //       const result = await getRedirectResult(auth)
  //       if (result?.user) {
  //         console.log("Redirect result received:", result.user.email)
  //         // Force refresh the token
  //         await result.user.getIdToken(true)
  //       }
  //     } catch (err) {
  //       console.error("Error handling redirect:", err)
  //       setError("Failed to complete sign in")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   checkRedirect()

  //   return () => unsubscribe()
  // }, []) 

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
