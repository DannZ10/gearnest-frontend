'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import BrandMark from '@/components/atoms/BrandMark';
import FormField from '@/components/molecules/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2, Shield, ArrowLeft } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { user, token } = res.data.data;
      setAuth(user, token, user.role);
      toast.success(`Selamat datang kembali, ${user.name}!`);
      router.push(user.role === 'admin' ? '/admin/dashboard' : redirect);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login gagal. Periksa email & password Anda.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink text-white">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 gn-topo overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-ember/20 blur-3xl" />
        <BrandMark dark />

        <div className="relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/40 border border-white/10 text-[11px] font-display font-semibold uppercase tracking-[0.15em]">
            <Shield className="w-3.5 h-3.5 text-ember" /> Outdoor Gear Rental
          </span>
          <h1 className="mt-5 font-display font-bold uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
            Siap untuk<br /><span className="text-ember">Petualangan?</span>
          </h1>
          <p className="mt-4 text-sand/80 max-w-sm text-sm">
            Sewa alat outdoor premium untuk pendakian, camping, dan petualangan alam lainnya.
          </p>
        </div>

        <p className="relative font-display text-xs uppercase tracking-[0.2em] text-sand/50">
          Your Gear. Your Nest. Your Adventure.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-bone text-ink">
        <div className="w-full max-w-sm space-y-8">
          <Link href="/" className="lg:hidden inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ember">
            <ArrowLeft className="w-4 h-4" /> Kembali ke situs
          </Link>

          <div>
            <h2 className="font-display font-bold uppercase text-3xl tracking-tight text-ink">Masuk ke Akun</h2>
            <p className="text-sm text-ink/60 mt-1">Kelola booking sewa alat outdoor-mu dengan mudah</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <FormField icon={Mail} label="Email">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="pl-10 bg-white"
              />
            </FormField>
            <FormField icon={Lock} label="Password">
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 bg-white"
              />
            </FormField>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-ink hover:bg-ink-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
            </Button>
          </form>

          <p className="text-center text-xs text-ink/50">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-ember-2 hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-bone text-ink/50 text-sm">Memuat form login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
