'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function RoleBasedRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, loading, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    const path = pathname;
    console.log('RoleBasedRedirect - Checking role-based redirect:', {
      path,
      userRole,
      isAuthenticated,
      loading
    });
    console.log('isAuthenticated', isAuthenticated);
    console.log('userRole', userRole);

    // Only handle role-based redirects for authenticated users
    if (isAuthenticated && userRole) {
      // Redirect admin users to admin dashboard
      if (userRole === 'admin' && path === '/dashboard') {
        console.log('RoleBasedRedirect - Admin accessing dashboard, redirecting to admin');
        router.replace('/admin');
        return;
      }

      // Handle role-specific routes
      if (userRole === 'admin' && path.startsWith('/tutor')) {
        console.log('RoleBasedRedirect - Admin accessing tutor route, redirecting to admin');
        router.replace('/admin');
        return;
      }

      if (userRole === 'tutor' && path.startsWith('/admin')) {
        console.log('RoleBasedRedirect - Tutor accessing admin route, redirecting to tutor');
        router.replace('/tutor');
        return;
      }
    }
  }, [isAuthenticated, userRole, loading, mounted, router, pathname]);

  // Return null during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return null;
} 