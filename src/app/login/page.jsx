'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Mountain, Mail, Lock, Loader2, Shield } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
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
    <div className="w-full max-w-md bg-white border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink text-ember">
            <Mountain className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="text-ink tracking-wide">GEAR<span className="text-ember">NEST</span></span>
        </Link>
        <h2 className="font-display font-bold uppercase text-xl text-ink pt-2">Masuk ke Akun</h2>
        <p className="text-xs text-ink/55">Kelola booking sewa alat outdoor-mu dengan mudah</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Field icon={Mail} label="Email">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full bg-bone border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember"
          />
        </Field>
        <Field icon={Lock} label="Password">
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-bone border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember"
          />
        </Field>

        <button
          type="submit" disabled={loading}
          className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-xl shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
        </button>
      </form>

      <p className="text-center text-xs text-ink/55">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-ember-2 hover:underline">Daftar Sekarang</Link>
      </p>

      <Link
        href="/admin/login"
        className="flex items-center justify-center gap-2 text-xs font-medium text-ink/50 hover:text-ink pt-2 border-t border-ink/10"
      >
        <Shield className="w-3.5 h-3.5" /> Masuk sebagai Admin
      </Link>
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

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-ink/50 text-sm">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
