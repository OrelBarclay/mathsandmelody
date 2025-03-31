"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  AuthError,
} from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"

type UserRole = "student" | "admin" | "tutor"

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: UserRole | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  updateUserEmail: (newEmail: string) => Promise<void>
  updateUserPassword: (newPassword: string) => Promise<void>
  deleteUserAccount: (currentPassword: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isTutor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  const isAuthenticated = !!user
  const isAdmin = userRole === "admin"
  const isTutor = userRole === "tutor"

  const checkUserRole = async (user: User) => {
    try {
      const idTokenResult = await user.getIdTokenResult()
      const role = idTokenResult.claims.role as UserRole
      setUserRole(role || "student")
    } catch (error) {
      console.error("Error checking user role:", error)
      setUserRole("student")
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        console.log("user", user)
        await checkUserRole(user)
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    const result = await signInWithEmailAndPassword(auth, email, password)
    await checkUserRole(result.user)
    
    // Create session cookie
    const idToken = await result.user.getIdToken()
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

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await checkUserRole(result.user)
    
    // Create session cookie
    const idToken = await result.user.getIdToken()
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

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await signOut(auth)
    
    // Clear session cookie
    await fetch("/api/auth/session", {
      method: "DELETE",
    })
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await sendPasswordResetEmail(auth, email)
  }

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    if (!auth.currentUser) throw new Error("No user logged in")
    await firebaseUpdateProfile(auth.currentUser, data)
  }

  const updateUserEmail = async (newEmail: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    if (!auth.currentUser) throw new Error("No user logged in")
    await updateEmail(auth.currentUser, newEmail)
  }

  const updateUserPassword = async (newPassword: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    if (!auth.currentUser) throw new Error("No user logged in")
    await updatePassword(auth.currentUser, newPassword)
  }

  const deleteUserAccount = async (currentPassword: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    if (!auth.currentUser) throw new Error("No user logged in")

    // Reauthenticate user before deletion
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email!,
      currentPassword
    )
    await reauthenticateWithCredential(auth.currentUser, credential)
    await deleteUser(auth.currentUser)
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await checkUserRole(result.user)
      
      // Create session cookie
      const idToken = await result.user.getIdToken()
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
    } catch (error) {
      if ((error as AuthError).code === 'auth/popup-closed-by-user') {
        throw new Error("Sign in was cancelled. Please try again.")
      }
      throw error
    }
  }

  const signInWithGithub = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    try {
      const result = await signInWithPopup(auth, githubProvider)
      await checkUserRole(result.user)
      
      // Create session cookie
      const idToken = await result.user.getIdToken()
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
    } catch (error) {
      if ((error as AuthError).code === 'auth/popup-closed-by-user') {
        throw new Error("Sign in was cancelled. Please try again.")
      }
      throw error
    }
  }

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateProfile,
    updateUserEmail,
    updateUserPassword,
    deleteUserAccount,
    signInWithGoogle,
    signInWithGithub,
    isAuthenticated,
    isAdmin,
    isTutor,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 