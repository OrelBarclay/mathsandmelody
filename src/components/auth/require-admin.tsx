'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {

    // Only redirect if we're not loading and we've checked the role
    if (!loading && !isChecking) {
      if (!user) {
        console.log("RequireAdmin - No user, redirecting to signin");
        router.replace('/auth/signin')
      } else if (userRole !== 'admin') {
        console.log("RequireAdmin - Not admin, redirecting to dashboard");
        router.replace('/dashboard')
      } else {
        console.log("RequireAdmin - User is admin, allowing access");
      }
    }
  }, [user, userRole, loading, router, isChecking])

  // Set isChecking to false after initial load
  useEffect(() => {
    if (!loading) {
      console.log("RequireAdmin - Initial load complete, setting isChecking to false");
      setIsChecking(false)
    }
  }, [loading])

  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    console.log("RequireAdmin - No user, returning null");
    return null
  }

  if (userRole !== 'admin') {
    console.log("RequireAdmin - Not admin, returning null");
    return null
  }

  return <>{children}</>
} 