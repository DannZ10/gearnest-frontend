'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return; // run once
    done.current = true;

    const error = params.get('error');
    // One-time exchange code — the raw token never touches the URL.
    const code = params.get('code');

    if (error || !code) {
      toast.error('Login Google gagal. Silakan coba lagi.');
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        // Exchange the single-use code for a Sanctum token. The token only
        // ever travels in the POST response body, never in any URL.
        const res = await api.post('/auth/google/exchange', { code });
        const { user, token } = res.data.data;
        setAuth(user, token, user.role);
        toast.success(`Selamat datang, ${user.name}!`);
        router.replace(user.role === 'admin' ? '/admin/dashboard' : '/account');
      } catch {
        useAuthStore.getState().logout();
        toast.error('Sesi Google tidak valid. Silakan login lagi.');
        router.replace('/login');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-bone text-ink">
      <div className="text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-ember mx-auto" />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Menyelesaikan login Google…</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-bone"><Loader2 className="w-8 h-8 animate-spin text-ember mx-auto" /></div>}>
      <CallbackInner />
    </Suspense>
  );
}
