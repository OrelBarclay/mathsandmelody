'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== 'admin')) {
      router.replace('/dashboard')
    }
  }, [user, userRole, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || userRole !== 'admin') {
    return null
  }

  return <>{children}</>
} 