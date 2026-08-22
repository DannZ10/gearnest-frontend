'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

// Auto-logout after this much inactivity. Keep in sync with backend
// SANCTUM_IDLE_TIMEOUT (default 30 min) so both layers expire together.
const IDLE_MS = 30 * 60 * 1000;
const CHECK_MS = 60 * 1000;
const WINDOW_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

/**
 * Logs an admin/customer out after 30 minutes of no interaction. Mounted once
 * in the root layout; only arms its listeners while a token is present.
 */
export default function IdleTimeout() {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const lastActivity = useRef(Date.now());

  useEffect(() => {
    if (!token) return;
    lastActivity.current = Date.now();

    const bump = () => {
      lastActivity.current = Date.now();
    };

    WINDOW_EVENTS.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    document.addEventListener('visibilitychange', bump);

    const cleanup = () => {
      clearInterval(interval);
      WINDOW_EVENTS.forEach((e) => window.removeEventListener(e, bump));
      document.removeEventListener('visibilitychange', bump);
    };

    const interval = setInterval(() => {
      if (Date.now() - lastActivity.current < IDLE_MS) return;
      cleanup();
      api.post('/logout').catch(() => {}); // best-effort server-side token revoke
      logout();
      toast.info('Sesi berakhir karena tidak ada aktivitas selama 30 menit. Silakan masuk kembali.');
      router.replace('/login');
    }, CHECK_MS);

    return cleanup;
  }, [token, logout, router]);

  return null;
}
