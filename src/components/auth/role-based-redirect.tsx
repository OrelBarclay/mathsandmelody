'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function RoleBasedRedirect() {
  const router = useRouter();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && userRole) {
      // Handle dashboard routing based on user role
      if (window.location.pathname === '/dashboard') {
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'tutor') {
          router.push('/tutor');
        }
      }

      // Protect admin routes
      if (window.location.pathname.startsWith('/admin') && userRole !== 'admin') {
        router.push('/dashboard');
      }

      // Protect tutor routes
      if (window.location.pathname.startsWith('/tutor') && userRole !== 'tutor' && userRole !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [userRole, loading, router]);

  return null;
} 