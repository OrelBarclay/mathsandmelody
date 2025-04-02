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
import { auth, googleProvider, githubProvider } from "@/lib/firebase"

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

  const checkUserClaims = async (user: User) => {
    try {
      // Force token refresh to get latest claims
      await user.getIdToken(true);
      const idTokenResult = await user.getIdTokenResult();
      console.log("Checking user claims:", idTokenResult.claims);
      
      // If we have a role claim, use it
      if (idTokenResult.claims.role) {
        return idTokenResult.claims.role as UserRole;
      }
      
      // If no role claim, check with the server
      const response = await fetch("/api/auth/check-claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Server claims check:", data);
        if (data.claims?.role) {
          return data.claims.role as UserRole;
        }
      }
      
      return "student";
    } catch (err) {
      console.error("Error checking user claims:", err);
      return "student";
    }
  };

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
        console.log("Auth state changed - User:", user);
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
        
        // Check user claims
        const role = await checkUserClaims(user);
        console.log("Setting user role:", role);
        setUserRole(role);
      } else {
        console.log("Auth state changed - No user");
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
      }
      setLoading(false)
    })

    // Cleanup function
    return () => {
      console.log("Cleaning up auth subscription");
      unsubscribe()
    }
  }, [])

  // Add a separate effect to handle role persistence
  useEffect(() => {
    const checkAndUpdateRole = async () => {
      if (user && !userRole) {
        console.log("Checking role persistence");
        const role = await checkUserClaims(user);
        console.log("Updating persisted role:", role);
        setUserRole(role);
      }
    };

    checkAndUpdateRole();
  }, [user, userRole]);

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in result:", result)
      
      // Update user state
      setUser(result.user)
      setIsAuthenticated(true)
      
      // Force token refresh and get user role from claims
      try {
        await result.user.getIdToken(true);
        const idTokenResult = await result.user.getIdTokenResult();
        console.log("Google Sign In - ID Token Claims:", idTokenResult.claims);
        const role = idTokenResult.claims.role as UserRole || "student";
        console.log("Google Sign In - User Role:", role);
        setUserRole(role);
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
