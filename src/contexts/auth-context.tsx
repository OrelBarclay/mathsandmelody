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
  try {
    // Force token refresh
    const idToken = await user.getIdToken(true);
    
    // Get the current hostname and standardize it
    const hostname = window.location.hostname;
    const isProduction = hostname.includes('mathsandmelodyacademy.com');
    
    // Always use the www version in production
    const apiUrl = isProduction 
      ? 'https://www.mathsandmelodyacademy.com/api/auth/session'
      : '/api/auth/session';

    console.log('Creating session cookie:', {
      hostname,
      isProduction,
      apiUrl,
      idTokenLength: idToken.length,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
      credentials: 'include' // Important for cross-domain cookies
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Session creation failed:', {
        status: response.status,
        error,
        hostname,
        isProduction,
        responseText: await response.text()
      });
      throw new Error("Failed to create session");
    }

    const data = await response.json();
    console.log('Session created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createSessionCookie:', error);
    throw error;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;

    const initializeAuth = async () => {
      try {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);
        console.log('Auth persistence set to LOCAL');
      } catch (err) {
        console.error("Error setting persistence:", err);
      }
    };

    initializeAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', {
        hasUser: !!user,
        uid: user?.uid,
        email: user?.email,
        hostname: window.location.hostname
      });

      if (user) {
        try {
          // Force token refresh and get user role
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();
          const role = idTokenResult.claims.role as UserRole || "student";
          
          console.log('User authenticated:', {
            uid: user.uid,
            email: user.email,
            role,
            claims: idTokenResult.claims
          });

          setUser(user);
          setIsAuthenticated(true);
          setUserRole(role);

          // Create session cookie
          const response = await fetch("/api/auth/session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: idTokenResult.token }),
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error("Failed to create session");
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setError(error instanceof Error ? error.message : 'Unknown error');
          setUser(null);
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } else {
        console.log("Auth state changed - No user");
        setUser(null);
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      unsubscribe();
    };
  }, [mounted]);

  // Return null during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      setLoading(true)

      // Get the current URL for redirect
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      console.log('Starting Google sign in:', { currentUrl });

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

        // Create session cookie
        await createSessionCookie(result.user);

        // Redirect to the original URL or dashboard
        const returnUrl = new URLSearchParams(window.location.search).get('from') || '/dashboard';
        window.location.href = returnUrl;
      } catch (roleErr) {
        console.error("Error getting user role:", roleErr)
        setUserRole("student")
        setError("Failed to get user role")
        setLoading(false)
        throw roleErr
      }
    } catch (err) {
      console.error("Google sign in error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
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
      setError(null);
      setLoading(true);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Force token refresh and get user role
      await userCredential.user.getIdToken(true);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const role = idTokenResult.claims.role as UserRole || "student";
      
      setUser(userCredential.user);
      setIsAuthenticated(true);
      setUserRole(role);

      // Create session cookie
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: idTokenResult.token }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      // Redirect to dashboard after successful sign in
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await createSessionCookie(userCredential.user)
      setLoading(false)
    } catch (err) {
      console.error("Sign up error:", err)
      setError("Failed to sign up")
      setLoading(false)
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      setLoading(true)
      await firebaseSignOut(auth)
      setLoading(false)
    } catch (err) {
      console.error("Sign out error:", err)
      setError("Failed to sign out")
      setLoading(false)
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
