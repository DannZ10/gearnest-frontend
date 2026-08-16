'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Mountain, User, Mail, Lock, Phone, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/register', formData);
      const { user, token } = res.data.data;
      setAuth(user, token, user.role);
      toast.success('Pendaftaran akun berhasil!');
      router.push('/account');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registrasi gagal. Coba email lain.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-ink/10 rounded-3xl p-8 shadow-xl shadow-ink/5 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink text-ember">
              <Mountain className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span className="text-ink tracking-wide">GEAR<span className="text-ember">NEST</span></span>
          </Link>
          <h2 className="font-display font-bold uppercase text-xl text-ink pt-2">Daftar Akun Baru</h2>
          <p className="text-xs text-ink/55">Nikmati kemudahan sewa peralatan gunung terlengkap</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Field icon={User} label="Nama Lengkap">
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              placeholder="Rizal Pendaki" className={inputCls} />
          </Field>
          <Field icon={Mail} label="Email">
            <input type="email" name="email" required value={formData.email} onChange={handleChange}
              placeholder="nama@email.com" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field icon={Lock} label="Password">
              <input type="password" name="password" required value={formData.password} onChange={handleChange}
                placeholder="Min 8 karakter" className={inputCls} />
            </Field>
            <Field icon={Lock} label="Konfirmasi">
              <input type="password" name="password_confirmation" required value={formData.password_confirmation} onChange={handleChange}
                placeholder="Ulangi password" className={inputCls} />
            </Field>
          </div>

          <Field icon={Phone} label="Nomor WhatsApp">
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="081234567890" className={inputCls} />
          </Field>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-ember hover:bg-ember-2 text-white font-display font-semibold uppercase tracking-wide rounded-xl shadow-lg shadow-ember/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Daftar Akun'}
          </button>
        </form>

        <p className="text-center text-xs text-ink/55">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-ember-2 hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  'w-full bg-bone border border-ink/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:border-ember';

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
