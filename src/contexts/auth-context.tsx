"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth"
import { auth, googleProvider, githubProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithGithub: () => Promise<void>
  isAuthenticated: boolean
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const handleSignOut = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await signOut(auth)
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await signInWithPopup(auth, googleProvider)
  }

  const signInWithGithub = async () => {
    if (!auth) throw new Error("Firebase Auth is not initialized")
    await signInWithPopup(auth, githubProvider)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut: handleSignOut,
        signInWithGoogle,
        signInWithGithub,
        isAuthenticated,
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