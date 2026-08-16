'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

/**
 * Client-side route guard.
 * - Not logged in                 -> /login  (or /admin/login when admin)
 * - Admin guard, but not admin     -> /account
 * - Customer guard, but is admin   -> /admin/dashboard  (admins stay in the admin area)
 *
 * Waits for zustand/persist to rehydrate from localStorage before deciding, so
 * a hard refresh on a protected page does not falsely bounce a logged-in user.
 */
export default function RequireAuth({ admin = false, children }) {
  const router = useRouter();
  const { token, role } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace(admin ? '/admin/login' : '/login');
      return;
    }
    if (admin && role !== 'admin') {
      router.replace('/account');
      return;
    }
    if (!admin && role === 'admin') {
      router.replace('/admin/dashboard');
      return;
    }
    setReady(true);
  }, [hydrated, token, role, admin, router]);

  if (!ready) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-ember" />
      </div>
    );
  }

  return children;
}
