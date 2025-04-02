'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function RoleRedirect() {
  const router = useRouter();
  const { userRole } = useAuth();

  useEffect(() => {
    if (userRole === 'admin') {
      router.replace('/admin');
    }
  }, [userRole, router]);

  return null;
} 