'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Mountain, Mail, Lock, Loader2, Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { user, token } = res.data.data;

      if (user.role !== 'admin') {
        logout();
        toast.error('Akun ini bukan admin. Gunakan portal member.');
        return;
      }

      setAuth(user, token, user.role);
      toast.success(`Selamat datang, ${user.name}!`);
      router.push('/admin/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login gagal. Periksa kredensial admin.';
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
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-ember text-ink">
            <Mountain className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="font-display font-bold text-xl tracking-wide">
            GEAR<span className="text-ember">NEST</span>
          </span>
        </Link>

        <div className="relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/40 border border-white/10 text-[11px] font-display font-semibold uppercase tracking-[0.15em]">
            <Shield className="w-3.5 h-3.5 text-ember" /> Control Center
          </span>
          <h1 className="mt-5 font-display font-bold uppercase leading-[0.95] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
            Kelola<br /><span className="text-ember">Basecamp.</span>
          </h1>
          <p className="mt-4 text-sand/80 max-w-sm text-sm">
            Pantau booking, stok, dan pendapatan GearNest dari satu tempat.
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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember/15 text-ember-2 text-[11px] font-bold uppercase tracking-wide">
              <Shield className="w-3.5 h-3.5" /> Admin Only
            </span>
            <h2 className="mt-4 font-display font-bold uppercase text-3xl tracking-tight text-ink">Portal Admin</h2>
            <p className="text-sm text-ink/60 mt-1">Masuk untuk mengelola GearNest.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field icon={Mail} label="Email Admin">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gearnest.com"
                className="w-full bg-white border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember"
              />
            </Field>
            <Field icon={Lock} label="Password">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-ink hover:bg-ink-2 text-white font-display font-semibold uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk sebagai Admin'}
            </button>
          </form>

          <p className="text-center text-xs text-ink/50">
            Bukan admin?{' '}
            <Link href="/login" className="font-semibold text-ember-2 hover:underline">
              Masuk sebagai member
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink/70 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 absolute left-3.5 top-3.5 text-ink/40" />
        {children}
      </div>
    </div>
  );
}
