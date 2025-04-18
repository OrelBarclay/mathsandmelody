"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { Github } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp, signInWithGoogle, signInWithGithub, isAuthenticated, error: authError, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (authError) {
      setError(authError)
      setLoading(false)
    }
  }, [authError])

  useEffect(() => {
    // Reset loading state if auth loading changes
    if (!authLoading) {
      setLoading(false)
    }
  }, [authLoading])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (mode === "signin") {
        await signIn(email, password)
        toast.success("Signed in successfully")
      } else {
        await signUp(email, password)
        toast.success("Account created successfully")
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      toast.error(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      setLoading(true)
      setError(null)
      if (provider === "google") {
        await signInWithGoogle()
        toast.success("Signed in with Google successfully")
      } else {
        await signInWithGithub()
        toast.success("Signed in with GitHub successfully")
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('auth/popup-closed-by-user')) {
        // User closed the popup, don't show error
        console.log('Sign-in cancelled by user')
      } else {
        console.error("Social login error:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        toast.error(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={loading || authLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            disabled={loading || authLoading}
          />
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || authLoading}
        >
          {loading || authLoading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("google")}
          disabled={loading || authLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin("github")}
          disabled={loading || authLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  )
} 