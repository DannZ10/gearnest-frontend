'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Mountain, Mail, Lock, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('customer@gearnest.com');
  const [password, setPassword] = useState('customer123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password });
      const { user, token } = res.data.data;
      setAuth(user, token, user.role);
      toast.success(`Selamat datang kembali, ${user.name}!`);

      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push(redirect);
      }
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.message || 'Login gagal. Periksa email & password Anda.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-emerald-400">
          <Mountain className="w-7 h-7 text-emerald-400" />
          <span className="text-white">GearNest</span>
        </Link>
        <h2 className="text-xl font-bold text-white tracking-tight">Masuk ke Akun Anda</h2>
        <p className="text-xs text-slate-400">Kelola booking sewa alat outdoor Anda dengan mudah</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
        </button>
      </form>

      {/* Demo Credentials Box */}
      <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
        <p className="font-bold text-emerald-400">Akun Demo Cepat:</p>
        <p className="text-slate-400">Customer: <code className="text-white">customer@gearnest.com</code> / <code className="text-white">customer123</code></p>
        <p className="text-slate-400">Admin: <code className="text-white">admin@gearnest.com</code> / <code className="text-white">admin123</code></p>
      </div>

      <p className="text-center text-xs text-slate-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-emerald-400 hover:underline">
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-slate-400 text-sm">Memuat form login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
