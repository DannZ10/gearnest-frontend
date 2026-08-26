'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import BrandMark from '@/components/atoms/BrandMark';
import FormField from '@/components/molecules/FormField';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone, Loader2, ArrowLeft, Navigation } from 'lucide-react';

const SLIDE = 'transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none';

const COPY = {
  login: { eyebrow: 'Selamat Datang Kembali', title: 'Siap Kembali\nMelangkah?', sub: 'Kelola booking sewa alat outdoor-mu dengan mudah.' },
  register: { eyebrow: 'Gabung Basecamp', title: 'Mulai\nPetualanganmu.', sub: 'Daftar sekali, akses ke gear outdoor terlengkap.' },
};

function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function AuthShell({ initialMode = 'login' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Open-redirect guard: only same-origin paths are honored. Absolute URLs,
  // protocol-relative '//', and backslash tricks all fall back to '/'.
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirect = /^\/(?!\/)[^\s]*$/.test(rawRedirect) && !rawRedirect.includes('\\') ? rawRedirect : '/';
  const setAuth = useAuthStore((s) => s.setAuth);

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [reg, setReg] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });

  const switchTo = (next) => {
    if (next === mode) return;
    setMode(next);
    window.history.replaceState(null, '', `/${next}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', login);
      const { user, token } = res.data.data;
      setAuth(user, token, user.role);
      toast.success(`Selamat datang kembali, ${user.name}!`);
      router.push(user.role === 'admin' ? '/admin/dashboard' : redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal. Periksa email & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (reg.password !== reg.password_confirmation) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/register', reg);
      const { user, token } = res.data.data;
      setAuth(user, token, user.role);
      toast.success('Pendaftaran akun berhasil!');
      router.push('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal. Coba email lain.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    window.location.href = `${API}/auth/google/redirect`;
  };

  const isLogin = mode === 'login';
  const copy = COPY[mode];

  return (
    <div className="relative min-h-screen bg-char lg:overflow-hidden">
      {/* Brand / image panel — slides left ⇆ right */}
      <div
        className={`hidden lg:block lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 z-20 ${SLIDE} ${isLogin ? 'lg:translate-x-0' : 'lg:translate-x-full'}`}
      >
        <div className="relative h-full overflow-hidden flex flex-col justify-between p-12 bg-char">
          <img
            src="/img/hero.webp"
            alt=""
            aria-hidden="true"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 gn-topo opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-char via-char/80 to-char/30" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-ember/25 blur-[90px]" />
          <div className="absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-trail/25 blur-[90px]" />

          <div className="relative">
            <BrandMark dark />
          </div>

          <div key={mode} className="relative gn-fade-up">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-trail-2 mb-4">
              <Navigation className="w-3 h-3" /> {copy.eyebrow}
            </p>
            <h1 className="font-display font-bold uppercase leading-[0.88] tracking-tight whitespace-pre-line text-white" style={{ fontSize: 'clamp(2.5rem, 3.6vw, 4rem)' }}>
              {copy.title}
            </h1>
            <p className="mt-4 text-white/70 max-w-sm text-sm">{copy.sub}</p>
          </div>

          <p className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
            Your Gear. Your Nest. Your Adventure.
          </p>
        </div>
      </div>

      {/* Form panel — slides right ⇆ left */}
      <div
        className={`relative w-full min-h-screen lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 z-10 flex items-center justify-center bg-bone text-ink px-6 py-10 sm:px-12 lg:overflow-y-auto ${SLIDE} ${isLogin ? 'lg:translate-x-full' : 'lg:translate-x-0'}`}
      >
        <div className="w-full max-w-sm">
          {/* Mobile brand row (brand panel is desktop-only) */}
          <div className="lg:hidden mb-8 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ember">
              <ArrowLeft className="w-4 h-4" /> Situs
            </Link>
            <BrandMark />
          </div>

          <div key={mode} className="gn-fade-up">
            <div className="mb-6">
              <h2 className="font-display font-bold uppercase text-3xl tracking-tight text-ink">
                {isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
              </h2>
              <p className="text-sm text-ink/60 mt-1">
                {isLogin ? 'Lanjutkan kelola sewa gear-mu.' : 'Nikmati kemudahan sewa peralatan gunung.'}
              </p>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <FormField icon={Mail} label="Email">
                  <Input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} placeholder="nama@email.com" className="pl-10 bg-white" />
                </FormField>
                <FormField icon={Lock} label="Password">
                  <Input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} placeholder="••••••••" className="pl-10 bg-white" />
                </FormField>
                <Button type="submit" disabled={loading} className="w-full bg-ink hover:bg-ink-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <FormField icon={User} label="Nama Lengkap">
                  <Input type="text" required value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} placeholder="Rizal Pendaki" className="pl-10 bg-white" />
                </FormField>
                <FormField icon={Mail} label="Email">
                  <Input type="email" required value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} placeholder="nama@email.com" className="pl-10 bg-white" />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField icon={Lock} label="Password">
                    <Input type="password" required value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} placeholder="Min 8" className="pl-10 bg-white" />
                  </FormField>
                  <FormField icon={Lock} label="Konfirmasi">
                    <Input type="password" required value={reg.password_confirmation} onChange={(e) => setReg({ ...reg, password_confirmation: e.target.value })} placeholder="Ulangi" className="pl-10 bg-white" />
                  </FormField>
                </div>
                <FormField icon={Phone} label="Nomor WhatsApp">
                  <Input type="text" value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} placeholder="081234567890" className="pl-10 bg-white" />
                </FormField>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Daftar Akun'}
                </Button>
              </form>
            )}

            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-ink/10" />
              <span className="font-mono text-[10px] uppercase tracking-wide text-ink/40">atau</span>
              <span className="flex-1 h-px bg-ink/10" />
            </div>
            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-ink/15 bg-white hover:border-ember/40 hover:bg-bone-2 text-ink font-display font-semibold uppercase tracking-wide text-sm transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              {isLogin ? 'Masuk dengan Google' : 'Daftar dengan Google'}
            </button>

            <p className="text-center text-xs text-ink/55 mt-6">
              {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button
                type="button"
                onClick={() => switchTo(isLogin ? 'register' : 'login')}
                className="font-display font-semibold uppercase tracking-wide text-ember-2 hover:underline"
              >
                {isLogin ? 'Daftar Sekarang' : 'Masuk di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
